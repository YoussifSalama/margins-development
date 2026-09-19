import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const dev = process.env.NODE_ENV !== "production";

// One policy for the whole app. Without nonces Next's own inline bootstrap scripts need
// 'unsafe-inline', so this CSP is mainly about WHERE things may load from and go to: no foreign
// scripts, no framing, no form posts or base-tag tricks, uploads only to R2.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.r2.cloudflarestorage.com${dev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" }, // older browsers; frame-ancestors covers the rest
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // the CMS and the JSON endpoints must never be cached by a shared cache or indexed
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  // /news and /blogs were merged into the Media Center. Old links (with or without the
  // locale prefix) keep working; every post used to be reachable under both, so both map.
  async redirects() {
    const locale = "/:locale(en|ar)";
    return ["news", "blogs"].flatMap((old) => [
      { source: `${locale}/${old}`, destination: "/:locale/media", permanent: true },
      { source: `${locale}/${old}/:slug`, destination: "/:locale/media/:slug", permanent: true },
      { source: `/${old}`, destination: "/media", permanent: true },
      { source: `/${old}/:slug`, destination: "/media/:slug", permanent: true },
    ]);
  },
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      // uploads from the CMS (Cloudflare R2 public URL)
      ...(process.env.CLOUDFLARE_PUBLIC_URL ? [{ hostname: new URL(process.env.CLOUDFLARE_PUBLIC_URL).hostname }] : []),
    ],
    // SVGs can carry script; nothing on the site needs them through the optimiser
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);

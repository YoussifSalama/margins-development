import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
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
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);

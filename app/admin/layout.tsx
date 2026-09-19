import type { Metadata } from "next";
import { Inter, Alexandria } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./admin.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Arabic content fields render in Alexandria, same as the public site
const alexandria = Alexandria({ variable: "--font-alexandria", subsets: ["arabic"] });

export const metadata: Metadata = {
  title: { default: "Margins CMS", template: "%s · Margins CMS" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className={`${inter.variable} ${alexandria.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

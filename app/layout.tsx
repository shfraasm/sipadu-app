import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SIPADU - Sistem Pengaduan Pelayanan Publik",
  description:
    "Platform pengaduan pelayanan publik untuk masyarakat Indonesia. Sampaikan keluhan dan pantau status laporan Anda dengan mudah.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html lang="id" className={outfit.variable} suppressHydrationWarning>
  <body
    className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}
  >
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
    {process.env.NODE_ENV === "production" && <Analytics />}
  </body>
</html>
  );
}

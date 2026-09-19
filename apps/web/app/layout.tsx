import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteShell } from "@/components/shell/site-shell";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: {
    default: "Golf Solutions",
    template: "%s · Golf Solutions",
  },
  description:
    "TrackMan fitting, licensed coaching, and pro shop — Golf Solutions Jakarta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={oswald.variable}>
      <body className={`${oswald.className} antialiased`}>
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}

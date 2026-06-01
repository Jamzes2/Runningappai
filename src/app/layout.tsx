import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RunSynergy // Elite Athlete Dashboard",
  description: "RunSynergy is a professional sports analytics and AI coaching dashboard for elite runners aiming to unlock new personal records.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body className="font-sans antialiased bg-brandBg text-textPrimary overflow-hidden w-screen h-screen">
        {children}
      </body>
    </html>
  );
}

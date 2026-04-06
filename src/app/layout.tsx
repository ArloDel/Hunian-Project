import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hunian Mahmudah",
  description:
    "Platform pemesanan kost dan kontrakan online untuk mencari unit, booking, dan memantau pembayaran dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

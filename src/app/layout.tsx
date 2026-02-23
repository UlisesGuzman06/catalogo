import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Catálogo de Servicios",
  description:
    "Catálogo de Servicios de Interoperabilidad - Gobierno de Mendoza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={cn(
          inter.variable,
          "antialiased font-sans min-h-screen flex flex-col",
        )}
      >
        {children}
      </body>
    </html>
  );
}

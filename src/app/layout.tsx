import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Catálogo de Servicios",
  description:
    "Catálogo de Servicios de Interoperabilidad - Gobierno de Mendoza",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={cn(
          "antialiased font-sans min-h-screen flex flex-col"
        )}
      >
        {children}
      </body>
    </html>
  );
}

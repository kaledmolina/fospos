import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});


export const metadata: Metadata = {
  title: "POS Colombia - Sistema Multi-Tenant",
  description: "Sistema POS SaaS para pequeños y medianos comercios en Colombia. Control de inventario, ventas, fiados y más.",
  keywords: ["POS", "Colombia", "Punto de Venta", "Inventario", "Fiados", "SaaS"],
  authors: [{ name: "POS Colombia Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
          <SonnerToaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}

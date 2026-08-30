import type { Metadata } from "next";
import { Press_Start_2P, Courier_Prime } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const monoFont = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARCADE VAULT",
  description:
    "Plataforma para jugar online y competir por la mayor cantidad de puntos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${pixelFont.variable} ${monoFont.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <div className="bg-glow" />
        <div className="bg-grid" />
        <div className="bg-scanlines" />
        <div id="app">{children}</div>
      </body>
    </html>
  );
}

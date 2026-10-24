import "./globals.css";
import { Figtree, Cormorant_Garamond } from "next/font/google";

const figtree = Figtree({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body"
});

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-display"
});

export const metadata = {
  title: "Aether Studio — сайты, которые собирают заявки",
  description:
    "Веб-студия: лендинги и корпоративные сайты под ключ. ИИ-помощник собирает бриф за минуту."
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${figtree.variable} ${display.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-body), Figtree, system-ui, sans-serif"
        }}
      >
        {children}
      </body>
    </html>
  );
}

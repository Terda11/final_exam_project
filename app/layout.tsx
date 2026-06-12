import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const SITE_NAME = "TechShop";
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techshop.io";
const SITE_DESC =
  "Shop the latest smartphones, laptops, audio gear, gaming consoles, and accessories. Genuine products, fast delivery, and 2-year warranty. Secure mock checkout for demos.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:  `${SITE_NAME} — Premium Electronics`,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESC,

  keywords: [
    "electronics",
    "smartphones",
    "laptops",
    "gaming",
    "audio",
    "headphones",
    "iPhone",
    "MacBook",
    "Samsung",
    "Sony",
    "PlayStation",
    "tech accessories",
  ],

  authors:   [{ name: "TechShop", url: SITE_URL }],
  creator:   "TechShop",
  publisher: "TechShop",
  category:  "marketplace",

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  openGraph: {
    type:     "website",
    locale:   "en_US",
    url:      SITE_URL,
    siteName: SITE_NAME,
    title:    `${SITE_NAME} — Premium Electronics`,
    description: SITE_DESC,
  },

  twitter: {
    card:    "summary_large_image",
    site:    "@techshop",
    creator: "@techshop",
    title:   `${SITE_NAME} — Premium Electronics`,
    description: SITE_DESC,
  },

  icons: {
    icon:    [{ url: "/favicon.ico", sizes: "any" }],
    apple:   [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },

  applicationName: SITE_NAME,
  appleWebApp: {
    capable:        true,
    title:          SITE_NAME,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1d4ed8" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0f1e" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

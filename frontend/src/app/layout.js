import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const title = "PENRO Pampanga Online Applications";
const description =
  "Apply online for Residential Free Patent, Agricultural Free Patent, Tree Cutting Permit, and Chainsaw Registration at PENRO Pampanga. Submit and track your application in one place.";
export const metadata = {
  metadataBase: new URL("https://penropampanga.online"),

  title: {
    default: title,
    template: "%s | PENRO Portal",
  },
  description: description,
  applicationName: "PENRO Portal",
  keywords: [
    "PENRO",
    "DENR",
    "Pampanga",
    "Residential Free Patent",
    "Agricultural Free Patent",
    "Tree Cutting Permit",
    "Chainsaw Registration",
    "online application",
  ],
  authors: [{ name: "CAPSTONE-IT-16" }],

  icons: {
    icon: "/denrlogo.png",
  },

  openGraph: {
    title: title,
    description: description,
    siteName: "PENRO Portal",
    url: "/",
    locale: "en_PH",
    type: "website",
    images: [{ url: "/denrlogo.png", alt: "DENR logo" }],
  },

  twitter: {
    card: "summary",
    title: title,
    description: description,
    images: ["/denrlogo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full min-w-full flex flex-col">
        {children} <Toaster />
      </body>
    </html>
  );
}

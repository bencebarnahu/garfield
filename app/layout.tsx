import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Sticker Exchange - Track & Trade Your Sticker Album",
  description:
    "Track your sticker album collection, find duplicates, and trade with collectors worldwide.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#22a563",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}

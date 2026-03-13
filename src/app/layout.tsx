import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import "@/styles/shared.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TrackME",
  description: "Track your activities",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geistSans.variable}>{children}</body>
    </html>
  )
}

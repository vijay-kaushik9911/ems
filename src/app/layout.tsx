import type { Metadata } from "next"
import type React from "react"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "../firebase/authContext"
import { Providers } from "./lib/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Employee Management System",
  description: "Login system for employees and leads. Modern dashboard built with Next.js.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
              {children}
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}

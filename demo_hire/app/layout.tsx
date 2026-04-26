
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Playfair_Display, Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair'
})
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

// Note: Metadata cannot be used with 'use client', remove if needed in production
export const metadata: Metadata = {
  title: 'The Merit-Loop Engine',
  description: 'Democratize Technical Hiring. Prove Raw Potential.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased" style={{ fontFamily: 'var(--font-inter)' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

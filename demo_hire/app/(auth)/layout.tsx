import { ReactNode } from 'react'
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
})

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${jakarta.variable} ${spaceGrotesk.variable}`}>
      {children}
    </div>
  )
}

import type { Metadata } from 'next'
import { Inter, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'GTA VI Tracker — Leonida Progress',
  description: 'Track your GTA VI mission and chapter progress. See how the community is doing.',
  openGraph: {
    title: 'GTA VI Tracker',
    description: 'Your Leonida progress, shared.',
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`}>
      <body className="bg-vc-black text-vc-text font-body antialiased">
        {children}
      </body>
    </html>
  )
}

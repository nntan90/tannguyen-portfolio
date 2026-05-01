import './globals.css'
import type { Metadata } from 'next'
import { IBM_Plex_Mono, Space_Mono } from 'next/font/google'

const ibmPlexMono = IBM_Plex_Mono({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono'
})

const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono'
})

export const metadata: Metadata = {
  title: 'Tan Nguyen - Portfolio',
  description: 'Tan Nguyen — QA/QC Engineer Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${ibmPlexMono.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fangorn | Intent-Bound Data for Web3',
  description: 'Privacy-preserving conditional encryption using zero-knowledge proofs. Your data unlocks only when conditions are met.',
  keywords: ['Web3', 'encryption', 'zero-knowledge proofs', 'privacy', 'blockchain', 'conditional data'],
  authors: [{ name: 'Fangorn' }],
  openGraph: {
    title: 'Fangorn | Intent-Bound Data for Web3',
    description: 'Privacy-preserving conditional encryption using zero-knowledge proofs.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <body className="antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}

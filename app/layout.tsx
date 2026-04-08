import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Flyer IA Turístico | Diseños elegantes con Gemini',
  description: 'Crea flyers turísticos modernos con inteligencia artificial. Sube imagen y texto, y obtén un diseño profesional.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
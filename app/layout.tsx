import { AppProviders } from '@/providers/AppProviders'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StudentPerks - Exclusive Student Deals & Discounts',
  description: 'Discover exclusive deals and discounts for students. Save money on your favorite brands and services.',
  keywords: 'student discounts, deals, offers, university perks, student savings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}

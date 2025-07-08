import { AppProviders } from '@/providers/AppProviders'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

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
      <body className={outfit.className} suppressHydrationWarning>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}

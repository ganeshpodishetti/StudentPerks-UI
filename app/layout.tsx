import { Footer } from '@/shared/components/layout/Footer/Footer'
import { AppProviders } from '@/shared/providers/AppProviders'
import { Outfit } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata = {
  title: "StudentPerks - Exclusive Student Deals & Discounts",
  description:
    "Discover exclusive deals and discounts for students. Save money on your favorite brands and services.",
  keywords:
    "student discounts, deals, offers, university perks, student savings",
  icons: {
    icon: [
      { url: "/studentperks.png", type: "image/png" }
    ],
    shortcut: "/studentperks.png",
    apple: "/studentperks.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/studentperks.png" type="image/png" />
        <link rel="apple-touch-icon" href="/studentperks.png" />
      </head>
      <body
        className={
          outfit.className + " bg-background dark:bg-background min-h-screen"
        }
        suppressHydrationWarning
        style={{
          backgroundColor: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          minHeight: "100vh",
          WebkitOverflowScrolling: "touch",
          WebkitTapHighlightColor: "transparent",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <AppProviders>{children}</AppProviders>
        <Footer />
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}

import { LanguageProvider } from '@/contexts/LanguageContext'
import { AwardsProvider } from '@/contexts/AwardsContext'
import LanguageSwitch from '@/components/LanguageSwitch'
import './globals.css'
import { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  title: '科学奖项集锦',
  description: '探索世界各地的科学奖项，了解科学界的杰出成就',
  icons: {
    icon: '/logoipsum-268.svg',      
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AwardsProvider>
            <LanguageSwitch />
            {children}
            <GoogleAnalytics />
          </AwardsProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

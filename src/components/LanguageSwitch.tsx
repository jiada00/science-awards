'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useAwards } from '@/contexts/AwardsContext'
import { usePathname, useRouter } from 'next/navigation'

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()
  const { getOtherLanguageTitle } = useAwards()
  const pathname = usePathname()
  const router = useRouter()

  const handleLanguageSwitch = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh'
    
    // 如果在详情页面，更新 URL
    if (pathname.startsWith('/awards/')) {
      const currentTitle = decodeURIComponent(pathname.split('/').pop() || '')
      const newTitle = getOtherLanguageTitle(currentTitle, language)
      
      if (newTitle) {
        router.push(`/awards/${encodeURIComponent(newTitle)}`)
      }
    }
    
    setLanguage(newLanguage)
  }

  return (
    <button
      onClick={handleLanguageSwitch}
      className="fixed top-4 right-4 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
    >
      {language === 'zh' ? 'English' : '中文'}
    </button>
  )
} 
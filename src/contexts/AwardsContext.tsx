'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Award } from '@/types/award'

interface AwardsContextType {
  awards: {
    zh: Award[]
    en: Award[]
  }
  deleteAward: (title: string) => Promise<void>
  getOtherLanguageTitle: (currentTitle: string, currentLanguage: 'zh' | 'en') => string | undefined
  isLoading: boolean
}

const AwardsContext = createContext<AwardsContextType | undefined>(undefined)

export function AwardsProvider({ children }: { children: ReactNode }) {
  const [awards, setAwards] = useState<{ zh: Award[]; en: Award[] }>({ zh: [], en: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [titleMap, setTitleMap] = useState(new Map<string, { zh: string; en: string }>())

  // 加载数据
  useEffect(() => {
    fetch('/api/awards')
      .then(res => res.json())
      .then(data => {
        setAwards({
          zh: data.zh.sort((a: Award, b: Award) => b.pageviews - a.pageviews),
          en: data.en.sort((a: Award, b: Award) => b.pageviews - a.pageviews)
        })

        // 创建标题映射，使用 URL 作为匹配键
        const newTitleMap = new Map<string, { zh: string; en: string }>()
        const urlToTitles = new Map<string, { zh?: string; en?: string }>()

        // 收集中文标题
        data.zh.forEach((award: Award) => {
          if (!urlToTitles.has(award.url)) {
            urlToTitles.set(award.url, { zh: award.title })
          } else {
            urlToTitles.get(award.url)!.zh = award.title
          }
        })

        // 收集英文标题
        data.en.forEach((award: Award) => {
          if (!urlToTitles.has(award.url)) {
            urlToTitles.set(award.url, { en: award.title })
          } else {
            urlToTitles.get(award.url)!.en = award.title
          }
        })

        // 创建标题映射
        urlToTitles.forEach((titles) => {
          if (titles.zh && titles.en) {
            newTitleMap.set(titles.zh, { zh: titles.zh, en: titles.en })
            newTitleMap.set(titles.en, { zh: titles.zh, en: titles.en })
          }
        })

        setTitleMap(newTitleMap)
        setIsLoading(false)
      })
  }, [])

  const deleteAward = async (title: string) => {
    try {
      const response = await fetch('/api/awards', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })

      if (!response.ok) throw new Error('Failed to delete award')

      setAwards(prev => ({
        zh: prev.zh.filter(award => award.title !== title),
        en: prev.en.filter(award => award.title !== title)
      }))
    } catch (error) {
      console.error('Error deleting award:', error)
    }
  }

  const getOtherLanguageTitle = (currentTitle: string, currentLanguage: 'zh' | 'en') => {
    const titles = titleMap.get(currentTitle)
    if (!titles) return undefined
    return currentLanguage === 'zh' ? titles.en : titles.zh
  }

  return (
    <AwardsContext.Provider value={{ awards, deleteAward, getOtherLanguageTitle, isLoading }}>
      {children}
    </AwardsContext.Provider>
  )
}

export function useAwards() {
  const context = useContext(AwardsContext)
  if (context === undefined) {
    throw new Error('useAwards must be used within an AwardsProvider')
  }
  return context
} 
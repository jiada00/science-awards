'use client'

import Link from 'next/link'
import { Award } from '@/types/award'
import { useAwards } from '@/contexts/AwardsContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface AwardCardProps {
  award: Award
}

// 获取第一句话的函数
const getFirstSentence = (text: string) => {
  // 特殊缩写模式
  const abbreviations = /(?:[A-Z]\.)+\s+[A-Z]\./
  
  // 如果开头是缩写，先保留完整缩写
  const hasAbbrev = text.match(abbreviations)
  if (hasAbbrev) {
    const abbrevEnd = hasAbbrev.index! + hasAbbrev[0].length
    const restText = text.slice(abbrevEnd)
    const match = restText.match(/^[^。.！!？?]+[。.！!？?]/)
    if (match) {
      return hasAbbrev[0] + match[0]
    }
  }
  
  // 普通句子处理
  const match = text.match(/^[^。.！!？?]+[。.！!？?]/)
  const firstSentence = match ? match[0] : text
  
  // 如果第一句话太短，就返回更多内容
  if (firstSentence.length < 20) {
    const twoSentences = text.match(/^[^。.！!？?]+[。.！!？?][^。.！!？?]+[。.！!？?]/)
    return twoSentences ? twoSentences[0] : text
  }
  
  return firstSentence
}

export default function AwardCard({ award }: AwardCardProps) {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const currentPage = searchParams.get('page') || '1'

  return (
    <Link 
      href={`/awards/${encodeURIComponent(award.title)}?returnPage=${currentPage}`}
    >
      <div className="p-6 h-full backdrop-blur-md flex flex-col relative group">
        <h3 className="text-xl font-bold mb-4 text-emerald-300 line-clamp-2 min-h-[3.5rem]">
          {award.title}
        </h3>
        
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-200 rounded text-sm">
            {award.category_level1}
          </span>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-200 rounded text-sm">
            {award.category_level2}
          </span>
        </div>

        <p className="text-gray-300 mb-6 line-clamp-3 min-h-[4.5rem] text-base leading-relaxed">
          {getFirstSentence(award.summary)}
        </p>
        
        <div className="flex justify-between text-sm text-gray-400 mt-auto pt-4 border-t border-slate-700/50">
          <span className="line-clamp-1">{award.organization}</span>
        </div>
      </div>
    </Link>
  )
} 
'use client'

import { Award } from '@/types/award'
import { useAwards } from '@/contexts/AwardsContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import { use } from 'react'
import { useSearchParams } from 'next/navigation'

interface Props {
  params: Promise<{
    title: string
  }>
}

export default function AwardDetail({ params }: Props) {
  const resolvedParams = use(params)
  const { language } = useLanguage()
  const { awards } = useAwards()
  const searchParams = useSearchParams()
  const returnPage = searchParams.get('returnPage') || '1'
  
  const award = awards[language].find((a: Award) => 
    a.title === decodeURIComponent(resolvedParams.title)
  )
  
  if (!award) {
    return <div>奖项未找到</div>
  }

  return (
    <div className="grid-pattern min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Link 
          href={`/?page=${returnPage}`}
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {language === 'zh' ? '返回列表' : 'Back to List'}
        </Link>

        <article className="glass-card p-8 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-200 rounded-full text-sm">
              {award.category_level1}
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-200 rounded-full text-sm">
              {award.category_level2}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-6 gradient-text">{award.title}</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-300 mb-8">{award.summary}</p>
            
            <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-emerald-300">
                {language === 'zh' ? '基本信息' : 'Basic Information'}
              </h2>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm text-gray-400 mb-1">
                    {language === 'zh' ? '颁奖机构' : 'Organization'}
                  </dt>
                  <dd className="text-gray-200">{award.organization}</dd>
                </div>
              </dl>
            </div>

            {award.url && (
              <a 
                href={award.url}
                target="_blank"
                rel="noopener noreferrer" 
                className="inline-flex items-center px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg transition-colors"
              >
                <span>{language === 'zh' ? '查看更多信息' : 'View More Information'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            )}
          </div>
        </article>
      </main>
    </div>
  )
} 
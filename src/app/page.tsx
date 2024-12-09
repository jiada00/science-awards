'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Award } from '@/types/award'
import AwardCard from '@/components/AwardCard'
import SearchFilters from '@/components/SearchFilters'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAwards } from '@/contexts/AwardsContext'

// 修改包装组件的类型定义
function SearchParamsWrapper({ 
  children 
}: { 
  children: (searchParams: ReturnType<typeof useSearchParams>) => React.ReactElement 
}) {
  const searchParams = useSearchParams()
  return children(searchParams)
}

export default function Home() {
  const router = useRouter()
  const { language } = useLanguage()
  const { awards, isLoading } = useAwards()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  if (isLoading) {
    return <div>Loading...</div>
  }

  // 筛选奖项
  const filteredAwards = awards[language].filter((award: Award) => {
    const matchesSearch = award.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         award.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // 分页逻辑
  const itemsPerPage = 9
  const pageCount = Math.ceil(filteredAwards.length / itemsPerPage)
  const paginatedAwards = filteredAwards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // 生成分页按钮
  const getPageButtons = () => {
    const buttons = []
    const maxVisiblePages = 5

    // 总是显示第一页
    buttons.push(
      <button
        key={1}
        onClick={() => setCurrentPage(1)}
        className={`px-3 py-1 rounded-lg ${
          currentPage === 1 
            ? 'bg-emerald-500 text-white' 
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }`}
      >
        1
      </button>
    )

    let startPage = Math.max(2, currentPage - 1)
    let endPage = Math.min(pageCount - 1, currentPage + 1)

    // 如果当前页靠近开始
    if (currentPage <= 3) {
      endPage = Math.min(maxVisiblePages - 1, pageCount - 1)
    }
    // 如果当前页靠近结束
    else if (currentPage >= pageCount - 2) {
      startPage = Math.max(2, pageCount - (maxVisiblePages - 2))
    }

    // 添加省略号
    if (startPage > 2) {
      buttons.push(<span key="ellipsis1" className="px-2">...</span>)
    }

    // 添加中间的页码
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === i 
              ? 'bg-emerald-500 text-white' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {i}
        </button>
      )
    }

    // 添加结束省略号
    if (endPage < pageCount - 1) {
      buttons.push(<span key="ellipsis2" className="px-2">...</span>)
    }

    // 总是显示最后一页
    if (pageCount > 1) {
      buttons.push(
        <button
          key={pageCount}
          onClick={() => setCurrentPage(pageCount)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === pageCount 
              ? 'bg-emerald-500 text-white' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {pageCount}
        </button>
      )
    }

    return buttons
  }

  return (
    <div className="grid-pattern min-h-screen">
      <main className="container mx-auto px-6 py-16">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchParamsWrapper>
            {(searchParams) => {
              // 从 URL 参数获取页码
              useEffect(() => {
                const page = searchParams.get('page')
                if (page) {
                  setCurrentPage(parseInt(page))
                }
              }, [searchParams])

              // 当页码改变时更新 URL
              useEffect(() => {
                const params = new URLSearchParams(searchParams.toString())
                if (currentPage === 1) {
                  params.delete('page')
                } else {
                  params.set('page', currentPage.toString())
                }
                router.replace(`/?${params.toString()}`)
              }, [currentPage, searchParams])

              return (
                <>
                  {/* 标题区域 */}
                  <div className="text-center mb-20 relative">
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]" />
                    </div>
                    
                    <h1 className="text-6xl font-bold mb-6 gradient-text">
                      {language === 'zh' ? '科学奖项集锦' : 'Science Awards Collection'}
                    </h1>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                      {language === 'zh' 
                        ? '探索世界各地的科学奖项，了解科学界的杰出成就'
                        : 'Explore science awards worldwide and discover outstanding achievements'
                      }
                    </p>

                    {/* 搜索框 */}
                    <div className="max-w-2xl mx-auto">
                      <SearchFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                      />
                    </div>
                  </div>

                  {/* 奖项列表 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-4">
                    {paginatedAwards.map((award: Award) => (
                      <div key={award.title} className="glass-card h-full">
                        <AwardCard award={award} />
                      </div>
                    ))}
                  </div>

                  {/* 分页控件 */}
                  {pageCount > 1 && (
                    <div className="flex justify-center gap-3 mt-16">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50 transition-colors"
                      >
                        上一页
                      </button>

                      {getPageButtons()}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
                        disabled={currentPage === pageCount}
                        className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50 transition-colors"
                      >
                        下一页
                      </button>
                    </div>
                  )}
                </>
              )
            }}
          </SearchParamsWrapper>
        </Suspense>
      </main>
    </div>
  )
}

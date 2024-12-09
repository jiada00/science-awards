import { Award } from '@/types/award'
import awardsZh from './awards_zh.json'
import awardsEn from './awards_en.json'

const awardsData = {
  zh: awardsZh,
  en: awardsEn
}

export function getAwards(language: 'zh' | 'en'): Award[] {
  return awardsData[language]
    .map((item: Award) => ({
      title: item.title,
      summary: item.summary,
      category_level1: item.category_level1,
      category_level2: item.category_level2,
      organization: item.organization,
      url: item.url,
      pageviews: item.pageviews
    }))
    .sort((a: Award, b: Award) => b.pageviews - a.pageviews)
}
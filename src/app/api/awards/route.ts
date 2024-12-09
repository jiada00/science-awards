import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// 获取所有奖项
export async function GET() {
  try {
    const zhPath = path.join(process.cwd(), 'src/data/awards_zh.json')
    const enPath = path.join(process.cwd(), 'src/data/awards_en.json')
    
    const [zhContent, enContent] = await Promise.all([
      fs.readFile(zhPath, 'utf8'),
      fs.readFile(enPath, 'utf8')
    ])

    return NextResponse.json({
      zh: JSON.parse(zhContent),
      en: JSON.parse(enContent)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load awards' }, { status: 500 })
  }
}

// 删除奖项
export async function DELETE(request: Request) {
  try {
    const { title } = await request.json()
    
    const zhPath = path.join(process.cwd(), 'src/data/awards_zh.json')
    const enPath = path.join(process.cwd(), 'src/data/awards_en.json')
    
    const [zhContent, enContent] = await Promise.all([
      fs.readFile(zhPath, 'utf8'),
      fs.readFile(enPath, 'utf8')
    ])

    const zhAwards = JSON.parse(zhContent)
    const enAwards = JSON.parse(enContent)

    // 找到对应的索引
    const zhIndex = zhAwards.findIndex((award: any) => award.title === title)
    const enIndex = enAwards.findIndex((award: any) => award.title === title)

    // 删除奖项
    if (zhIndex > -1) zhAwards.splice(zhIndex, 1)
    if (enIndex > -1) enAwards.splice(enIndex, 1)

    // 写回文件
    await Promise.all([
      fs.writeFile(zhPath, JSON.stringify(zhAwards, null, 2), 'utf8'),
      fs.writeFile(enPath, JSON.stringify(enAwards, null, 2), 'utf8')
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete award' }, { status: 500 })
  }
} 
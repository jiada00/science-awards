import { NextResponse } from 'next/server'
import awards_zh from '@/data/awards_zh.json'
import awards_en from '@/data/awards_en.json'

export async function GET() {
  return NextResponse.json({
    zh: awards_zh,
    en: awards_en
  })
}

export async function DELETE(request: Request) {
  const { title } = await request.json()
  // 处理删除逻辑...
  return NextResponse.json({ success: true })
} 
import { NextResponse } from 'next/server'

// Basit bir in-memory store (production'da veritabanı kullanılmalı)
let viewCount = 0
const viewedUsers = new Set<string>()

export async function GET() {
  return NextResponse.json({ count: viewCount })
}

export async function POST(request: Request) {
  const { userId } = await request.json()
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  // Eğer bu kullanıcı daha önce görüntüleme yapmadıysa
  if (!viewedUsers.has(userId)) {
    viewedUsers.add(userId)
    viewCount++
  }

  return NextResponse.json({ count: viewCount, viewed: viewedUsers.has(userId) })
}


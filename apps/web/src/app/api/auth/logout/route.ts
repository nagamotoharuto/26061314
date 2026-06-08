import { NextResponse } from 'next/server'
import { getStaffSession } from '@/lib/auth'

export async function POST() {
  try {
    const session = await getStaffSession()
    session.destroy()
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL', message: 'サーバーエラーが発生しました' } },
      { status: 500 }
    )
  }
}

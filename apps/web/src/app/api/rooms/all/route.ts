import { NextResponse } from 'next/server'
import { getStaffSession } from '@/lib/auth'
import { roomService } from '@/server/services/room-service'

export async function GET() {
  try {
    const session = await getStaffSession()
    if (!session.isStaff) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: '認証が必要です' } },
        { status: 401 }
      )
    }
    const rooms = await roomService.getAllRooms()
    return NextResponse.json({ rooms })
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL', message: 'サーバーエラーが発生しました' } },
      { status: 500 }
    )
  }
}

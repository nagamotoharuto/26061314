import { NextRequest, NextResponse } from 'next/server'
import { getStaffSession } from '@/lib/auth'
import { eventService } from '@/server/services/event-service'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const session = await getStaffSession()
    if (!session.isStaff) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: '認証が必要です' } },
        { status: 401 }
      )
    }

    await eventService.deleteByRoomId(params.roomId)
    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e instanceof Error && e.message === '部屋が見つかりません') {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: e.message } },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL', message: 'サーバーエラーが発生しました' } },
      { status: 500 }
    )
  }
}

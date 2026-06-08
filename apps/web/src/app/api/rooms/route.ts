import { NextRequest, NextResponse } from 'next/server'
import { roomService } from '@/server/services/room-service'

export async function GET(request: NextRequest) {
  try {
    const floor = parseInt(request.nextUrl.searchParams.get('floor') ?? '1', 10)
    if (isNaN(floor) || floor < 1 || floor > 4) {
      return NextResponse.json(
        { error: { code: 'INVALID_FLOOR', message: '階数は1〜4を指定してください' } },
        { status: 400 }
      )
    }
    const rooms = await roomService.getRoomsForFloor(floor)
    return NextResponse.json({ rooms })
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL', message: 'サーバーエラーが発生しました' } },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getStaffSession } from '@/lib/auth'
import { eventService, EventUpsertSchema } from '@/server/services/event-service'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const session = await getStaffSession()
    if (!session.isStaff) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: '認証が必要です' } },
        { status: 401 }
      )
    }

    const body = EventUpsertSchema.parse(await request.json())
    const event = await eventService.upsert(body)
    return NextResponse.json({ event })
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION', message: e.errors[0]?.message ?? '入力値が不正です' } },
        { status: 400 }
      )
    }
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

import { NextRequest, NextResponse } from 'next/server'
import { getStaffSession } from '@/lib/auth'
import { z, ZodError } from 'zod'

const LoginSchema = z.object({
  password: z.string().min(1, 'パスワードを入力してください'),
})

export async function POST(request: NextRequest) {
  try {
    const body = LoginSchema.parse(await request.json())

    const staffPassword = process.env.STAFF_PASSWORD
    if (!staffPassword || body.password !== staffPassword) {
      return NextResponse.json(
        { error: { code: 'INVALID_PASSWORD', message: 'パスワードが正しくありません' } },
        { status: 401 }
      )
    }

    const session = await getStaffSession()
    session.isStaff = true
    await session.save()

    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION', message: e.errors[0]?.message ?? '入力値が不正です' } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL', message: 'サーバーエラーが発生しました' } },
      { status: 500 }
    )
  }
}

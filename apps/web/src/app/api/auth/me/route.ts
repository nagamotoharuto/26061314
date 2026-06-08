import { NextResponse } from 'next/server'
import { getStaffSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getStaffSession()
    return NextResponse.json({ isStaff: session.isStaff ?? false })
  } catch {
    return NextResponse.json({ isStaff: false })
  }
}

import { getIronSession, type IronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface StaffSession {
  isStaff?: boolean
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET ?? 'fallback-secret-please-set-env-32chars!!',
  cookieName: 'staff-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 8, // 8時間
  },
}

export async function getStaffSession(): Promise<IronSession<StaffSession>> {
  return getIronSession<StaffSession>(cookies(), sessionOptions)
}

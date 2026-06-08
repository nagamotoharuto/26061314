import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/staff') && !pathname.startsWith('/staff/login')) {
    const sessionCookie = request.cookies.get('staff-session')
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/staff/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/staff/:path*'],
}

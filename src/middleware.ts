import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const publicUrl = ['/', '/login', '/signup'];
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('token');

    if (publicUrl.includes(path) && token) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
        //return NextResponse.redirect(new URL('/profile', request.url))
    }

    if (!publicUrl.includes(path) && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/login', '/signup', '/dashboard/:path*'],
}
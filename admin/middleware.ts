import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const admin = req.cookies.get('admin');

  if (!admin) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/orders/:path*', '/services/:path*', '/users/:path*'],
};


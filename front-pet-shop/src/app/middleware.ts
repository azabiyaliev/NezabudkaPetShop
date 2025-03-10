import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const user = req.cookies.get('user');

    const publicPaths = ['/users/login', '/signup', '/forgot-password'];
    const url = req.url;

    if (!user && !publicPaths.some(path => url.includes(path))) {

        return NextResponse.redirect(new URL('/users/login', req.url));
    }

    return NextResponse.next();
}

import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow access to login page
  if (pathname === "/login") {
    return NextResponse.next()
  }

  // For other routes, we would normally check authentication
  // In this demo, we redirect to login if needed
  // This will be enhanced when we add persistent auth

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

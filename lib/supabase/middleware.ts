import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and supabase.auth.getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith("/auth")
  const isCallbackRoute = pathname.startsWith("/auth/callback")

  // Known protected route prefixes
  const protectedPrefixes = ["/album", "/lists", "/search", "/profile", "/collector"]
  const isProtectedRoute = protectedPrefixes.some((p) => pathname.startsWith(p))

  // If it's not a protected route and not an auth route, it's a public route (e.g. /username)
  if (!isProtectedRoute && !isAuthRoute) {
    return supabaseResponse
  }

  // Protected routes: redirect to login if not authenticated
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    const redirectResponse = NextResponse.redirect(url)
    // Copy cookies from supabaseResponse to the redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // Already logged in: redirect away from auth pages (but not callback)
  if (user && isAuthRoute && !isCallbackRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/album"
    const redirectResponse = NextResponse.redirect(url)
    // Copy cookies from supabaseResponse to the redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // IMPORTANT: Always return supabaseResponse as-is for non-redirect cases
  return supabaseResponse
}

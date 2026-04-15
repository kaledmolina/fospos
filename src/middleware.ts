import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Aquí puedes añadir lógica personalizada
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/",
    },
  }
)

// Proteger todas las rutas excepto la raíz (login/registro), api/setup, api/seed y api/auth
export const config = {
  matcher: [
    "/((?!api/setup|api/seed|api/auth|api/tenants|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|$).*)",
  ],
}

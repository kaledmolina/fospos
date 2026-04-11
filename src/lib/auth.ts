import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      tenantId?: string
      tenantName?: string
      tenantStatus?: string
      branchId?: string | null
      branchName?: string | null
      theme: string
    }
  }
  interface User {
    id: string
    email: string
    name: string
    role: string
    tenantId?: string | null
    tenantName?: string | null
    tenantStatus?: string | null
    branchId?: string | null
    branchName?: string | null
    theme: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    tenantId?: string
    tenantName?: string
    tenantStatus?: string
    branchId?: string | null
    branchName?: string | null
    theme: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Authorize called with:", { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials")
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          include: { tenant: true, branch: true }
        })

        if (!user) {
          console.log("❌ User not found for email:", credentials.email)
          return null
        }
        
        console.log("✅ User found:", { id: user.id, role: user.role, isActive: user.isActive })

        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        console.log("🔐 Password match result:", passwordMatch)

        if (!passwordMatch) {
          console.log("❌ Password does not match")
          return null
        }

        // Si es usuario de tenant, verificar que el negocio esté activo
        if (user.tenantId && user.tenant?.status !== "ACTIVE") {
          console.log("❌ Tenant not active:", user.tenant?.status)
          return null
        }

        // Verificar que el usuario esté activo
        if (user.isActive === false) {
          console.log("❌ User is not active")
          return null
        }
        
        console.log("✅ Login successful for:", user.email)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
          tenantName: user.tenant?.businessName,
          tenantStatus: user.tenant?.status,
          branchId: user.branchId,
          branchName: user.branch?.name,
          theme: user.theme || "light"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.tenantId = user.tenantId
        token.tenantName = user.tenantName
        token.tenantStatus = user.tenantStatus
        token.branchId = user.branchId
        token.branchName = user.branchName
        token.theme = user.theme
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      session.user.tenantId = token.tenantId
      session.user.tenantName = token.tenantName
      session.user.tenantStatus = token.tenantStatus
      session.user.branchId = token.branchId
      session.user.branchName = token.branchName
      session.user.theme = token.theme
      return session
    }
  },
  pages: {
    signIn: "/"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "pos-saas-colombia-secret-key-2024"
}

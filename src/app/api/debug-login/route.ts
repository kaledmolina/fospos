import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log("🔍 Debug login attempt:", { email, password: password?.substring(0, 3) + "***" })
    
    // Find user
    const user = await db.user.findUnique({
      where: { email },
      include: { tenant: true, branch: true }
    })
    
    if (!user) {
      console.log("❌ User not found for email:", email)
      return NextResponse.json({
        success: false,
        error: "USER_NOT_FOUND",
        message: `No existe usuario con email: ${email}`,
        debug: { email }
      })
    }
    
    console.log("✅ User found:", {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      tenantId: user.tenantId,
      tenantStatus: user.tenant?.status
    })
    
    // Test password
    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log("🔐 Password match:", passwordMatch)
    
    if (!passwordMatch) {
      return NextResponse.json({
        success: false,
        error: "INVALID_PASSWORD",
        message: "La contraseña no coincide",
        debug: {
          userId: user.id,
          email: user.email,
          role: user.role,
          passwordProvidedLength: password?.length
        }
      })
    }
    
    // Check tenant status if applicable
    if (user.tenantId && user.tenant?.status !== "ACTIVE") {
      return NextResponse.json({
        success: false,
        error: "TENANT_INACTIVE",
        message: `El negocio está en estado: ${user.tenant?.status}`,
        debug: {
          userId: user.id,
          tenantStatus: user.tenant?.status
        }
      })
    }
    
    // Check user active
    if (user.isActive === false) {
      return NextResponse.json({
        success: false,
        error: "USER_INACTIVE",
        message: "El usuario está inactivo",
        debug: {
          userId: user.id,
          isActive: user.isActive
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: "Login debería funcionar correctamente",
      debug: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        tenantName: user.tenant?.businessName,
        branchId: user.branchId,
        branchName: user.branch?.name
      }
    })
    
  } catch (error) {
    console.error("Debug login error:", error)
    return NextResponse.json({
      success: false,
      error: "SERVER_ERROR",
      message: error instanceof Error ? error.message : "Error desconocido"
    }, { status: 500 })
  }
}

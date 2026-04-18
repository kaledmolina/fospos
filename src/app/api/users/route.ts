import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// GET - Listar usuarios del tenant
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const users = await db.user.findMany({
      where: { tenantId: session.user.tenantId },
      include: {
        branch: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Ocultar contraseñas
    const safeUsers = users.map(u => ({
      ...u,
      password: undefined
    }))

    return NextResponse.json({
      success: true,
      data: safeUsers
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo usuario (cajero/bodeguero)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId || session.user.role !== "TENANT_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado - Solo el administrador puede crear usuarios" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, password, role, branchId, phone, isQuickAccess } = body

    if (!name || (!email && !isQuickAccess) || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Nombre, email/PIN, contraseña y rol son requeridos" },
        { status: 400 }
      )
    }

    // Verificar que el rol sea válido
    if (!["CASHIER", "WAREHOUSE"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Rol inválido. Use CASHIER o WAREHOUSE" },
        { status: 400 }
      )
    }

    // Si es cajero, debe tener una sucursal asignada
    if (role === "CASHIER" && !branchId) {
      return NextResponse.json(
        { success: false, error: "Los cajeros deben tener una sucursal asignada" },
        { status: 400 }
      )
    }

    // Generar email automático si es acceso rápido
    let finalEmail = email
    if (isQuickAccess) {
      const tenant = await db.tenant.findUnique({
        where: { id: session.user.tenantId },
        select: { nit: true }
      })
      const cleanName = name.toLowerCase().replace(/\s+/g, '.')
      const cleanNit = tenant?.nit.replace(/[^0-9]/g, '') || '0000'
      finalEmail = `${cleanName}.${cleanNit}@staff.fostpos`
    }

    // Verificar que el email no exista
    const existingUser = await db.user.findUnique({
      where: { email: finalEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Este usuario ya existe (nombre duplicado en esta empresa)" },
        { status: 400 }
      )
    }

    // Verificar que la sucursal pertenezca al tenant
    if (branchId) {
      const branch = await db.branch.findFirst({
        where: { id: branchId, tenantId: session.user.tenantId }
      })

      if (!branch) {
        return NextResponse.json(
          { success: false, error: "Sucursal no encontrada" },
          { status: 400 }
        )
      }
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        email: finalEmail,
        password: hashedPassword,
        role,
        tenantId: session.user.tenantId,
        branchId: role === "CASHIER" ? branchId : null,
        phone
      },
      include: {
        branch: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Usuario creado exitosamente",
      data: {
        ...user,
        password: undefined
      }
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

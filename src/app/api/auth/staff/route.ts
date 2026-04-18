import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nit = searchParams.get("nit")

    if (!nit) {
      return NextResponse.json(
        { success: false, error: "NIT es requerido" },
        { status: 400 }
      )
    }

    // Buscar el tenant por NIT
    const tenant = await db.tenant.findUnique({
      where: { nit },
      select: { 
        id: true,
        businessName: true,
        status: true
      }
    })

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Negocio no encontrado" },
        { status: 404 }
      )
    }

    if (tenant.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "El negocio no está activo" },
        { status: 403 }
      )
    }

    // Buscar sucursales activas
    const branches = await db.branch.findMany({
      where: { tenantId: tenant.id, isActive: true },
      select: { id: true, name: true, isMain: true },
      orderBy: { isMain: "desc" }
    })

    // Buscar usuarios que no sean administradores (CASHIER, WAREHOUSE)
    const staff = await db.user.findMany({
      where: { 
        tenantId: tenant.id,
        role: { in: ["CASHIER", "WAREHOUSE"] },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        branches: {
          select: { id: true }
        }
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: {
        businessName: tenant.businessName,
        staff: staff,
        branches: branches
      }
    })
  } catch (error) {
    console.error("Error fetching staff list:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

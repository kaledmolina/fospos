import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    // Solo el administrador del tenant puede ver los logs de auditoría
    if (session.user.role !== "TENANT_ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No tienes permisos para ver el historial de auditoría" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const entity = searchParams.get("entity")

    const where: any = {
      tenantId: session.user.tenantId
    }

    if (action) where.action = action
    if (entity) where.entity = entity

    const logs = await db.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 200 // Limitamos a los últimos 200 por rendimiento
    })

    return NextResponse.json({
      success: true,
      data: logs
    })
  } catch (error) {
    console.error("❌ Error fetching activity logs:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

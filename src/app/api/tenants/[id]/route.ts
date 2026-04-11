import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Obtener un tenant específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const tenant = await db.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            customers: true,
            sales: true,
            users: true
          }
        }
      }
    })

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Negocio no encontrado" },
        { status: 404 }
      )
    }

    // Obtener ventas totales
    const sales = await db.sale.aggregate({
      where: { tenantId: id },
      _sum: { total: true }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...tenant,
        totalSales: sales._sum.total || 0
      }
    })
  } catch (error) {
    console.error("Error fetching tenant:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar estado del tenant (Activar/Suspender)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status || !["PENDING", "ACTIVE", "SUSPENDED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Estado inválido" },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = { status }
    
    // Si se está activando, registrar la fecha
    if (status === "ACTIVE") {
      updateData.activatedAt = new Date()
    }

    const tenant = await db.tenant.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: `Negocio ${status === "ACTIVE" ? "activado" : status === "SUSPENDED" ? "suspendido" : "actualizado"} exitosamente`,
      data: tenant
    })
  } catch (error) {
    console.error("Error updating tenant:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un tenant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    await db.tenant.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Negocio eliminado exitosamente"
    })
  } catch (error) {
    console.error("Error deleting tenant:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Obtener cliente específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const customer = await db.customer.findFirst({
      where: {
        id,
        tenantId: session.user.tenantId
      },
      include: {
        sales: {
          take: 10,
          orderBy: { createdAt: "desc" }
        },
        credits: {
          where: { status: { in: ["PENDING", "PARTIAL"] } },
          include: { payments: true }
        }
      }
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Cliente no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: customer
    })
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar cliente
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()

    const customer = await db.customer.updateMany({
      where: {
        id,
        tenantId: session.user.tenantId
      },
      data: body
    })

    if (customer.count === 0) {
      return NextResponse.json(
        { success: false, error: "Cliente no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Cliente actualizado exitosamente"
    })
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar si tiene créditos pendientes
    const pendingCredits = await db.credit.count({
      where: {
        customerId: id,
        status: { in: ["PENDING", "PARTIAL"] }
      }
    })

    if (pendingCredits > 0) {
      return NextResponse.json(
        { success: false, error: `El cliente tiene ${pendingCredits} créditos pendientes` },
        { status: 400 }
      )
    }

    await db.customer.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Cliente eliminado exitosamente"
    })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

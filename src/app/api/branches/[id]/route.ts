import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Obtener sucursal específica
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

    const branch = await db.branch.findFirst({
      where: { id, tenantId: session.user.tenantId },
      include: {
        _count: {
          select: { productStock: true, cashRegisters: true, sales: true }
        }
      }
    })

    if (!branch) {
      return NextResponse.json(
        { success: false, error: "Sucursal no encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: branch
    })
  } catch (error) {
    console.error("Error fetching branch:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar sucursal
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
    const { name, address, phone, city, isActive, isMain } = body

    // Si se va a hacer principal, quitar la marca de las demás
    if (isMain) {
      await db.branch.updateMany({
        where: { tenantId: session.user.tenantId, isMain: true },
        data: { isMain: false }
      })
    }

    const branch = await db.branch.updateMany({
      where: { id, tenantId: session.user.tenantId },
      data: {
        name,
        address,
        phone,
        city,
        isActive,
        isMain
      }
    })

    if (branch.count === 0) {
      return NextResponse.json(
        { success: false, error: "Sucursal no encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Sucursal actualizada exitosamente"
    })
  } catch (error) {
    console.error("Error updating branch:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar sucursal
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

    // Verificar si es la principal
    const branch = await db.branch.findFirst({
      where: { id, tenantId: session.user.tenantId }
    })

    if (branch?.isMain) {
      return NextResponse.json(
        { success: false, error: "No se puede eliminar la sucursal principal" },
        { status: 400 }
      )
    }

    // Verificar si tiene ventas
    const salesCount = await db.sale.count({
      where: { branchId: id }
    })

    if (salesCount > 0) {
      // En lugar de eliminar, desactivar
      await db.branch.update({
        where: { id },
        data: { isActive: false }
      })

      return NextResponse.json({
        success: true,
        message: "Sucursal desactivada (tiene ventas asociadas)"
      })
    }

    await db.branch.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Sucursal eliminada exitosamente"
    })
  } catch (error) {
    console.error("Error deleting branch:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

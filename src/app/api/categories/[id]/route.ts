import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// PATCH - Actualizar categoría
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    // Verificar propiedad y existencia
    const existing = await db.category.findFirst({
      where: {
        id: id,
        tenantId: session.user.tenantId
      }
    })

    if (!existing) {
      return NextResponse.json({ success: false, error: "Categoría no encontrada o no autorizada" }, { status: 404 })
    }

    const body = await request.json()
    const { name, description, color, icon, imageUrl } = body

    const category = await db.category.update({
      where: { id: id },
      data: {
        name,
        description,
        color,
        icon,
        imageUrl
      }
    })

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error: any) {
    console.error("Error updating category:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar categoría" }, { status: 500 })
  }
}

// DELETE - Eliminar categoría
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    // Verificar propiedad
    const existing = await db.category.findFirst({
      where: {
        id: id,
        tenantId: session.user.tenantId
      }
    })

    if (!existing) {
      return NextResponse.json({ success: false, error: "Categoría no encontrada" }, { status: 404 })
    }

    // Verificar si tiene productos
    const productCount = await db.product.count({
      where: { categoryId: id }
    })

    if (productCount > 0) {
      return NextResponse.json({ 
        success: false, 
        error: "No se puede eliminar una categoría que contiene productos" 
      }, { status: 400 })
    }

    await db.category.delete({
      where: { id: id }
    })

    return NextResponse.json({
      success: true,
      message: "Categoría eliminada"
    })
  } catch (error: any) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar categoría" }, { status: 500 })
  }
}

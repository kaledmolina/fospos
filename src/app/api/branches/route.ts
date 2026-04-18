import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Listar sucursales del tenant
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const branches = await db.branch.findMany({
      where: { tenantId: session.user.tenantId },
      include: {
        _count: {
          select: { productStock: true, cashRegisters: true, sales: true }
        }
      },
      orderBy: { createdAt: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: branches
    })
  } catch (error) {
    console.error("Error fetching branches:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Crear nueva sucursal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { name, address, phone, city, isMain, monthlyGoal, logoUrl, themeColor } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "El nombre es requerido" }, { status: 400 })
    }

    const existingBranches = await db.branch.count({
      where: { tenantId: session.user.tenantId }
    })

    const shouldBeMain = isMain || existingBranches === 0

    if (shouldBeMain) {
      await db.branch.updateMany({
        where: { tenantId: session.user.tenantId, isMain: true },
        data: { isMain: false }
      })
    }

    const branch = await db.branch.create({
      data: {
        tenantId: session.user.tenantId,
        name,
        address,
        phone,
        city,
        isMain: shouldBeMain,
        monthlyGoal: parseFloat(monthlyGoal) || 0,
        logoUrl: logoUrl || null,
        themeColor: themeColor || "#10b981"
      }
    })

    // Crear stock inicial para todos los productos en la nueva sucursal
    const products = await db.product.findMany({
      where: { tenantId: session.user.tenantId }
    })

    if (products.length > 0) {
      await db.productStock.createMany({
        data: products.map(p => ({
          productId: p.id,
          branchId: branch.id,
          stock: 0,
          minStock: p.minStock
        }))
      })
    }

    return NextResponse.json({
      success: true,
      message: "Sucursal creada exitosamente",
      data: branch
    })
  } catch (error) {
    console.error("Error creating branch:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar sucursal
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, address, phone, city, isMain, monthlyGoal, logoUrl, themeColor } = body

    if (!id || !name) {
      return NextResponse.json({ success: false, error: "ID y nombre son requeridos" }, { status: 400 })
    }

    // Si se marca como principal, quitar la marca de las demás
    if (isMain) {
      await db.branch.updateMany({
        where: { tenantId: session.user.tenantId, isMain: true, NOT: { id } },
        data: { isMain: false }
      })
    }

    const branch = await db.branch.update({
      where: { id, tenantId: session.user.tenantId },
      data: {
        name,
        address,
        phone,
        city,
        isMain,
        monthlyGoal: isNaN(parseFloat(String(monthlyGoal))) ? 0 : parseFloat(String(monthlyGoal)),
        logoUrl: logoUrl !== undefined ? logoUrl : undefined,
        themeColor: themeColor !== undefined ? themeColor : undefined
      }
    })

    return NextResponse.json({
      success: true,
      message: "Sucursal actualizada correctamente",
      data: branch
    })
  } catch (error) {
    console.error("Error updating branch:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar sucursal
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "ID requerido" }, { status: 400 })
    }

    // No permitir eliminar la sucursal principal
    const branch = await db.branch.findUnique({ where: { id } })
    if (branch?.isMain) {
      return NextResponse.json({ success: false, error: "No se puede eliminar la sucursal principal" }, { status: 400 })
    }

    await db.branch.delete({
      where: { id, tenantId: session.user.tenantId }
    })

    return NextResponse.json({
      success: true,
      message: "Sucursal eliminada exitosamente"
    })
  } catch (error) {
    console.error("Error deleting branch:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST - Registrar movimiento de inventario
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      productId, branchId, type, quantity, 
      referenceType, referenceId, supplierId,
      unitCost, notes, reason 
    } = body

    // Seguridad: Solo el administrador puede hacer ajustes manuales
    if (type === "ADJUSTMENT" && session.user.role !== "TENANT_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Solo el administrador puede realizar ajustes manuales de inventario" },
        { status: 403 }
      )
    }

    // Seguridad: Otras entradas/salidas manuales también requieren privilegios
    if ((type === "IN" || type === "OUT") && !referenceId && session.user.role !== "TENANT_ADMIN") {
       return NextResponse.json(
        { success: false, error: "Este tipo de movimiento manual requiere privilegios de administrador" },
        { status: 403 }
      )
    }

    if (!productId || !branchId || !type || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: "Producto, sucursal, tipo y cantidad son requeridos" },
        { status: 400 }
      )
    }

    // Obtener stock actual del producto en la sucursal
    let productStock = await db.productStock.findUnique({
      where: {
        productId_branchId: { productId, branchId }
      }
    })

    if (!productStock) {
      // Crear registro de stock si no existe
      productStock = await db.productStock.create({
        data: {
          productId,
          branchId,
          stock: 0
        }
      })
    }

    const previousStock = productStock.stock
    let newStock = previousStock

    // Calcular nuevo stock según el tipo de movimiento
    switch (type) {
      case "IN":
      case "PURCHASE":
        newStock = previousStock + quantity
        break
      case "OUT":
      case "SALE":
        newStock = previousStock - quantity
        break
      case "ADJUSTMENT":
        newStock = quantity // En ajuste, quantity es el stock final
        break
      default:
        return NextResponse.json(
          { success: false, error: "Tipo de movimiento inválido" },
          { status: 400 }
        )
    }

    // Crear el movimiento
    const movement = await db.inventoryMovement.create({
      data: {
        tenantId: session.user.tenantId,
        productId,
        branchId,
        type,
        quantity: type === "ADJUSTMENT" ? quantity - previousStock : quantity,
        previousStock,
        newStock,
        referenceType,
        referenceId,
        supplierId,
        unitCost,
        totalCost: unitCost ? unitCost * quantity : 0,
        notes,
        reason,
        createdBy: session.user.id
      }
    })

    // Actualizar el stock
    await db.productStock.update({
      where: { id: productStock.id },
      data: { stock: newStock }
    })

    // Actualizar stock total del producto
    const totalStock = await db.productStock.aggregate({
      where: { productId },
      _sum: { stock: true }
    })

    await db.product.update({
      where: { id: productId },
      data: { stock: totalStock._sum.stock || 0 }
    })

    return NextResponse.json({
      success: true,
      message: "Movimiento registrado exitosamente",
      data: movement
    })
  } catch (error) {
    console.error("Error creating inventory movement:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// GET - Listar movimientos de inventario
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const branchId = searchParams.get("branchId")
    const type = searchParams.get("type")

    const where: Record<string, unknown> = {
      tenantId: session.user.tenantId
    }

    if (productId) where.productId = productId
    if (branchId) where.branchId = branchId
    if (type) where.type = type

    const movements = await db.inventoryMovement.findMany({
      where,
      include: {
        product: { select: { id: true, name: true, code: true } },
        branch: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
        creator: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 100
    })

    return NextResponse.json({
      success: true,
      data: movements
    })
  } catch (error) {
    console.error("Error fetching inventory movements:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

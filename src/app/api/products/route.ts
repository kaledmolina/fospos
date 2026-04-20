import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Listar productos del tenant
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
    const search = searchParams.get("search")
    const categoryId = searchParams.get("categoryId")
    const lowStock = searchParams.get("lowStock")
    const branchId = searchParams.get("branchId")

    const where: any = {
      tenantId: session.user.tenantId
    }

    if (branchId || session.user.branchId) {
      where.branchId = branchId || session.user.branchId
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { sku: { contains: search } }
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    const products = await db.product.findMany({
      where,
      include: {
        category: true,
        stockByBranch: branchId ? {
          where: { branchId }
        } : true
      },
      orderBy: { name: "asc" }
    })

    // Mapear stock según la sucursal seleccionada
    let mappedProducts = products.map(p => {
      let currentStock = p.stock
      let currentMinStock = p.minStock

      if (branchId) {
        const branchStock = p.stockByBranch.find(s => s.branchId === branchId)
        currentStock = branchStock?.stock || 0
        currentMinStock = branchStock?.minStock || p.minStock
      }

      return {
        ...p,
        stock: currentStock,
        minStock: currentMinStock
      }
    })

    // Filtrar productos con stock bajo
    if (lowStock === "true") {
      mappedProducts = mappedProducts.filter(p => p.stock < p.minStock)
    }

    return NextResponse.json({
      success: true,
      data: mappedProducts
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Crear producto
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
      code, sku, name, description, imageUrl,
      costPrice, salePrice, wholesalePrice, stock, minStock,
      unit, categoryId, isActive, expiryDate,
      supplierId, batchNumber
    } = body

    if (!name || salePrice === undefined) {
      return NextResponse.json(
        { success: false, error: "Nombre y precio de venta son requeridos" },
        { status: 400 }
      )
    }

    // Si tiene código, verificar que sea único
    if (code) {
      const existingCode = await db.product.findFirst({
        where: { tenantId: session.user.tenantId, code }
      })
      if (existingCode) {
        return NextResponse.json({ success: false, error: "Ya existe un producto con ese código de barras" }, { status: 400 })
      }
    }

    // Si tiene SKU, verificar que sea único
    if (sku) {
      const existingSku = await db.product.findFirst({
        where: { tenantId: session.user.tenantId, sku }
      })
      if (existingSku) {
        return NextResponse.json({ success: false, error: "Ya existe un producto con ese SKU" }, { status: 400 })
      }
    }

    // Validar fecha de vencimiento si existe
    let safeDate = null
    if (expiryDate && expiryDate !== "") {
      const parsedDate = new Date(expiryDate)
      if (!isNaN(parsedDate.getTime())) {
        safeDate = parsedDate
      } else {
        return NextResponse.json(
          { success: false, error: "Fecha de vencimiento inválida" },
          { status: 400 }
        )
      }
    }

    const product = await db.$transaction(async (tx) => {
      const targetBranchId = body.branchId || session.user.branchId || null

      // 1. Crear el producto
      const mainProduct = await tx.product.create({
        data: {
          tenantId: session.user.tenantId,
          branchId: targetBranchId,
          code: code || null,
          sku: sku || null,
          name,
          description,
          imageUrl,
          costPrice: costPrice || 0,
          salePrice,
          wholesalePrice: wholesalePrice || null,
          stock: stock || 0,
          minStock: minStock || 5,
          unit: unit || "unidad",
          categoryId: categoryId || null,
          isActive: isActive !== false,
          expiryDate: safeDate
        },
        include: {
          category: true
        }
      })

      // 2. Crear lote inicial si hay stock y proveedor
      if (stock > 0 && supplierId) {
        const batchName = batchNumber || `LOT-${Math.floor(100000 + Math.random() * 900000)}`
        
        const batch = await tx.productBatch.create({
          data: {
            productId: mainProduct.id,
            branchId: targetBranchId,
            supplierId: supplierId,
            batchNumber: batchName,
            initialStock: stock,
            currentStock: stock,
            costPrice: costPrice || 0,
            salePrice: salePrice,
            expiryDate: safeDate
          }
        })

        // 3. Registrar movimiento inicial
        await tx.inventoryMovement.create({
          data: {
            productId: mainProduct.id,
            branchId: targetBranchId,
            batchId: batch.id,
            type: "IN",
            quantity: stock,
            reason: "Inventario Inicial",
            reference: `Carga inicial de producto: ${batchName}`,
            userId: session.user.id
          }
        })
      }

      if (targetBranchId) {
        // En un POS con aislamiento de sucursal, solo creamos stock para la sucursal actual
        await tx.productStock.create({
          data: {
            productId: mainProduct.id,
            branchId: targetBranchId,
            stock: stock || 0,
            minStock: minStock || 5
          }
        })
      }

      return mainProduct
    })

    return NextResponse.json({
      success: true,
      message: "Producto creado exitosamente",
      data: product
    })
  } catch (error: any) {
    console.error("Error creating product details:", {
      message: error.message,
      stack: error.stack,
      body: await request.clone().json().catch(() => ({}))
    })
    return NextResponse.json(
      { success: false, error: "Error al crear producto: " + (error.message || "Error interno") },
      { status: 500 }
    )
  }
}

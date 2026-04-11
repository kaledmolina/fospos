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

    const where: Record<string, unknown> = {
      tenantId: session.user.tenantId
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

    if (lowStock === "true") {
      // Productos con stock menor al mínimo
      where.stock = { lt: db.product.fields.minStock }
    }

    const products = await db.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { name: "asc" }
    })

    // Filtrar productos con stock bajo en memoria (SQLite no soporta comparación de campos)
    let filteredProducts = products
    if (lowStock === "true") {
      filteredProducts = products.filter(p => p.stock < p.minStock)
    }

    return NextResponse.json({
      success: true,
      data: filteredProducts
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
      unit, categoryId, isActive, expiryDate 
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
      // 1. Crear el producto
      const mainProduct = await tx.product.create({
        data: {
          tenantId: session.user.tenantId,
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

      // 2. Inicializar stock en la sucursal asignada o en todas las sucursales si es el admin
      const branches = await tx.branch.findMany({
        where: { tenantId: session.user.tenantId }
      })

      if (branches.length > 0) {
        // En un POS multi-sucursal, generalmente inicializamos el stock en la sucursal principal o todas
        await Promise.all(branches.map(branch => 
          tx.productStock.create({
            data: {
              productId: mainProduct.id,
              branchId: branch.id,
              stock: branch.isMain ? (stock || 0) : 0,
              minStock: minStock || 5
            }
          })
        ))
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

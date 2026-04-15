import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST - Carga masiva de productos desde CSV/JSON
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
    const { products, branchId } = body

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, error: "Se requiere un array de productos" },
        { status: 400 }
      )
    }

    // Obtener o crear sucursal principal si no se especifica
    let targetBranchId = branchId
    
    if (!targetBranchId) {
      let mainBranch = await db.branch.findFirst({
        where: { tenantId: session.user.tenantId, isMain: true }
      })
      
      if (!mainBranch) {
        mainBranch = await db.branch.findFirst({
          where: { tenantId: session.user.tenantId }
        })
      }
      
      targetBranchId = mainBranch?.id
    }

    let created = 0
    let updated = 0
    let errors = 0

    for (const product of products) {
      try {
        // Verificar si existe por código
        const existing = product.code ? await db.product.findFirst({
          where: {
            tenantId: session.user.tenantId,
            code: product.code
          }
        }) : null

        if (existing) {
          // Actualizar producto existente
          await db.product.update({
            where: { id: existing.id },
            data: {
              name: product.name || existing.name,
              costPrice: product.costPrice ?? existing.costPrice,
              salePrice: product.salePrice ?? existing.salePrice,
              stock: product.stock ?? existing.stock,
              minStock: product.minStock ?? existing.minStock,
              unit: product.unit || existing.unit,
              categoryId: product.categoryId || existing.categoryId
            }
          })
          updated++
        } else {
          // Crear nuevo producto
          const newProduct = await db.product.create({
            data: {
              tenantId: session.user.tenantId,
              branchId: targetBranchId,
              code: product.code || null,
              name: product.name || "Producto sin nombre",
              costPrice: product.costPrice || 0,
              salePrice: product.salePrice || 0,
              stock: product.stock || 0,
              minStock: product.minStock || 5,
              unit: product.unit || "unidad",
              categoryId: product.categoryId || null
            }
          })

          // Crear stock en la sucursal
          if (targetBranchId) {
            await db.productStock.create({
              data: {
                productId: newProduct.id,
                branchId: targetBranchId,
                stock: product.stock || 0,
                minStock: product.minStock || 5
              }
            })
          }

          created++
        }
      } catch {
        errors++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Carga completada: ${created} creados, ${updated} actualizados, ${errors} errores`,
      summary: { created, updated, errors, total: products.length }
    })
  } catch (error) {
    console.error("Error in bulk upload:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

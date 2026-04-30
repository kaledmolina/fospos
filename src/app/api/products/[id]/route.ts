import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { recordActivity } from "@/lib/audit"

// GET - Obtener producto específico
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

    const product = await db.product.findFirst({
      where: {
        id,
        tenantId: session.user.tenantId,
        branchId: session.user.branchId || undefined
      },
      include: {
        category: true,
        presentations: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar producto
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
    const { 
      code, name, description, imageUrl,
      costPrice, salePrice, stock, minStock,
      unit, categoryId, isActive, supplierId
    } = body

    // Verificar que el producto pertenece al tenant
    const existing = await db.product.findFirst({
      where: { 
        id, 
        tenantId: session.user.tenantId,
        branchId: session.user.branchId || undefined
      }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    // SEGURIDAD: Solo el administrador puede cambiar precios o costos
    const isChangingPrice = (costPrice !== undefined && costPrice !== existing.costPrice) || 
                             (salePrice !== undefined && salePrice !== existing.salePrice)
    
    if (isChangingPrice && session.user.role !== "TENANT_ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No tienes permisos para modificar los precios de este producto. Contacta al administrador." },
        { status: 403 }
      )
    }

    // Si se cambia el código, verificar que no exista
    if (code && code !== existing.code) {
      const codeExists = await db.product.findFirst({
        where: {
          tenantId: session.user.tenantId,
          code,
          id: { not: id }
        }
      })

      if (codeExists) {
        return NextResponse.json(
          { success: false, error: "Ya existe un producto con ese código" },
          { status: 400 }
        )
      }
    }

    const product = await db.$transaction(async (tx) => {
      // Sincronizar presentaciones
      if (body.presentations && Array.isArray(body.presentations)) {
        // Eliminar las que no están en el nuevo array o simplemente recrear todas
        await tx.productPresentation.deleteMany({
          where: { productId: id }
        })

        for (const pres of body.presentations) {
          if (pres.name && pres.conversionFactor) {
            await tx.productPresentation.create({
              data: {
                productId: id,
                name: pres.name,
                unit: pres.unit || "",
                conversionFactor: parseFloat(String(pres.conversionFactor)) || 1,
                price: pres.price ? parseFloat(String(pres.price)) : null
              }
            })
          }
        }
      }

      // Actualizar el producto principal
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          code,
          name,
          description,
          imageUrl,
          costPrice,
          salePrice,
          stock, // Actualiza el stock global
          minStock,
          unit,
          categoryId: categoryId !== undefined ? (categoryId || null) : undefined,
          isActive,
          supplierId: supplierId !== undefined ? (supplierId || null) : undefined
        },

        include: {
          category: true,
          presentations: true
        }
      })

      // SI se está editando desde una sucursal, actualizar también ProductStock
      const targetBranchId = session.user.branchId || null
      if (targetBranchId && stock !== undefined) {
        await tx.productStock.upsert({
          where: { productId_branchId: { productId: id, branchId: targetBranchId } },
          create: {
            productId: id,
            branchId: targetBranchId,
            stock: stock,
            minStock: minStock || 5
          },
          update: {
            stock: stock,
            minStock: minStock || 5
          }
        })
      }

      // Si estamos añadiendo un proveedor a un producto que no tenía, y tiene stock,
      // creamos la Orden de Compra que se omitió al inicio para que aparezca en estadísticas
      if (supplierId && !existing.supplierId && existing.stock > 0) {
        const poExists = await tx.purchaseOrderItem.findFirst({
          where: { productId: id }
        })

        if (!poExists) {
          const batchName = `LOT-${Math.floor(100000 + Math.random() * 900000)}`
          
          // Buscar o crear lote si no existe
          let batch = await tx.productBatch.findFirst({
            where: { productId: id, branchId: targetBranchId || "" }
          })

          if (!batch) {
            batch = await tx.productBatch.create({
              data: {
                productId: id,
                branchId: targetBranchId || "",
                supplierId: supplierId,
                batchNumber: batchName,
                quantity: existing.stock,
                costPrice: costPrice || existing.costPrice,
                salePrice: salePrice || existing.salePrice,
              }
            })
          }

          await tx.purchaseOrder.create({
            data: {
              tenantId: session.user.tenantId,
              supplierId: supplierId,
              branchId: targetBranchId,
              status: "RECEIVED",
              totalAmount: (costPrice || existing.costPrice) * existing.stock,
              notes: "Generada retroactivamente al asignar proveedor",
              items: {
                create: {
                  productId: id,
                  quantity: existing.stock,
                  unitCost: costPrice || existing.costPrice,
                  salePrice: salePrice || existing.salePrice,
                  batchNumber: batchName,
                  subtotal: (costPrice || existing.costPrice) * existing.stock,
                  batchId: batch.id
                }
              }
            }
          })
        }
      }

      return updatedProduct

    })

    // REGISTRO DE AUDITORÍA: Si hubo cambios sensibles
    if (isChangingPrice) {
      await recordActivity({
        tenantId: session.user.tenantId,
        userId: session.user.id,
        action: "PRICE_CHANGE",
        entity: "product",
        entityId: id,
        oldValue: { cost: existing.costPrice, sale: existing.salePrice },
        newValue: { cost: product.costPrice, sale: product.salePrice },
        notes: `Precio cambiado por ${session.user.name}`
      })
    } else if (name !== existing.name || code !== existing.code) {
      await recordActivity({
        tenantId: session.user.tenantId,
        userId: session.user.id,
        action: "PRODUCT_UPDATE",
        entity: "product",
        entityId: id,
        oldValue: { name: existing.name, code: existing.code },
        newValue: { name: product.name, code: product.code }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: product
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar producto
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

    // Verificar si tiene ventas, movimientos o está en OCs
    const [salesCount, movementsCount, ocItemsCount] = await Promise.all([
      db.saleItem.count({ where: { productId: id } }),
      db.inventoryMovement.count({ where: { productId: id } }),
      db.purchaseOrderItem.count({ where: { productId: id } })
    ])
 
    if (salesCount > 0 || movementsCount > 0 || ocItemsCount > 0) {
      // En lugar de eliminar, desactivar
      await db.product.update({
        where: { id },
        data: { isActive: false }
      })
 
      return NextResponse.json({
        success: true,
        message: "Producto desactivado (tiene historial de transacciones)"
      })
    }

    await db.product.delete({
      where: { id }
    })

    await recordActivity({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: "PRODUCT_DELETE",
      entity: "product",
      entityId: id,
      notes: `Producto con ID ${id} eliminado por ${session.user.name}`
    })

    return NextResponse.json({
      success: true,
      message: "Producto eliminado exitosamente"
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Obtener detalle de orden con estadísticas de recuperación (ROI)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user.tenantId) return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });

    const po = await db.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!po) return NextResponse.json({ success: false, error: "Orden no encontrada" }, { status: 404 });

    // Calcular estadísticas de recuperación
    // Buscamos los movimientos de entrada vinculados a esta OC para obtener los lotes
    const movements = await db.inventoryMovement.findMany({
      where: {
        referenceType: "PURCHASE_ORDER",
        referenceId: po.id,
        type: "IN"
      },
      select: {
        batchId: true,
        productId: true
      }
    });

    const batchIds = movements.map(m => m.batchId).filter(Boolean) as string[];

    // Obtener todas las ventas ligadas a estos lotes
    const sales = await db.saleItem.findMany({
      where: {
        batchId: { in: batchIds }
      }
    });

    // Calcular recuperación por producto
    const itemsWithStats = po.items.map(item => {
      // Encontrar el lote correspondiente a este producto en esta OC
      const movement = movements.find(m => m.productId === item.productId);
      const batchSales = sales.filter(s => s.batchId === movement?.batchId);
      
      const quantitySold = batchSales.reduce((sum, s) => sum + s.quantity, 0);
      const amountRecovered = batchSales.reduce((sum, s) => sum + s.subtotal, 0);
      
      return {
        ...item,
        stats: {
          quantitySold,
          amountRecovered,
          percentageRecovered: item.quantity > 0 ? (quantitySold / item.quantity) * 100 : 0
        }
      };
    });

    const totalRecovered = sales.reduce((sum, s) => sum + s.subtotal, 0);
    const totalProfit = totalRecovered - po.totalAmount;

    return NextResponse.json({
      success: true,
      data: {
        ...po,
        items: itemsWithStats,
        stats: {
          totalRecovered,
          totalProfit,
          roi: po.totalAmount > 0 ? (totalProfit / po.totalAmount) * 100 : 0
        }
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH - Actualizar estado de orden de compra (Recibir mercancía)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user.tenantId) return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });

    const body = await request.json();
    const { status } = body; // RECEIVED o CANCELLED

    const po = await db.purchaseOrder.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!po) return NextResponse.json({ success: false, error: "Orden no encontrada" }, { status: 404 });
    if (po.status !== "PENDING") return NextResponse.json({ success: false, error: "La orden ya ha sido procesada anteriormente" }, { status: 400 });

    if (status === "RECEIVED") {
      const result = await db.$transaction(async (tx) => {
        for (const item of po.items) {
          // 1. Obtener stock actual
          let productStock = await tx.productStock.findUnique({
            where: { productId_branchId: { productId: item.productId, branchId: po.branchId || "" } }
          });

          if (!productStock) {
            productStock = await tx.productStock.create({
              data: { productId: item.productId, branchId: po.branchId || "", stock: 0 }
            });
          }

          const previousStock = productStock.stock;
          const newStock = previousStock + item.quantity;

          // 2. Actualizar stock en sucursal
          await tx.productStock.update({
            where: { id: productStock.id },
            data: { stock: newStock }
          });

          // 3. Actualizar stock global y PRECIO DE COSTO (según solicitud de usuario)
          await tx.product.update({
            where: { id: item.productId },
            data: { 
              stock: { increment: item.quantity },
              costPrice: item.unitCost // Actualizar al último costo de compra
            }
          });

          // 4. CREACIÓN O ACTUALIZACIÓN DE LOTE
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          
          let batch;
          if (item.batchId) {
            // REABASTECIMIENTO: Actualizar lote existente
            batch = await tx.productBatch.update({
              where: { id: item.batchId },
              data: {
                quantity: { increment: item.quantity },
                costPrice: item.unitCost, // Actualizar costo al más reciente
                salePrice: item.salePrice || product?.salePrice || 0,
                expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined
              }
            });
          } else {
            // NUEVO LOTE
            batch = await tx.productBatch.create({
              data: {
                productId: item.productId,
                branchId: po.branchId || "",
                supplierId: po.supplierId,
                batchNumber: item.batchNumber || `LOT-${new Date().getTime().toString().slice(-6)}`,
                quantity: item.quantity,
                costPrice: item.unitCost,
                salePrice: item.salePrice || product?.salePrice || 0,
                expiryDate: item.expiryDate || null,
              }
            });
          }



          // 5. Registrar en Kardex
          await tx.inventoryMovement.create({
            data: {
              tenantId: session.user.tenantId,
              productId: item.productId,
              branchId: po.branchId || "",
              type: "PURCHASE",

              quantity: item.quantity,
              previousStock,
              newStock,
              unitCost: item.unitCost,
              totalCost: item.subtotal,
              referenceType: "PURCHASE_ORDER",
              referenceId: po.id,
              batchId: batch.id, // Vinculamos al lote recién creado
              notes: `Recepción de OC#${po.id.slice(-6)}${item.batchNumber ? ` - Lote: ${item.batchNumber}` : ''}`,
              createdBy: session.user.id
            }
          });
        }

        // 5. Marcar orden como recibida
        return await tx.purchaseOrder.update({
          where: { id },
          data: { status: "RECEIVED" }
        });
      }, {
        maxWait: 5000,
        timeout: 15000
      });

      return NextResponse.json({ success: true, data: result });
    }

    if (status === "CANCELLED") {
      const updatedPo = await db.purchaseOrder.update({
        where: { id },
        data: { status: "CANCELLED" }
      });
      return NextResponse.json({ success: true, data: updatedPo });
    }

    return NextResponse.json({ success: false, error: "Estado inválido" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating PO:", error);
    return NextResponse.json({ success: false, error: `Error al actualizar la orden: ${error.message}` }, { status: 500 });
  }

}

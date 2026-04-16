import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH - Actualizar estado de orden de compra (Recibir mercancía)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.tenantId) return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });

    const body = await request.json();
    const { status } = body; // RECEIVED o CANCELLED

    const po = await db.purchaseOrder.findUnique({
      where: { id: params.id },
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

          // 4. Registrar en Kardex
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
              notes: `Recepción de Orden de Compra #${po.id}`,
              createdBy: session.user.id
            }
          });
        }

        // 5. Marcar orden como recibida
        return await tx.purchaseOrder.update({
          where: { id: params.id },
          data: { status: "RECEIVED" }
        });
      });

      return NextResponse.json({ success: true, data: result });
    }

    if (status === "CANCELLED") {
      const updatedPo = await db.purchaseOrder.update({
        where: { id: params.id },
        data: { status: "CANCELLED" }
      });
      return NextResponse.json({ success: true, data: updatedPo });
    }

    return NextResponse.json({ success: false, error: "Estado inválido" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating PO:", error);
    return NextResponse.json({ success: false, error: error.message || "Error al actualizar la orden" }, { status: 500 });
  }
}

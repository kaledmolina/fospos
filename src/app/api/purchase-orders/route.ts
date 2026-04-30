import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Listar órdenes de compra
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.tenantId) return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });

    const pos = await db.purchaseOrder.findMany({
      where: { tenantId: session.user.tenantId },
      include: {
        supplier: true,
        branch: true,
        items: { include: { product: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, data: pos });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al obtener órdenes" }, { status: 500 });
  }
}

// POST - Crear orden de compra
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.tenantId) return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });

    const body = await request.json();
    const { supplierId, branchId, items, notes } = body;

    if (!supplierId || !items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Proveedor e items son requeridos" }, { status: 400 });
    }

    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.unitCost * item.quantity), 0);

    const po = await db.purchaseOrder.create({
      data: {
        tenantId: session.user.tenantId,
        supplierId,
        branchId: branchId || session.user.branchId,
        notes,
        totalAmount,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            batchId: item.batchId || null,
            quantity: item.quantity,
            unitCost: item.unitCost,
            salePrice: item.salePrice || null,
            batchNumber: item.batchNumber || null,
            expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
            subtotal: item.unitCost * item.quantity

          }))
        }
      },
      include: { items: true }
    });

    return NextResponse.json({ success: true, data: po });
  } catch (error) {
    console.error("Error creating PO:", error);
    return NextResponse.json({ success: false, error: "Error al crear la orden" }, { status: 500 });
  }
}

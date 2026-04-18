import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Obtener configuración del negocio
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const tenant = await db.tenant.findUnique({
      where: { id: session.user.tenantId },
      select: {
        id: true,
        businessName: true,
        nit: true,
        taxRate: true,
        enabledPaymentMethods: true,
        currency: true,
        invoicePrefix: true,
        logoUrl: true,
        address: true,
        phone: true
      }
    });

    if (!tenant) {
      return NextResponse.json({ success: false, error: "Negocio no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: tenant });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}

// PATCH - Actualizar configuración del negocio
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.tenantId || session.user.role !== "TENANT_ADMIN") {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { taxRate, enabledPaymentMethods, businessName, nit, address, phone } = body;

    const updatedTenant = await db.tenant.update({
      where: { id: session.user.tenantId },
      data: {
        taxRate: taxRate !== undefined ? Number(taxRate) : undefined,
        enabledPaymentMethods: enabledPaymentMethods !== undefined ? enabledPaymentMethods : undefined,
        businessName: businessName !== undefined ? businessName : undefined,
        nit: nit !== undefined ? nit : undefined,
        address: address !== undefined ? address : undefined,
        phone: phone !== undefined ? phone : undefined
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Configuración actualizada correctamente",
      data: updatedTenant 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Error al actualizar" }, { status: 500 });
  }
}

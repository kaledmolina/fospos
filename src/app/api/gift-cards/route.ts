import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Listar o validar tarjeta de regalo
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
      const giftCard = await db.giftCard.findUnique({
        where: { 
          tenantId_code: { 
            tenantId: session.user.tenantId, 
            code: code.toUpperCase() 
          } 
        },
        include: {
          customer: true,
          redemptions: {
            include: {
              sale: {
                include: { customer: true }
              }
            },
            orderBy: { createdAt: "desc" }
          }
        }
      });

      if (!giftCard) {
        return NextResponse.json({ success: false, error: "Tarjeta no encontrada" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: giftCard });
    }

    const giftCards = await db.giftCard.findMany({
      where: { tenantId: session.user.tenantId },
      include: { 
        customer: true,
        redemptions: {
          include: {
            sale: {
              include: { customer: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, data: giftCards });
  } catch (error) {
    console.error("Error Gift Cards GET:", error);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}

// POST - Crear/Emitir tarjeta de regalo manualmente
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { code, amount, customerId, expiresAt } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: "El monto debe ser mayor a 0" }, { status: 400 });
    }

    // Si no hay código, generar uno
    const finalCode = code ? code.toUpperCase() : `GIFT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const existingCard = await db.giftCard.findUnique({
      where: { 
        tenantId_code: { 
          tenantId: session.user.tenantId, 
          code: finalCode 
        } 
      }
    });

    if (existingCard) {
      return NextResponse.json({ success: false, error: "El código de tarjeta ya existe" }, { status: 400 });
    }

    const giftCard = await db.giftCard.create({
      data: {
        tenantId: session.user.tenantId,
        code: finalCode,
        initialAmount: amount,
        balance: amount,
        customerId: customerId || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: "ACTIVE"
      }
    });

    return NextResponse.json({ success: true, data: giftCard });
  } catch (error) {
    console.error("Error Gift Cards POST:", error);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}

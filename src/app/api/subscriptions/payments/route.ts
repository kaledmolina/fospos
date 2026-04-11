import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Listar pagos de suscripciones
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get("subscriptionId")

    const payments = await db.subscriptionPayment.findMany({
      where: {
        subscription: {
          tenantId: session.user.tenantId
        },
        ...(subscriptionId && { subscriptionId })
      },
      include: {
        subscription: {
          include: {
            customer: true,
            service: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 100
    })

    return NextResponse.json({ success: true, data: payments })
  } catch (error) {
    console.error("Error fetching subscription payments:", error)
    return NextResponse.json(
      { success: false, error: "Error al obtener pagos" },
      { status: 500 }
    )
  }
}

// POST - Registrar pago de suscripción
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    
    if (!data.subscriptionId || !data.amount) {
      return NextResponse.json(
        { success: false, error: "Suscripción y monto son requeridos" },
        { status: 400 }
      )
    }

    // Verificar que la suscripción pertenece al tenant
    const subscription = await db.customerSubscription.findFirst({
      where: {
        id: data.subscriptionId,
        tenantId: session.user.tenantId
      },
      include: { service: true }
    })

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: "Suscripción no encontrada" },
        { status: 404 }
      )
    }

    const amount = parseFloat(data.amount)
    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setDate(periodEnd.getDate() + subscription.service.billingDays)

    // Crear el pago
    const payment = await db.subscriptionPayment.create({
      data: {
        subscriptionId: data.subscriptionId,
        amount,
        paymentMethod: data.paymentMethod || "CASH",
        periodStart: now,
        periodEnd,
        status: "PAID",
        receiptNumber: data.receiptNumber || "",
        notes: data.notes || null
      }
    })

    // Actualizar la suscripción
    await db.customerSubscription.update({
      where: { id: data.subscriptionId },
      data: {
        lastPaymentDate: now,
        nextBillingDate: periodEnd,
        status: "ACTIVE"
      }
    })

    // Si la suscripción estaba vencida, actualizar estado
    if (subscription.status === "OVERDUE" || subscription.status === "PENDING") {
      await db.customerSubscription.update({
        where: { id: data.subscriptionId },
        data: { status: "ACTIVE" }
      })
    }

    return NextResponse.json({ success: true, data: payment })
  } catch (error) {
    console.error("Error creating subscription payment:", error)
    return NextResponse.json(
      { success: false, error: "Error al registrar pago" },
      { status: 500 }
    )
  }
}

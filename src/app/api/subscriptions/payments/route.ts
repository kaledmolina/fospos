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
    periodEnd.setDate(periodEnd.getDate() + (subscription.service.billingDays || 30))

    const result = await db.$transaction(async (tx) => {
      // 1. Obtener datos del Tenant para la factura
      const tenant = await tx.tenant.findUnique({
        where: { id: session.user.tenantId }
      })

      if (!tenant) throw new Error("Tenant no encontrado")

      const currentInvoiceNum = tenant.invoiceNumber
      const invoiceNumber = `${tenant.invoicePrefix}-${currentInvoiceNum.toString().padStart(4, "0")}`

      // 2. Incrementar contador de facturas
      await tx.tenant.update({
        where: { id: tenant.id },
        data: { invoiceNumber: { increment: 1 } }
      })

      // 3. Crear la Venta (Transacción)
      const sale = await tx.sale.create({
        data: {
          tenantId: session.user.tenantId,
          customerId: subscription.customerId,
          invoiceNumber,
          total: amount,
          subtotal: amount,
          paymentMethod: data.paymentMethod || "CASH",
          paymentStatus: "PAID",
          cashRegisterId: data.cashRegisterId || null,
          branchId: session.user.branchId || null,
          notes: `Pago de suscripción: ${subscription.service.name}`,
          items: {
            create: [{
              productName: `Servicio: ${subscription.service.name}`,
              unitPrice: amount,
              quantity: 1,
              subtotal: amount,
              discount: 0
            }]
          }
        }
      })

      // 4. Crear el registro de Pago de Suscripción
      const payment = await tx.subscriptionPayment.create({
        data: {
          subscriptionId: data.subscriptionId,
          amount,
          paymentMethod: data.paymentMethod || "CASH",
          periodStart: now,
          periodEnd,
          status: "PAID",
          receiptNumber: invoiceNumber, // Usar el número de factura como recibo
          notes: data.notes || null
        }
      })

      // 5. Actualizar la suscripción
      await tx.customerSubscription.update({
        where: { id: data.subscriptionId },
        data: {
          lastPaymentDate: now,
          nextBillingDate: periodEnd,
          status: "ACTIVE"
        }
      })

      // 6. Actualizar Caja si aplica
      if (data.cashRegisterId) {
        const updateData: any = { totalSales: { increment: amount } }
        if (data.paymentMethod === "CASH") updateData.totalCash = { increment: amount }
        else if (data.paymentMethod === "CARD") updateData.totalCard = { increment: amount }
        else if (data.paymentMethod === "TRANSFER") updateData.totalTransfer = { increment: amount }

        await tx.cashRegister.update({
          where: { id: data.cashRegisterId },
          data: updateData
        })
      }

      // 7. Actualizar compras totales del cliente
      await tx.customer.update({
        where: { id: subscription.customerId },
        data: { totalPurchases: { increment: amount } }
      })

      return payment
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error creating subscription payment:", error)
    return NextResponse.json(
      { success: false, error: "Error al registrar pago" },
      { status: 500 }
    )
  }
}

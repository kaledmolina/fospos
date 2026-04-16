import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Listar suscripciones de clientes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const customerId = searchParams.get("customerId")
    const serviceId = searchParams.get("serviceId")

    const subscriptions = await db.customerSubscription.findMany({
      where: {
        tenantId: session.user.tenantId,
        ...(status && { status: status as "ACTIVE" | "PENDING" | "PAUSED" | "OVERDUE" | "CANCELLED" | "COMPLETED" }),
        ...(customerId && { customerId }),
        ...(serviceId && { serviceId })
      },
      include: {
        customer: true,
        service: {
          include: { category: true }
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Calcular estadísticas
    const stats = await db.customerSubscription.aggregate({
      where: { tenantId: session.user.tenantId },
      _count: true,
      _sum: {
        agreedPrice: true
      }
    })

    const activeCount = await db.customerSubscription.count({
      where: { tenantId: session.user.tenantId, status: "ACTIVE" }
    })

    const overdueCount = await db.customerSubscription.count({
      where: { tenantId: session.user.tenantId, status: "OVERDUE" }
    })

    return NextResponse.json({ 
      success: true, 
      data: subscriptions,
      stats: {
        total: stats._count,
        active: activeCount,
        overdue: overdueCount,
        monthlyRevenue: stats._sum.agreedPrice || 0
      }
    })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json(
      { success: false, error: "Error al obtener suscripciones" },
      { status: 500 }
    )
  }
}

// POST - Crear nueva suscripción
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    
    // Validar campos requeridos
    if (!data.customerId || !data.serviceId) {
      return NextResponse.json(
        { success: false, error: "Cliente y servicio son requeridos" },
        { status: 400 }
      )
    }

    // Obtener el servicio
    const service = await db.subscriptionService.findFirst({
      where: {
        id: data.serviceId,
        tenantId: session.user.tenantId
      }
    })

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Servicio no encontrado" },
        { status: 404 }
      )
    }

    // Verificar que el cliente existe
    const customer = await db.customer.findFirst({
      where: {
        id: data.customerId,
        tenantId: session.user.tenantId
      }
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Cliente no encontrado" },
        { status: 404 }
      )
    }

    // Verificar si ya tiene suscripción activa al mismo servicio
    const existingSubscription = await db.customerSubscription.findFirst({
      where: {
        customerId: data.customerId,
        serviceId: data.serviceId,
        status: { in: ["ACTIVE", "PENDING", "PAUSED"] }
      }
    })

    if (existingSubscription) {
      return NextResponse.json(
        { success: false, error: "El cliente ya tiene una suscripción activa a este servicio" },
        { status: 400 }
      )
    }

    // Calcular fechas
    const startDate = data.startDate ? new Date(data.startDate) : new Date()
    const nextBillingDate = new Date(startDate)
    nextBillingDate.setDate(nextBillingDate.getDate() + service.billingDays)

    let endDate = null
    if (service.durationMonths) {
      endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + service.durationMonths)
    }

    // Precio acordado (puede ser diferente al precio del servicio)
    const agreedPrice = data.agreedPrice || service.price
    const discountPercent = parseFloat(data.discountPercent) || 0
    const finalPrice = agreedPrice * (1 - discountPercent / 100)

    // Crear la suscripción
    const subscription = await db.customerSubscription.create({
      data: {
        tenantId: session.user.tenantId,
        customerId: data.customerId,
        serviceId: data.serviceId,
        startDate,
        endDate,
        nextBillingDate,
        status: data.status || "ACTIVE",
        agreedPrice: finalPrice,
        discountPercent,
        discountReason: data.discountReason || null,
        notes: data.notes || null
      },
      include: {
        customer: true,
        service: true
      }
    })

    // Si hay pago inicial, registrarlo como Venta y Pago
    if (data.initialPayment && data.initialPayment > 0) {
      const initialAmount = parseFloat(data.initialPayment)
      
      await db.$transaction(async (tx) => {
        // 1. Obtener datos del Tenant para la factura
        const tenant = await tx.tenant.findUnique({ where: { id: session.user.tenantId } })
        if (!tenant) throw new Error("Tenant no encontrado")

        const currentInvoiceNum = tenant.invoiceNumber
        const invoiceNumber = `${tenant.invoicePrefix}-${currentInvoiceNum.toString().padStart(4, "0")}`

        // 2. Incrementar contador de facturas
        await tx.tenant.update({
          where: { id: tenant.id },
          data: { invoiceNumber: { increment: 1 } }
        })

        // 3. Crear la Venta (Transacción)
        await tx.sale.create({
          data: {
            tenantId: session.user.tenantId,
            customerId: subscription.customerId,
            invoiceNumber,
            total: initialAmount,
            subtotal: initialAmount,
            paymentMethod: data.paymentMethod || "CASH",
            paymentStatus: "PAID",
            cashRegisterId: data.cashRegisterId || null,
            branchId: session.user.branchId || null,
            notes: `Pago inicial suscripción: ${subscription.service.name}`,
            items: {
              create: [{
                productName: `Pago Inicial: ${subscription.service.name}`,
                unitPrice: initialAmount,
                quantity: 1,
                subtotal: initialAmount,
                discount: 0
              }]
            }
          }
        })

        // 4. Crear el registro de Pago de Suscripción
        await tx.subscriptionPayment.create({
          data: {
            subscriptionId: subscription.id,
            amount: initialAmount,
            paymentMethod: data.paymentMethod || "CASH",
            periodStart: startDate,
            periodEnd: nextBillingDate,
            status: "PAID",
            receiptNumber: invoiceNumber
          }
        })

        // 5. Actualizar compras totales del cliente
        await tx.customer.update({
          where: { id: subscription.customerId },
          data: { totalPurchases: { increment: initialAmount } }
        })

        // 6. Actualizar Caja si aplica
        if (data.cashRegisterId) {
          const updateData: any = { totalSales: { increment: initialAmount } }
          if (data.paymentMethod === "CASH") updateData.totalCash = { increment: initialAmount }
          else if (data.paymentMethod === "CARD") updateData.totalCard = { increment: initialAmount }
          else if (data.paymentMethod === "TRANSFER") updateData.totalTransfer = { increment: initialAmount }

          await tx.cashRegister.update({
            where: { id: data.cashRegisterId },
            data: updateData
          })
        }
      })
    }

    return NextResponse.json({ success: true, data: subscription })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json(
      { success: false, error: "Error al crear suscripción" },
      { status: 500 }
    )
  }
}

// PUT - Actualizar suscripción
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: "ID de suscripción requerido" },
        { status: 400 }
      )
    }

    // Verificar que la suscripción pertenece al tenant
    const existing = await db.customerSubscription.findFirst({
      where: { id: data.id, tenantId: session.user.tenantId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Suscripción no encontrada" },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {
      status: data.status,
      notes: data.notes,
      discountPercent: parseFloat(data.discountPercent) || 0,
      discountReason: data.discountReason || null
    }

    // Manejar congelación
    if (data.freeze && existing.status === "ACTIVE") {
      const service = await db.subscriptionService.findUnique({
        where: { id: existing.serviceId }
      })
      
      if (service && existing.freezeCount < service.maxFreezes) {
        const freezeDays = Math.min(
          parseInt(data.freezeDays) || 7,
          service.freezeDaysMax || 30
        )
        const frozenUntil = new Date()
        frozenUntil.setDate(frozenUntil.getDate() + freezeDays)
        
        updateData.status = "PAUSED"
        updateData.frozenAt = new Date()
        updateData.frozenUntil = frozenUntil
        updateData.freezeCount = existing.freezeCount + 1
        
        // Extender próxima fecha de cobro
        const newNextBilling = new Date(existing.nextBillingDate)
        newNextBilling.setDate(newNextBilling.getDate() + freezeDays)
        updateData.nextBillingDate = newNextBilling
      }
    }

    // Descongelar
    if (data.unfreeze && existing.status === "PAUSED") {
      updateData.status = "ACTIVE"
      updateData.frozenAt = null
      updateData.frozenUntil = null
    }

    // Cancelar
    if (data.cancel) {
      updateData.status = "CANCELLED"
      updateData.endDate = new Date()
    }

    const subscription = await db.customerSubscription.update({
      where: { id: data.id },
      data: updateData,
      include: {
        customer: true,
        service: true
      }
    })

    return NextResponse.json({ success: true, data: subscription })
  } catch (error) {
    console.error("Error updating subscription:", error)
    return NextResponse.json(
      { success: false, error: "Error al actualizar suscripción" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar suscripción
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID de suscripción requerido" },
        { status: 400 }
      )
    }

    // Verificar que la suscripción pertenece al tenant
    const existing = await db.customerSubscription.findFirst({
      where: { id, tenantId: session.user.tenantId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Suscripción no encontrada" },
        { status: 404 }
      )
    }

    // Eliminar pagos primero
    await db.subscriptionPayment.deleteMany({
      where: { subscriptionId: id }
    })

    // Eliminar suscripción
    await db.customerSubscription.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Suscripción eliminada" })
  } catch (error) {
    console.error("Error deleting subscription:", error)
    return NextResponse.json(
      { success: false, error: "Error al eliminar suscripción" },
      { status: 500 }
    )
  }
}

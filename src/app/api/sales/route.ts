import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns"

// GET - Listar ventas y estadísticas del tenant
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "stats" | "list"
    const customerId = searchParams.get("customerId")

    if (type === "stats") {
      // Estadísticas del dashboard
      const today = new Date()
      const todayStart = startOfDay(today)
      const todayEnd = endOfDay(today)
      const monthStart = startOfMonth(today)
      const monthEnd = endOfMonth(today)

      // Ventas de hoy
      const todaySales = await db.sale.aggregate({
        where: {
          tenantId: session.user.tenantId,
          createdAt: { gte: todayStart, lte: todayEnd }
        },
        _sum: { total: true },
        _count: true
      })

      // Ventas del mes
      const monthSales = await db.sale.aggregate({
        where: {
          tenantId: session.user.tenantId,
          createdAt: { gte: monthStart, lte: monthEnd }
        },
        _sum: { total: true },
        _count: true
      })

      // Productos más vendidos
      const topProductsRaw = await db.saleItem.groupBy({
        by: ["productId", "productName", "productCode"],
        where: {
          sale: { tenantId: session.user.tenantId }
        },
        _sum: {
          quantity: true,
          subtotal: true
        },
        orderBy: {
          _sum: { quantity: "desc" }
        },
        take: 5
      })

      const topProducts = topProductsRaw.map(p => ({
        id: p.productId || "",
        name: p.productName,
        code: p.productCode,
        totalSold: p._sum.quantity || 0,
        totalRevenue: p._sum.subtotal || 0
      }))

      // Ventas recientes
      const recentSales = await db.sale.findMany({
        where: { tenantId: session.user.tenantId },
        include: {
          customer: true,
          items: true,
          credit: {
            include: {
              payments: {
                include: {
                  registeredBy: {
                    select: { name: true }
                  }
                },
                orderBy: { createdAt: "desc" }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 10
      })

      // Créditos pendientes
      const pendingCredits = await db.credit.aggregate({
        where: {
          tenantId: session.user.tenantId,
          status: { in: ["PENDING", "PARTIAL"] }
        },
        _sum: { balance: true }
      })

      const products = await db.product.findMany({
        where: { tenantId: session.user.tenantId, isActive: true }
      })
      const lowStockProducts = products.filter(p => p.stock < p.minStock).length

      // Productos vencidos y por vencer (7 días)
      const now = new Date()
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(now.getDate() + 7)

      const expiredCount = products.filter(p => p.expiryDate && new Date(p.expiryDate) < now).length
      const nearExpiryCount = products.filter(p => 
        p.expiryDate && 
        new Date(p.expiryDate) >= now && 
        new Date(p.expiryDate) <= sevenDaysFromNow
      ).length

      // Obtener meta de la sucursal del usuario o de la principal como fallback
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: { branch: true }
      })

      let monthlyGoal = user?.branch?.monthlyGoal || 0

      // Si el usuario no tiene sucursal o no tiene meta, buscar la principal
      if (monthlyGoal === 0) {
        const mainBranch = await db.branch.findFirst({
          where: { 
            tenantId: session.user.tenantId,
            isMain: true 
          }
        })
        monthlyGoal = mainBranch?.monthlyGoal || 0
      }

      // Si aún es 0, usar cualquier sucursal disponible para este tenant
      if (monthlyGoal === 0) {
        const anyBranch = await db.branch.findFirst({
          where: { tenantId: session.user.tenantId }
        })
        monthlyGoal = anyBranch?.monthlyGoal || 0
      }

      return NextResponse.json({
        success: true,
        data: {
          todaySales: todaySales._sum.total || 0,
          todayTransactions: todaySales._count,
          monthSales: monthSales._sum.total || 0,
          monthTransactions: monthSales._count,
          topProducts,
          recentSales,
          pendingCredits: pendingCredits._sum.balance || 0,
          lowStockProducts,
          expiredCount,
          nearExpiryCount,
          monthlyGoal
        }
      })
    }

    // Listar ventas
    const where: Record<string, unknown> = {
      tenantId: session.user.tenantId
    }

    if (customerId) {
      where.customerId = customerId
    }

    const sales = await db.sale.findMany({
      where,
      include: {
        customer: true,
        items: true,
        credit: {
          include: {
            payments: {
              include: {
                registeredBy: {
                  select: { name: true }
                }
              },
              orderBy: { createdAt: "desc" }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    })

    return NextResponse.json({
      success: true,
      data: sales
    })
  } catch (error) {
    console.error("Error fetching sales:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Crear venta
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
    const { 
      customerId, items, paymentMethod, 
      discount, cashRegisterId,
      pointsRedeemed, couponCode,
      cashReceived, change
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "La venta debe tener al menos un producto" },
        { status: 400 }
      )
    }

    // --- INICIO DE TRANSACCIÓN ---
    const result = await db.$transaction(async (tx) => {
      // 1. Obtener Tenant para el prefijo y número de factura (y bloquear para evitar duplicados)
      const tenant = await tx.tenant.findUnique({
        where: { id: session.user.tenantId }
      })

      if (!tenant) throw new Error("Tenant no encontrado")

      const currentInvoiceNum = tenant.invoiceNumber
      const invoiceNumber = `${tenant.invoicePrefix}-${currentInvoiceNum.toString().padStart(4, '0')}`

      // 2. Incrementar contador del Tenant
      await tx.tenant.update({
        where: { id: tenant.id },
        data: { invoiceNumber: { increment: 1 } }
      })

      // 3. Obtener configuración de lealtad y cupón (si aplica)
      const loyaltyConfig = await tx.pointConfig.findUnique({
        where: { tenantId: session.user.tenantId }
      })

      let couponDiscount = 0
      let coupon = null
      if (couponCode) {
        coupon = await tx.coupon.findUnique({
          where: { tenantId_code: { tenantId: session.user.tenantId, code: couponCode.toUpperCase() } }
        })
        if (coupon && coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())) {
          if (!coupon.maxUses || coupon.currentUses < coupon.maxUses) {
            // Se calculará después
          } else coupon = null
        } else coupon = null
      }

      // 4. Calcular totales y procesar items
      let subtotal = 0
      const saleItems = []

      for (const item of items) {
        if (!item.type || item.type === "PRODUCT") {
          const product = await tx.product.findFirst({
            where: { id: item.productId, tenantId: session.user.tenantId }
          })

          if (!product) throw new Error(`Producto ${item.productId} no encontrado`)
          if (product.stock < item.quantity) throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`)

          const itemSubtotal = product.salePrice * item.quantity - (item.discount || 0)
          subtotal += itemSubtotal

          saleItems.push({
            productId: product.id,
            productName: product.name,
            productCode: product.code,
            unitPrice: product.salePrice,
            quantity: item.quantity,
            unit: product.unit,
            discount: item.discount || 0,
            subtotal: itemSubtotal
          })

          // Descontar stock
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } }
          })
        } else if (item.type === "SERVICE") {
          const service = await tx.subscriptionService.findFirst({
            where: { id: item.serviceId, tenantId: session.user.tenantId }
          })

          if (!service) throw new Error(`Servicio ${item.serviceId} no encontrado`)

          const itemSubtotal = service.price * item.quantity + (service.setupFee || 0)
          subtotal += itemSubtotal

          saleItems.push({
            productId: null,
            productName: service.name,
            productCode: service.code,
            unitPrice: service.price,
            quantity: item.quantity,
            unit: "servicio",
            discount: 0,
            subtotal: itemSubtotal
          })

          if (customerId) {
            const nextBilling = new Date()
            if (service.billingCycle === "MONTHLY") nextBilling.setMonth(nextBilling.getMonth() + 1)
            else if (service.billingCycle === "YEARLY") nextBilling.setFullYear(nextBilling.getFullYear() + 1)
            else if (service.billingCycle === "DAILY") nextBilling.setDate(nextBilling.getDate() + 1)
            else nextBilling.setDate(nextBilling.getDate() + service.billingDays)

            await tx.customerSubscription.create({
              data: {
                tenantId: session.user.tenantId,
                customerId,
                serviceId: service.id,
                startDate: new Date(),
                nextBillingDate: nextBilling,
                status: "ACTIVE",
                agreedPrice: service.price,
                notes: "Activada mediante venta POS"
              }
            })
          }
        }
      }

      // 5. Procesar Descuentos
      let pointsValue = 0
      let pointsToDeduct = 0
      if (loyaltyConfig?.isActive && pointsRedeemed > 0 && customerId) {
        const customer = await tx.customer.findUnique({ where: { id: customerId } })
        if (customer && customer.points >= pointsRedeemed) {
          pointsToDeduct = pointsRedeemed
          pointsValue = pointsRedeemed * loyaltyConfig.redemptionValue
        }
      }

      if (coupon) {
        if (coupon.type === "PERCENTAGE") {
          couponDiscount = Math.round(subtotal * (coupon.value / 100))
        } else {
          couponDiscount = coupon.value
        }
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { currentUses: { increment: 1 } }
        })
      }

      // 6. Calcular Puntos Ganados
      let pointsEarned = 0
      if (loyaltyConfig?.isActive && customerId) {
        const step = loyaltyConfig.amountStep || 1000
        pointsEarned = Math.floor(subtotal / step) * loyaltyConfig.pointsPerAmount
        console.log(`[Loyalty] Venta: ${invoiceNumber}, Subtotal: ${subtotal}, Step: ${step}, Puntos Ganados: ${pointsEarned}`)
      }

      const tax = Math.round(subtotal * 0.19)
      const finalTotal = Math.max(0, subtotal + tax - (discount || 0) - pointsValue - couponDiscount)

      // 7. Validar Crédito
      if (paymentMethod === "CREDIT") {
        if (!customerId) throw new Error("Se requiere un cliente registrado para ventas a crédito")

        const customer = await tx.customer.findUnique({
          where: { id: customerId },
          include: {
            credits: {
              where: { status: { in: ["PENDING", "PARTIAL"] } },
              select: { balance: true }
            }
          }
        })

        if (!customer) throw new Error("Cliente no encontrado")

        const currentDebt = customer.credits.reduce((sum, c) => sum + c.balance, 0)
        if (customer.creditLimit > 0 && (currentDebt + finalTotal) > customer.creditLimit) {
          throw new Error(`Límite de crédito excedido. Deuda: ${currentDebt.toLocaleString()}, Límite: ${customer.creditLimit.toLocaleString()}`)
        }
      }

      // 8. Crear la Venta
      const sale = await tx.sale.create({
        data: {
          tenantId: session.user.tenantId,
          customerId: customerId || null,
          invoiceNumber,
          items: { create: saleItems },
          subtotal,
          tax,
          discount: (discount || 0) + couponDiscount,
          pointsRedeemed: pointsToDeduct,
          pointsEarned,
          pointsValue,
          total: finalTotal,
          paymentMethod: paymentMethod || "CASH",
          paymentStatus: paymentMethod === "CREDIT" ? "PENDING" : "PAID",
          cashReceived: Number(cashReceived) || 0,
          change: Number(change) || 0,
          cashRegisterId: cashRegisterId || null
        },
        include: { items: true, customer: true }
      })

      // 9. Actualizar Cliente
      if (customerId) {
        const netPointsChange = Math.round(pointsEarned - pointsToDeduct)
        await tx.customer.update({
          where: { id: customerId },
          data: {
            points: { increment: netPointsChange },
            totalPurchases: { increment: finalTotal }
          }
        })
        console.log(`[Loyalty] Cliente ${customerId} actualizado. Cambio neto puntos: ${netPointsChange}`)
      }

      // 10. Si es a crédito, crear el crédito
      if (paymentMethod === "CREDIT" && customerId) {
        const credit = await tx.credit.create({
          data: {
            tenantId: session.user.tenantId,
            customerId,
            saleId: sale.id,
            totalAmount: finalTotal,
            paidAmount: 0,
            balance: finalTotal,
            status: "PENDING"
          }
        })
        await tx.sale.update({
          where: { id: sale.id },
          data: { creditId: credit.id }
        })
      }

      // 11. Actualizar Caja
      if (cashRegisterId) {
        const updateData: Record<string, any> = { totalSales: { increment: finalTotal } }
        if (paymentMethod === "CASH") updateData.totalCash = { increment: finalTotal }
        else if (paymentMethod === "CARD") updateData.totalCard = { increment: finalTotal }
        else if (paymentMethod === "TRANSFER") updateData.totalTransfer = { increment: finalTotal }
        else if (paymentMethod === "CREDIT") updateData.totalCredit = { increment: finalTotal }

        await tx.cashRegister.update({
          where: { id: cashRegisterId },
          data: updateData
        })
      }

      return sale
    })

    return NextResponse.json({
      success: true,
      message: "Venta registrada exitosamente",
      data: result
    })
  } catch (error: any) {
    console.error("Error creating sale:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Error interno del servidor" },
      { status: 500 }
    )
  }
}

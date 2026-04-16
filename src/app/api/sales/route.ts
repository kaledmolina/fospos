import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

// GET - Listar ventas y estadísticas del tenant
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "stats" | "list"
    const customerId = searchParams.get("customerId");
    const branchId = searchParams.get("branchId");

    if (type === "stats") {
      try {
        const today = new Date();
        const todayStart = startOfDay(today);
        const todayEnd = endOfDay(today);
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);

        const whereBase: any = {
          tenantId: session.user.tenantId,
          ...(branchId && branchId !== "null" && branchId !== "undefined" && branchId !== "" ? { branchId } : {})
        };

        const todaySales = await db.sale.aggregate({
          where: {
            ...whereBase,
            createdAt: { gte: todayStart, lte: todayEnd }
          },
          _sum: { total: true },
          _count: true
        });

        const monthSales = await db.sale.aggregate({
          where: {
            ...whereBase,
            createdAt: { gte: monthStart, lte: monthEnd }
          },
          _sum: { total: true },
          _count: true
        });

        const topProductsRaw = await db.saleItem.groupBy({
          by: ["productId", "productName", "productCode"],
          where: {
            sale: { 
              tenantId: session.user.tenantId,
              ...(branchId && branchId !== "null" && branchId !== "undefined" && branchId !== "" ? { branchId } : {})
            }
          },
          _sum: {
            quantity: true,
            subtotal: true
          },
          orderBy: {
            _sum: { quantity: "desc" }
          },
          take: 5
        });

        const topProducts = topProductsRaw.map(p => ({
          id: p.productId || "",
          name: p.productName,
          code: p.productCode,
          totalSold: p._sum.quantity || 0,
          totalRevenue: p._sum.subtotal || 0
        }));

        const recentSales = await db.sale.findMany({
          where: whereBase,
          include: {
            customer: true,
            items: true,
            credit: {
              include: {
                payments: {
                  orderBy: { createdAt: "desc" }
                }
              }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 10
        });

        const pendingCredits = await db.credit.aggregate({
          where: {
            tenantId: session.user.tenantId,
            status: { in: ["PENDING", "PARTIAL"] }
          },
          _sum: { balance: true }
        });

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

        const products = await db.product.findMany({
          where: { tenantId: session.user.tenantId, isActive: true },
          include: { stockByBranch: true }
        });

        const mappedProducts = products.map(p => {
          let stock = p.stock;
          let minStock = p.minStock;
          if (branchId && branchId !== "null" && branchId !== "undefined" && branchId !== "") {
            const bs = p.stockByBranch.find(s => s.branchId === branchId);
            stock = bs?.stock || 0;
            minStock = bs?.minStock || p.minStock;
          }
          return { ...p, currentStock: stock, currentMinStock: minStock };
        });

        const lowStockProducts = mappedProducts.filter(p => p.currentStock < p.currentMinStock).length;

        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);

        const expiredCount = mappedProducts.filter(p => p.expiryDate && new Date(p.expiryDate) < now).length;
        const nearExpiryCount = mappedProducts.filter(p => 
          p.expiryDate && 
          new Date(p.expiryDate) >= now && 
          new Date(p.expiryDate) <= sevenDaysFromNow
        ).length;

        let targetMonthlyGoal = 0;
        if (branchId && branchId !== "null" && branchId !== "undefined" && branchId !== "") {
          const selectedBranch = await db.branch.findUnique({ where: { id: branchId } });
          targetMonthlyGoal = selectedBranch?.monthlyGoal || 0;
        } else {
          const user = await db.user.findUnique({
            where: { id: session.user.id },
            include: { branch: true }
          });
          targetMonthlyGoal = user?.branch?.monthlyGoal || 0;
          if (targetMonthlyGoal === 0) {
            const mainBranch = await db.branch.findFirst({
              where: { tenantId: session.user.tenantId, isMain: true }
            });
            targetMonthlyGoal = mainBranch?.monthlyGoal || 0;
          }
        }

        const targetDailyGoal = targetMonthlyGoal > 0 ? Math.round(targetMonthlyGoal / 30) : 1000000;

        const weeklySales = [];
        const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const start = startOfDay(d);
          const end = endOfDay(d);
          const daySales = await db.sale.aggregate({
            where: { ...whereBase, createdAt: { gte: start, lte: end } },
            _sum: { total: true }
          });
          weeklySales.push({
            name: days[d.getDay()],
            total: daySales._sum.total || 0
          });
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
            monthlyGoal: targetMonthlyGoal,
            dailyGoal: targetDailyGoal,
            weeklySales
          }
        });
      } catch (statsError: any) {
        return NextResponse.json(
          { success: false, error: "Error calculando estadísticas" },
          { status: 500 }
        );
      }
    }

    const where: any = {
      tenantId: session.user.tenantId,
      ...(branchId ? { branchId } : {}),
      ...(customerId ? { customerId } : {})
    };

    const sales = await db.sale.findMany({
      where,
      include: {
        customer: true,
        items: true,
        credit: { include: { payments: { orderBy: { createdAt: "desc" } } } }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST - Crear venta
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      customerId, items, paymentMethod, 
      discount, cashRegisterId,
      pointsRedeemed, couponCode,
      cashReceived, change,
      giftCardCode
    } = body;
    const userBranchId = body.branchId || session.user.branchId;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "La venta debe tener al menos un producto" }, { status: 400 });
    }

    const result = await db.$transaction(async (tx) => {
      const tenant = await tx.tenant.findUnique({ where: { id: session.user.tenantId } });
      if (!tenant) throw new Error("Tenant no encontrado");

      const currentInvoiceNum = tenant.invoiceNumber;
      const invoiceNumber = `${tenant.invoicePrefix}-${currentInvoiceNum.toString().padStart(4, "0")}`;

      await tx.tenant.update({
        where: { id: tenant.id },
        data: { invoiceNumber: { increment: 1 } }
      });

      const loyaltyConfig = await tx.pointConfig.findUnique({ where: { tenantId: session.user.tenantId } });
      let couponDiscount = 0;
      let coupon = null;
      if (couponCode) {
        coupon = await tx.coupon.findUnique({
          where: { tenantId_code: { tenantId: session.user.tenantId, code: couponCode.toUpperCase() } }
        });
        if (coupon && coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())) {
          if (!coupon.maxUses || coupon.currentUses >= coupon.maxUses) coupon = null;
        } else coupon = null;
      }

      let subtotal = 0;
      const saleItems = [];

      for (const item of items) {
        if (!item.type || item.type === "PRODUCT") {
          const product = await tx.product.findFirst({ where: { id: item.productId, tenantId: session.user.tenantId } });
          if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
          
          const productStock = await tx.productStock.findUnique({
            where: { productId_branchId: { productId: product.id, branchId: userBranchId || "" } }
          });
          if (!productStock) throw new Error(`El producto ${product.name} no está en esta sucursal`);
          if (productStock.stock < item.quantity) throw new Error(`Stock insuficiente para ${product.name}`);

          const itemSubtotal = product.salePrice * item.quantity - (item.discount || 0);
          subtotal += itemSubtotal;

          saleItems.push({
            productId: product.id,
            productName: product.name,
            productCode: product.code,
            unitPrice: product.salePrice,
            quantity: item.quantity,
            unit: product.unit,
            discount: item.discount || 0,
            subtotal: itemSubtotal
          });

          await tx.productStock.update({ where: { id: productStock.id }, data: { stock: { decrement: item.quantity } } });
          await tx.product.update({ where: { id: product.id }, data: { stock: { decrement: item.quantity } } });
        } else if (item.type === "SERVICE") {
          const service = await tx.subscriptionService.findFirst({ where: { id: item.serviceId, tenantId: session.user.tenantId } });
          if (!service) throw new Error(`Servicio ${item.serviceId} no encontrado`);
          if (!customerId) throw new Error(`El servicio "${service.name}" requiere cliente.`);

          const itemSubtotal = service.price * item.quantity + (service.setupFee || 0);
          subtotal += itemSubtotal;

          saleItems.push({
            productId: null,
            productName: service.name,
            productCode: service.code,
            unitPrice: service.price,
            quantity: item.quantity,
            unit: "servicio",
            discount: 0,
            subtotal: itemSubtotal
          });

          if (item.isSubscription) {
            const nextBilling = new Date();
            if (service.billingCycle === "MONTHLY") nextBilling.setMonth(nextBilling.getMonth() + 1);
            else if (service.billingCycle === "YEARLY") nextBilling.setFullYear(nextBilling.getFullYear() + 1);
            else if (service.billingCycle === "DAILY") nextBilling.setDate(nextBilling.getDate() + 1);
            else if (service.billingCycle === "WEEKLY") nextBilling.setDate(nextBilling.getDate() + 7);
            else nextBilling.setDate(nextBilling.getDate() + (service.billingDays || 30));

            await tx.customerSubscription.create({
              data: {
                tenantId: session.user.tenantId,
                customerId,
                serviceId: service.id,
                startDate: new Date(),
                nextBillingDate: nextBilling,
                status: "ACTIVE",
                agreedPrice: service.price,
                notes: "Activada vía Venta POS"
              }
            });
          }
        } else if (item.type === "GIFT_CARD") {
          const cardCode = item.giftCardCode || `GIFT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          const cardAmount = Number(item.unitPrice) * Number(item.quantity);
          
          subtotal += cardAmount;

          saleItems.push({
            productId: null,
            productName: "Tarjeta de Regalo",
            productCode: cardCode,
            unitPrice: Number(item.unitPrice),
            quantity: Number(item.quantity),
            unit: "unidad",
            discount: 0,
            subtotal: cardAmount
          });

          await tx.giftCard.create({
            data: {
              tenantId: session.user.tenantId,
              code: cardCode,
              initialAmount: cardAmount,
              balance: cardAmount,
              customerId: customerId || null,
              status: "ACTIVE"
            }
          });
        }
      }

      let pointsValue = 0;
      let pointsToDeduct = 0;
      if (loyaltyConfig?.isActive && pointsRedeemed > 0 && customerId) {
        const customer = await tx.customer.findUnique({ where: { id: customerId } });
        if (customer && customer.points >= pointsRedeemed) {
          pointsToDeduct = pointsRedeemed;
          pointsValue = pointsRedeemed * loyaltyConfig.redemptionValue;
        }
      }

      if (coupon) {
        if (coupon.type === "PERCENTAGE") couponDiscount = Math.round(subtotal * (coupon.value / 100));
        else couponDiscount = coupon.value;
        await tx.coupon.update({ where: { id: coupon.id }, data: { currentUses: { increment: 1 } } });
      }

      let pointsEarned = 0;
      if (loyaltyConfig?.isActive && customerId) {
        const step = loyaltyConfig.amountStep || 1000;
        pointsEarned = Math.floor(subtotal / step) * loyaltyConfig.pointsPerAmount;
      }

      const tax = Math.round(subtotal * 0.19);
      const finalTotal = Math.max(0, subtotal + tax - (discount || 0) - pointsValue - couponDiscount);

      if (paymentMethod === "CREDIT") {
        if (!customerId) throw new Error("Cliente requerido para crédito");
        const customer = await tx.customer.findUnique({ 
          where: { id: customerId }, 
          include: { credits: { where: { status: { in: ["PENDING", "PARTIAL"] } }, select: { balance: true } } } 
        });
        if (!customer) throw new Error("Cliente no encontrado");
        const currentDebt = customer.credits.reduce((sum, c) => sum + c.balance, 0);
        if (customer.creditLimit > 0 && (currentDebt + finalTotal) > customer.creditLimit) throw new Error("Límite de crédito excedido");
      }

      if (paymentMethod === "GIFT_CARD") {
        if (!customerId) throw new Error("Cliente requerido para pago con Tarjeta de Regalo");
        if (!giftCardCode) throw new Error("Código de tarjeta de regalo requerido");
        const card = await tx.giftCard.findUnique({
          where: { tenantId_code: { tenantId: session.user.tenantId, code: giftCardCode.toUpperCase() } }
        });
        if (!card || card.status !== "ACTIVE" || !card.isActive) throw new Error("Tarjeta de regalo inválida o inactiva");
        if (card.balance < finalTotal) throw new Error(`Saldo insuficiente en la tarjeta de regalo (Saldo: ${card.balance})`);

        await tx.giftCard.update({
          where: { id: card.id },
          data: { 
            balance: { decrement: finalTotal },
            status: card.balance - finalTotal <= 0 ? "USED_UP" : "ACTIVE"
          }
        });
        
        // El registro de redención se hace después de crear la venta
      }

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
          cashRegisterId: cashRegisterId || null,
          branchId: userBranchId || null
        },
        include: { items: true, customer: true }
      });

      if (customerId) {
        const netPointsChange = Math.round(pointsEarned - pointsToDeduct);
        await tx.customer.update({ where: { id: customerId }, data: { points: { increment: netPointsChange }, totalPurchases: { increment: finalTotal } } });
      }

      if (paymentMethod === "CREDIT" && customerId) {
        const credit = await tx.credit.create({
          data: {
            tenantId: session.user.tenantId,
            customerId,
            saleId: sale.id,
            totalAmount: finalTotal,
            paidAmount: 0,
            balance: finalTotal,
            status: "PENDING",
            branchId: userBranchId || null
          }
        });
        await tx.sale.update({ where: { id: sale.id }, data: { creditId: credit.id } });
      }

      if (cashRegisterId) {
        const updateData: any = { totalSales: { increment: finalTotal } };
        if (paymentMethod === "CASH") updateData.totalCash = { increment: finalTotal };
        else if (paymentMethod === "CARD") updateData.totalCard = { increment: finalTotal };
        else if (paymentMethod === "TRANSFER") updateData.totalTransfer = { increment: finalTotal };
        else if (paymentMethod === "CREDIT") updateData.totalCredit = { increment: finalTotal };
        else if (paymentMethod === "GIFT_CARD") {
          updateData.totalGiftCard = { increment: finalTotal };
          
          const card = await tx.giftCard.findUnique({
            where: { tenantId_code: { tenantId: session.user.tenantId, code: giftCardCode!.toUpperCase() } }
          });
          
          if (card) {
            await tx.giftCardRedemption.create({
              data: {
                giftCardId: card.id,
                saleId: sale.id,
                amountUsed: finalTotal
              }
            });
          }
        }

        await tx.cashRegister.update({ where: { id: cashRegisterId }, data: updateData });
      }

      return sale;
    });

    return NextResponse.json({ success: true, message: "Éxito", data: result });
  } catch (error: any) {
    console.error("Error POS:", error);
    return NextResponse.json({ success: false, error: error.message || "Error" }, { status: 500 });
  }
}

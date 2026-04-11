import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Generar ticket/recibo imprimible
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
    const type = searchParams.get("type") // "ticket", "credit", "cash-close"
    const id = searchParams.get("id")

    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: "Tipo e ID son requeridos" },
        { status: 400 }
      )
    }

    // Obtener información del negocio
    const tenant = await db.tenant.findUnique({
      where: { id: session.user.tenantId }
    })

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Negocio no encontrado" },
        { status: 404 }
      )
    }

    let printData: Record<string, unknown> = { business: tenant }

    switch (type) {
      case "ticket": {
        const sale = await db.sale.findFirst({
          where: { id, tenantId: session.user.tenantId },
          include: {
            items: true,
            customer: true
          }
        })

        if (!sale) {
          return NextResponse.json(
            { success: false, error: "Venta no encontrada" },
            { status: 404 }
          )
        }

        printData = {
          ...printData,
          type: "ticket",
          sale,
          title: "COMPROBANTE DE VENTA",
          date: sale.createdAt,
          items: sale.items,
          subtotal: sale.subtotal,
          tax: sale.tax,
          discount: sale.discount,
          total: sale.total,
          paymentMethod: sale.paymentMethod,
          customer: sale.customer
        }
        break
      }

      case "credit": {
        const credit = await db.credit.findFirst({
          where: { id, tenantId: session.user.tenantId },
          include: {
            customer: true,
            payments: { orderBy: { createdAt: "desc" } }
          }
        })

        if (!credit) {
          return NextResponse.json(
            { success: false, error: "Crédito no encontrado" },
            { status: 404 }
          )
        }

        printData = {
          ...printData,
          type: "credit",
          credit,
          title: "RECIBO DE ABONO",
          customer: credit.customer,
          totalAmount: credit.totalAmount,
          paidAmount: credit.paidAmount,
          balance: credit.balance
        }
        break
      }

      case "cash-close": {
        const cashRegister = await db.cashRegister.findFirst({
          where: { id, tenantId: session.user.tenantId }
        })

        if (!cashRegister) {
          return NextResponse.json(
            { success: false, error: "Caja no encontrada" },
            { status: 404 }
          )
        }

        printData = {
          ...printData,
          type: "cash-close",
          cashRegister,
          title: "CIERRE DE CAJA",
          openedAt: cashRegister.openedAt,
          closedAt: cashRegister.closedAt,
          initialCash: cashRegister.initialCash,
          finalCash: cashRegister.finalCash,
          totalSales: cashRegister.totalSales,
          totalCash: cashRegister.totalCash,
          totalCard: cashRegister.totalCard,
          totalTransfer: cashRegister.totalTransfer,
          totalCredit: cashRegister.totalCredit,
          totalExpenses: cashRegister.totalExpenses,
          difference: cashRegister.difference
        }
        break
      }

      default:
        return NextResponse.json(
          { success: false, error: "Tipo de impresión no válido" },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: printData
    })
  } catch (error) {
    console.error("Error generating print data:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

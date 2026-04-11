import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { startOfDay, subDays, format } from "date-fns"
import { es } from "date-fns/locale"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    // 1. KPIs Globales
    const totalRevenue = await db.sale.aggregate({
      _sum: { total: true }
    })

    const activeNodes = await db.tenant.count({
      where: { status: "ACTIVE" }
    })

    const pendingRequests = await db.tenant.count({
      where: { status: "PENDING" }
    })

    const totalAssets = await db.product.count()

    // 2. Datos para la gráfica (Semana actual)
    // Generamos los últimos 7 días
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      return {
        date,
        name: format(date, "eee", { locale: es }),
        total: 0
      }
    })

    // Obtenemos ventas agrupadas por día
    const sales = await db.sale.findMany({
      where: {
        createdAt: {
          gte: startOfDay(last7Days[0].date)
        }
      },
      select: {
        total: true,
        createdAt: true
      }
    })

    // Agregamos las ventas a los días correspondientes
    sales.forEach(sale => {
      const saleDay = format(sale.createdAt, "eee", { locale: es })
      const dayData = last7Days.find(d => d.name === saleDay)
      if (dayData) {
        dayData.total += sale.total
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue._sum.total || 0,
        activeNodes,
        pendingRequests,
        totalAssets
      },
      chartData: last7Days.map(d => ({ name: d.name, total: d.total }))
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

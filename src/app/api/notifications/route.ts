import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Obtener notificaciones del tenant
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const tenantId = session.user.tenantId

    // 1. Obtener notificaciones guardadas en DB (incluyendo "dismissals" de alertas dinámicas)
    const savedNotifications = await db.notification.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 50
    })

    // Crear un set de IDs leídos para filtrado rápido
    const readIds = new Set(
      savedNotifications
        .filter(n => n.isRead && n.referenceId)
        .map(n => n.referenceId)
    )

    // Generar notificaciones dinámicas basadas en el estado actual
    
    // 2. Productos con stock bajo (Filtrados por sede)
    const products = await db.product.findMany({
      where: { 
        tenantId, 
        isActive: true,
        ...(branchId && branchId !== "null" && branchId !== "undefined" ? {
          stockByBranch: {
            some: { branchId }
          }
        } : {})
      },
      include: {
        stockByBranch: branchId && branchId !== "null" && branchId !== "undefined" ? {
          where: { branchId }
        } : true
      }
    })
    
    const productsWithLowStock = products.map(p => {
      let stock = p.stock
      let minStock = p.minStock
      if (branchId && branchId !== "null" && branchId !== "undefined") {
        const bs = p.stockByBranch.find(s => s.branchId === branchId)
        if (bs) {
          stock = bs.stock
          minStock = bs.minStock ?? p.minStock
        } else {
          return null
        }
      }
      return { ...p, currentStock: stock, currentMinStock: minStock }
    })
    .filter((p): p is any => p !== null && p.currentStock < p.currentMinStock && !readIds.has(p.id))

    // 3. Créditos vencidos (Filtrados por sede)
    const overdueCredits = await db.credit.findMany({
      where: {
        tenantId,
        ...(branchId && branchId !== "null" && branchId !== "undefined" ? { branchId } : {}),
        status: "OVERDUE",
        balance: { gt: 0 }
      },
      include: { customer: true }
    })
    const filteredOverdue = overdueCredits.filter(c => !readIds.has(c.id))

    // 4. Créditos por vencer (próximos 7 días)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const dueSoonCredits = await db.credit.findMany({
      where: {
        tenantId,
        ...(branchId && branchId !== "null" && branchId !== "undefined" ? { branchId } : {}),
        status: { in: ["PENDING", "PARTIAL"] },
        dueDate: {
          gte: new Date(),
          lte: sevenDaysFromNow
        }
      },
      include: { customer: true }
    })
    const filteredDueSoon = dueSoonCredits.filter(c => !readIds.has(c.id))

    // Construir lista de notificaciones consolidada
    const notifications = [
      // Stock bajo
      ...productsWithLowStock.map(p => ({
        id: `low-stock-${p.id}`,
        type: "LOW_STOCK" as const,
        title: "Stock Bajo",
        message: `${p.name} tiene ${p.currentStock} unidades (mínimo: ${p.currentMinStock})`,
        referenceType: "product",
        referenceId: p.id,
        isRead: false,
        createdAt: new Date()
      })),
      // Créditos vencidos
      ...filteredOverdue.map(c => ({
        id: `overdue-${c.id}`,
        type: "CREDIT_OVERDUE" as const,
        title: "Crédito Vencido",
        message: `${c.customer.name} debe ${c.balance.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`,
        referenceType: "credit",
        referenceId: c.id,
        isRead: false,
        createdAt: new Date()
      })),
      // Créditos por vencer
      ...filteredDueSoon.map(c => ({
        id: `due-soon-${c.id}`,
        type: "CREDIT_DUE" as const,
        title: "Crédito por Vencer",
        message: `${c.customer.name} debe ${c.balance.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} - Vence: ${c.dueDate ? new Date(c.dueDate).toLocaleDateString('es-CO') : 'Sin fecha'}`,
        referenceType: "credit",
        referenceId: c.id,
        isRead: false,
        createdAt: new Date()
      })),
      // Notificaciones guardadas (que no sean dismissals de las de arriba)
      ...savedNotifications
        .filter(n => !n.referenceType) // Mostrar solo notificaciones "reales" o mensajes del sistema
        .map(n => ({
          id: n.id,
          type: n.type as any,
          title: n.title,
          message: n.message,
          referenceType: n.referenceType,
          referenceId: n.referenceId,
          isRead: n.isRead,
          createdAt: n.createdAt
        }))
    ]

    // Sort by date
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // "Welcome" if empty
    if (notifications.length === 0) {
      notifications.push({
        id: "welcome",
        type: "SYSTEM",
        title: "Sin novedades",
        message: "Todo está al día por ahora. Aquí verás alertas relevantes.",
        isRead: true,
        createdAt: new Date()
      })
    }
    
    const unreadCount = notifications.filter(n => !n.isRead).length

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PATCH - Marcar notificaciones como leídas o descartar alertas dinámicas
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
       return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const { ids, markAll, dynamicAlerts } = await request.json()
    const tenantId = session.user.tenantId

    if (markAll) {
      // 1. Marcar todas las guardadas como leídas
      await db.notification.updateMany({
        where: { tenantId, isRead: false },
        data: { isRead: true }
      })

      // 2. Si se pasan alertas dinámicas para "limpiar", las guardamos como registros de lectura
      if (dynamicAlerts && Array.isArray(dynamicAlerts)) {
        for (const alert of dynamicAlerts) {
           // Evitar duplicados
           const existing = await db.notification.findFirst({
             where: { tenantId, referenceId: alert.referenceId, isRead: true }
           })
           
           if (!existing) {
             await db.notification.create({
               data: {
                 tenantId,
                 type: alert.type || "SYSTEM",
                 title: alert.title || "Alerta Descartada",
                 message: alert.message || "",
                 referenceType: alert.referenceType,
                 referenceId: alert.referenceId,
                 isRead: true
               }
             })
           }
        }
      }
    } else if (ids && ids.length > 0) {
      await db.notification.updateMany({
        where: { id: { in: ids }, tenantId },
        data: { isRead: true }
      })
    }

    return NextResponse.json({ success: true, message: "Notificaciones actualizadas" })
  } catch (error) {
    console.error("Error updating notifications:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}

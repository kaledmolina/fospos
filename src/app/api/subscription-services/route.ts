import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Listar servicios de suscripción
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const services = await db.subscriptionService.findMany({
      where: {
        tenantId: session.user.tenantId,
        ...(activeOnly && { isActive: true })
      },
      include: {
        category: true,
        _count: {
          select: { subscriptions: true }
        }
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    console.error("Error fetching subscription services:", error)
    return NextResponse.json(
      { success: false, error: "Error al obtener servicios" },
      { status: 500 }
    )
  }
}

// POST - Crear servicio de suscripción
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    
    // Validar campos requeridos
    if (!data.name || !data.price) {
      return NextResponse.json(
        { success: false, error: "Nombre y precio son requeridos" },
        { status: 400 }
      )
    }

    // Verificar código único si se proporciona
    if (data.code) {
      const existingCode = await db.subscriptionService.findFirst({
        where: {
          tenantId: session.user.tenantId,
          code: data.code
        }
      })
      if (existingCode) {
        return NextResponse.json(
          { success: false, error: "Ya existe un servicio con ese código" },
          { status: 400 }
        )
      }
    }

    // Calcular días del ciclo de facturación
    const billingDays = getBillingDays(data.billingCycle, data.billingDays)

    const service = await db.subscriptionService.create({
      data: {
        tenantId: session.user.tenantId,
        name: data.name,
        code: data.code || null,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        price: parseFloat(data.price),
        setupFee: parseFloat(data.setupFee) || 0,
        billingCycle: data.billingCycle || "MONTHLY",
        billingDays: billingDays,
        durationMonths: data.durationMonths ? parseInt(data.durationMonths) : null,
        isActive: data.isActive !== false,
        maxFreezes: parseInt(data.maxFreezes) || 0,
        freezeDaysMax: parseInt(data.freezeDaysMax) || 0,
        categoryId: data.categoryId || null
      },
      include: { category: true }
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error("Error creating subscription service:", error)
    return NextResponse.json(
      { success: false, error: "Error al crear servicio" },
      { status: 500 }
    )
  }
}

// PUT - Actualizar servicio de suscripción
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: "ID del servicio requerido" },
        { status: 400 }
      )
    }

    // Verificar que el servicio pertenece al tenant
    const existing = await db.subscriptionService.findFirst({
      where: { id: data.id, tenantId: session.user.tenantId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Servicio no encontrado" },
        { status: 404 }
      )
    }

    // Verificar código único si se está cambiando
    if (data.code && data.code !== existing.code) {
      const duplicateCode = await db.subscriptionService.findFirst({
        where: {
          tenantId: session.user.tenantId,
          code: data.code,
          NOT: { id: data.id }
        }
      })
      if (duplicateCode) {
        return NextResponse.json(
          { success: false, error: "Ya existe otro servicio con ese código" },
          { status: 400 }
        )
      }
    }

    const billingDays = getBillingDays(data.billingCycle, data.billingDays)

    const service = await db.subscriptionService.update({
      where: { id: data.id },
      data: {
        name: data.name,
        code: data.code || null,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        price: parseFloat(data.price),
        setupFee: parseFloat(data.setupFee) || 0,
        billingCycle: data.billingCycle,
        billingDays: billingDays,
        durationMonths: data.durationMonths ? parseInt(data.durationMonths) : null,
        isActive: data.isActive,
        maxFreezes: parseInt(data.maxFreezes) || 0,
        freezeDaysMax: parseInt(data.freezeDaysMax) || 0,
        categoryId: data.categoryId || null
      },
      include: { category: true }
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error("Error updating subscription service:", error)
    return NextResponse.json(
      { success: false, error: "Error al actualizar servicio" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar servicio de suscripción
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
        { success: false, error: "ID del servicio requerido" },
        { status: 400 }
      )
    }

    // Verificar que el servicio pertenece al tenant
    const existing = await db.subscriptionService.findFirst({
      where: { id, tenantId: session.user.tenantId },
      include: { _count: { select: { subscriptions: true } } }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Servicio no encontrado" },
        { status: 404 }
      )
    }

    // Verificar si tiene suscripciones activas
    if (existing._count.subscriptions > 0) {
      return NextResponse.json(
        { success: false, error: `No se puede eliminar. Tiene ${existing._count.subscriptions} suscripciones asociadas.` },
        { status: 400 }
      )
    }

    await db.subscriptionService.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Servicio eliminado" })
  } catch (error) {
    console.error("Error deleting subscription service:", error)
    return NextResponse.json(
      { success: false, error: "Error al eliminar servicio" },
      { status: 500 }
    )
  }
}

// Helper para calcular días del ciclo
function getBillingDays(cycle: string, customDays?: number): number {
  switch (cycle) {
    case "DAILY": return 1
    case "WEEKLY": return 7
    case "BIWEEKLY": return 15
    case "MONTHLY": return 30
    case "QUARTERLY": return 90
    case "SEMIANNUAL": return 180
    case "YEARLY": return 365
    case "CUSTOM": return customDays || 30
    default: return 30
  }
}

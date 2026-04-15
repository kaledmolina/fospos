import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Obtener caja actual
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
    const branchId = searchParams.get("branchId")
    const type = searchParams.get("type")

    const where: any = {
      tenantId: session.user.tenantId,
      ...(branchId ? { branchId } : {})
    }

    if (type === "history") {
      const history = await db.cashRegister.findMany({
        where,
        include: {
          openedByUser: { select: { name: true } },
          closedByUser: { select: { name: true } }
        },
        orderBy: { openedAt: "desc" },
        take: 30
      })
      return NextResponse.json({ success: true, data: history })
    }

    // Buscar caja abierta
    const openCash = await db.cashRegister.findFirst({
      where: {
        ...where,
        status: "OPEN"
      },
      include: {
        openedByUser: { select: { name: true } }
      },
      orderBy: { openedAt: "desc" }
    })

    if (openCash) {
      return NextResponse.json({
        success: true,
        data: openCash
      })
    }

    // Si no hay caja abierta, mostrar la última cerrada
    const lastCash = await db.cashRegister.findFirst({
      where: {
        ...where,
        status: "CLOSED"
      },
      orderBy: { closedAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: lastCash || null
    })
  } catch (error) {
    console.error("Error fetching cash register:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Abrir caja
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
    const { initialCash } = body
    const branchId = body.branchId || session.user.branchId

    if (!branchId) {
      return NextResponse.json(
        { success: false, error: "La sucursal es requerida para abrir caja" },
        { status: 400 }
      )
    }

    // Verificar si ya hay una caja abierta en esta sucursal
    const openCash = await db.cashRegister.findFirst({
      where: {
        tenantId: session.user.tenantId,
        branchId: branchId,
        status: "OPEN"
      }
    })

    if (openCash) {
      return NextResponse.json(
        { success: false, error: "Ya hay una caja abierta en esta sucursal" },
        { status: 400 }
      )
    }

    const cashRegister = await db.cashRegister.create({
      data: {
        tenantId: session.user.tenantId,
        branchId: branchId,
        initialCash: initialCash || 0,
        status: "OPEN",
        openedByUser: {
          connect: { id: session.user.id }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Caja abierta exitosamente",
      data: cashRegister
    })
  } catch (error) {
    console.error("❌ Error al abrir caja:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PATCH - Cerrar caja (arqueo)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { finalCash, notes } = body
    const branchId = body.branchId || session.user.branchId

    // Buscar caja abierta en esta sucursal
    const openCash = await db.cashRegister.findFirst({
      where: {
        tenantId: session.user.tenantId,
        branchId: branchId || undefined,
        status: "OPEN"
      }
    })

    if (!openCash) {
      return NextResponse.json(
        { success: false, error: "No hay caja abierta en esta sucursal" },
        { status: 400 }
      )
    }

    // Calcular el efectivo esperado
    const expectedCash = openCash.initialCash + openCash.totalCash
    const difference = finalCash - expectedCash

    const closedCash = await db.cashRegister.update({
      where: { id: openCash.id },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
        closedBy: session.user.id,
        finalCash,
        difference,
        notes
      }
    })

    return NextResponse.json({
      success: true,
      message: "Caja cerrada exitosamente",
      data: {
        ...closedCash,
        expectedCash,
        difference
      }
    })
  } catch (error) {
    console.error("Error closing cash register:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

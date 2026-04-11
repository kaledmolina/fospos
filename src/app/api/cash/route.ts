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

    const where: any = {
      tenantId: session.user.tenantId,
      ...(branchId ? { branchId } : {})
    }

    // Buscar caja abierta
    const openCash = await db.cashRegister.findFirst({
      where: {
        ...where,
        status: "OPEN"
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

    // Verificar si ya hay una caja abierta
    const openCash = await db.cashRegister.findFirst({
      where: {
        tenantId: session.user.tenantId,
        status: "OPEN"
      }
    })

    if (openCash) {
      return NextResponse.json(
        { success: false, error: "Ya hay una caja abierta" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { initialCash } = body

    const cashRegister = await db.cashRegister.create({
      data: {
        tenantId: session.user.tenantId,
        openedBy: session.user.id,
        initialCash: initialCash || 0
      }
    })

    return NextResponse.json({
      success: true,
      message: "Caja abierta exitosamente",
      data: cashRegister
    })
  } catch (error) {
    console.error("Error opening cash register:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
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

    // Buscar caja abierta
    const openCash = await db.cashRegister.findFirst({
      where: {
        tenantId: session.user.tenantId,
        status: "OPEN"
      }
    })

    if (!openCash) {
      return NextResponse.json(
        { success: false, error: "No hay caja abierta" },
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

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Obtener crédito específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const credit = await db.credit.findFirst({
      where: {
        id,
        tenantId: session.user.tenantId
      },
      include: {
        customer: true,
        sale: {
          include: { items: true }
        },
        payments: {
          orderBy: { createdAt: "desc" }
        }
      }
    })

    if (!credit) {
      return NextResponse.json(
        { success: false, error: "Crédito no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: credit
    })
  } catch (error) {
    console.error("Error fetching credit:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Registrar abono a crédito
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, paymentMethod, notes, date } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "El monto debe ser mayor a 0" },
        { status: 400 }
      )
    }

    const credit = await db.credit.findFirst({
      where: { id, tenantId: session.user.tenantId }
    })

    if (!credit) {
      return NextResponse.json(
        { success: false, error: "Crédito no encontrado" },
        { status: 404 }
      )
    }

    if (credit.balance < amount) {
      return NextResponse.json(
        { success: false, error: "El monto excede el saldo pendiente" },
        { status: 400 }
      )
    }

    // Crear el abono
    await db.creditPayment.create({
      data: {
        creditId: id,
        amount,
        paymentMethod: paymentMethod || "CASH",
        notes,
        registeredById: session.user.id,
        createdAt: date ? new Date(date) : new Date()
      }
    })

    // Actualizar el crédito
    const newPaidAmount = credit.paidAmount + amount
    const newBalance = credit.balance - amount
    let newStatus = credit.status

    if (newBalance === 0) {
      newStatus = "PAID"
    } else if (newPaidAmount > 0) {
      newStatus = "PARTIAL"
    }

    await db.credit.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        balance: newBalance,
        status: newStatus
      }
    })

    return NextResponse.json({
      success: true,
      message: "Abono registrado exitosamente"
    })
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

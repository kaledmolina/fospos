import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Listar gastos del tenant
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
    const category = searchParams.get("category")
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const branchId = searchParams.get("branchId")

    const where: any = {
      tenantId: session.user.tenantId,
      ...(branchId ? { branchId } : {})
    }

    if (category) {
      where.category = category
    }

    if (from || to) {
      where.date = {}
      if (from) where.date = { ...where.date, gte: new Date(from) }
      if (to) where.date = { ...where.date, lte: new Date(to) }
    }

    const expenses = await db.expense.findMany({
      where,
      orderBy: { date: "desc" }
    })

    // Calcular totales por categoría
    const totals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      data: expenses,
      totals,
      total: expenses.reduce((sum, e) => sum + e.amount, 0)
    })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Crear gasto
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
    const { category, description, amount, date, cashRegisterId, notes } = body

    if (!category || !description || !amount) {
      return NextResponse.json(
        { success: false, error: "Categoría, descripción y monto son requeridos" },
        { status: 400 }
      )
    }

    const expense = await db.expense.create({
      data: {
        tenantId: session.user.tenantId,
        category,
        description,
        amount,
        date: date ? new Date(date) : new Date(),
        cashRegisterId,
        notes,
        createdBy: session.user.id
      }
    })

    // Actualizar gastos en la caja si aplica
    if (cashRegisterId) {
      await db.cashRegister.update({
        where: { id: cashRegisterId },
        data: { totalExpenses: { increment: amount } }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Gasto registrado exitosamente",
      data: expense
    })
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

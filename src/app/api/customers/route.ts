import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Listar clientes del tenant
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
    const search = searchParams.get("search")

    const where: Record<string, unknown> = {
      tenantId: session.user.tenantId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { document: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } }
      ]
    }

    const customers = await db.customer.findMany({
      where,
      include: {
        _count: {
          select: { sales: true, credits: true }
        },
        credits: {
          where: { status: { in: ["PENDING", "PARTIAL"] } },
          select: { balance: true }
        }
      },
      orderBy: { name: "asc" }
    })

    // Calcular saldo pendiente de cada cliente
    const customersWithBalance = customers.map(customer => ({
      ...customer,
      pendingBalance: customer.credits.reduce((sum, c) => sum + c.balance, 0)
    }))

    return NextResponse.json({
      success: true,
      data: customersWithBalance
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Crear cliente
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
      documentType, document, name, phone, 
      email, address, notes, creditLimit 
    } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: "El nombre es requerido" },
        { status: 400 }
      )
    }

    // Si tiene documento, verificar que sea único
    if (document) {
      const existing = await db.customer.findFirst({
        where: {
          tenantId: session.user.tenantId,
          document
        }
      })

      if (existing) {
        return NextResponse.json(
          { success: false, error: "Ya existe un cliente con ese documento" },
          { status: 400 }
        )
      }
    }

    const customer = await db.customer.create({
      data: {
        tenantId: session.user.tenantId,
        documentType: documentType || "CC",
        document,
        name,
        phone,
        email,
        address,
        notes,
        creditLimit: creditLimit || 0
      }
    })

    return NextResponse.json({
      success: true,
      message: "Cliente creado exitosamente",
      data: customer
    })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Listar proveedores
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const suppliers = await db.supplier.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { name: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: suppliers
    })
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Crear proveedor
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
    const { name, nit, phone, email, address, notes } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: "El nombre es requerido" },
        { status: 400 }
      )
    }

    const supplier = await db.supplier.create({
      data: {
        tenantId: session.user.tenantId,
        name,
        nit,
        phone,
        email,
        address,
        notes
      }
    })

    return NextResponse.json({
      success: true,
      message: "Proveedor creado exitosamente",
      data: supplier
    })
  } catch (error) {
    console.error("Error creating supplier:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Listar categorías del tenant/branch
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
    const branchId = searchParams.get("branchId") || session.user.branchId

    const where: any = {
      tenantId: session.user.tenantId
    }

    if (branchId) {
      where.branchId = branchId
    }

    const categories = await db.category.findMany({
      where,
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Crear categoría
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
    const { name, description, color, icon, imageUrl } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: "El nombre es requerido" },
        { status: 400 }
      )
    }

    // Verificar si ya existe (SQLite no soporta insensitive en Prisma nativo de esta forma)
    const existing = await db.category.findFirst({
      where: {
        tenantId: session.user.tenantId,
        name: name
      }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Ya existe una categoría con ese nombre" },
        { status: 400 }
      )
    }

    const category = await db.category.create({
      data: {
        tenantId: session.user.tenantId,
        branchId: body.branchId || session.user.branchId || null,
        name,
        description,
        color,
        icon,
        imageUrl
      }
    })

    return NextResponse.json({
      success: true,
      message: "Categoría creada exitosamente",
      data: category
    })
  } catch (error: any) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Error interno del servidor" },
      { status: 500 }
    )
  }
}

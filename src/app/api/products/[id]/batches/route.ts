import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const productId = params.id
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")

    if (!branchId) {
      return NextResponse.json({ success: false, error: "Sucursal requerida" }, { status: 400 })
    }

    const batches = await db.productBatch.findMany({
      where: {
        productId,
        branchId,
        isActive: true,
        quantity: { gt: 0 }
      },
      include: {
        supplier: {
          select: { id: true, name: true }
        }
      },
      orderBy: {
        createdAt: "asc" // FIFO por defecto en la lista
      }
    })

    return NextResponse.json({
      success: true,
      data: batches
    })

  } catch (error) {
    console.error("Error fetching product batches:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}

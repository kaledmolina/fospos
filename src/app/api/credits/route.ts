import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Listar créditos del tenant
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
    const status = searchParams.get("status")
    const customerId = searchParams.get("customerId")

    const where: Record<string, unknown> = {
      tenantId: session.user.tenantId
    }

    if (status && status !== "all") {
      where.status = status
    }

    if (customerId) {
      where.customerId = customerId
    }

    const credits = await db.credit.findMany({
      where,
      include: {
        customer: true,
        payments: {
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: credits
    })
  } catch (error) {
    console.error("Error fetching credits:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

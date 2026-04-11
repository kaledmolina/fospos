import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId")

    const where: any = {}
    if (tenantId && tenantId !== "all") {
      where.tenantId = tenantId
    }

    const users = await db.user.findMany({
      where,
      include: {
        tenant: {
          select: { businessName: true }
        },
        branch: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error("Error fetching global users:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const { code } = params
    const coupon = await db.coupon.findUnique({
      where: { 
        tenantId_code: {
          tenantId: session.user.tenantId,
          code: code.toUpperCase()
        }
      }
    })

    if (!coupon) {
      return NextResponse.json({ success: false, error: "Cupón no encontrado" }, { status: 404 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, error: "Cupón inactivo" }, { status: 400 })
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, error: "Cupón expirado" }, { status: 400 })
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json({ success: false, error: "Cupón agotado" }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: coupon })
  } catch (error) {
    console.error("Error validating coupon:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}

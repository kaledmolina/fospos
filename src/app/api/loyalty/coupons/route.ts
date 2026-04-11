import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Listar cupones
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const coupons = await db.coupon.findMany({
      where: { 
        tenantId: session.user.tenantId,
        isActive: true
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ success: true, data: coupons })
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}

// POST - Crear cupón
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      code, description, type, value, 
      minPurchase, maxUses, expiresAt 
    } = body

    const coupon = await db.coupon.create({
      data: {
        tenantId: session.user.tenantId,
        code: code.toUpperCase(),
        description,
        type,
        value,
        minPurchase: minPurchase || 0,
        maxUses: maxUses || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true
      }
    })

    return NextResponse.json({ success: true, data: coupon })
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return NextResponse.json({ success: false, error: "El código de cupón ya existe" }, { status: 400 })
    }
    console.error("Error creating coupon:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}

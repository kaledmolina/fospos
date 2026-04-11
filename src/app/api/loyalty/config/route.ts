import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Obtener configuración de lealtad
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    let config = await db.pointConfig.findUnique({
      where: { tenantId: session.user.tenantId }
    })

    // Si no existe, crear una por defecto
    if (!config) {
      config = await db.pointConfig.create({
        data: {
          tenantId: session.user.tenantId,
          isActive: false,
          pointsPerAmount: 1,
          amountStep: 1000,
          redemptionValue: 10,
          minPointsToRedeem: 100
        }
      })
    }

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error("Error fetching loyalty config:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}

// PUT - Actualizar configuración
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { isActive, pointsPerAmount, amountStep, redemptionValue, minPointsToRedeem } = body

    const config = await db.pointConfig.upsert({
      where: { tenantId: session.user.tenantId },
      update: {
        isActive,
        pointsPerAmount,
        amountStep,
        redemptionValue,
        minPointsToRedeem
      },
      create: {
        tenantId: session.user.tenantId,
        isActive,
        pointsPerAmount,
        amountStep,
        redemptionValue,
        minPointsToRedeem
      }
    })

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error("Error updating loyalty config:", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { crypto } from "crypto"

// GET - Listar todos los códigos de activación (Solo Super Admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const codes = await db.activationCode.findMany({
      include: {
        tenant: {
          select: {
            businessName: true,
            nit: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: codes
    })
  } catch (error) {
    console.error("Error fetching activation codes:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Generar nuevo código de activación (Solo Super Admin)
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    // Generar código con formato FOST-XXXX-XXXX
    const generateSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase()
    const code = `FOST-${generateSegment()}-${generateSegment()}`

    const newCode = await db.activationCode.create({
      data: {
        code,
        createdBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      data: newCode
    })
  } catch (error) {
    console.error("Error generating activation code:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

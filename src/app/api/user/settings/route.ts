import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { theme } = body

    if (!theme || !["light", "dark"].includes(theme)) {
      return NextResponse.json(
        { success: false, error: "Tema inválido" },
        { status: 400 }
      )
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { theme }
    })

    return NextResponse.json({
      success: true,
      message: `Preferencia de tema actualizada a ${theme}`
    })
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

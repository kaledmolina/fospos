import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        theme: true,
        tenantId: true
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, password } = body

    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        theme: true
      }
    })

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error: any) {
    console.error("Profile update error:", error)
    if (error.code === 'P2002') {
       return NextResponse.json({ success: false, error: "El email ya está en uso" }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "Error al actualizar perfil" }, { status: 500 })
  }
}

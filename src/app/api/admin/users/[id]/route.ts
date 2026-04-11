import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const id = params.id
    const body = await request.json()
    const { name, email, role, isActive, password } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const user = await db.user.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: user
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// PATCH - Actualizar usuario
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session || !session.user.tenantId || session.user.role !== "TENANT_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, password, role, branchId, phone, isActive } = body

    // Verificar que el usuario pertenece al tenant
    const existingUser = await db.user.findFirst({
      where: { id, tenantId: session.user.tenantId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Preparar datos de actualización
    const updateData: Record<string, unknown> = {}
    
    if (name) updateData.name = name
    if (email) {
      // Verificar que el email no esté en uso por otro usuario
      const emailCheck = await db.user.findFirst({
        where: { email, NOT: { id } }
      })
      if (emailCheck) {
        return NextResponse.json(
          { success: false, error: "El email ya está en uso" },
          { status: 400 }
        )
      }
      updateData.email = email
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }
    if (role && ["CASHIER", "WAREHOUSE"].includes(role)) {
      updateData.role = role
    }
    if (branchId !== undefined) {
      // Verificar que la sucursal pertenece al tenant
      if (branchId) {
        const branch = await db.branch.findFirst({
          where: { id: branchId, tenantId: session.user.tenantId }
        })
        if (!branch) {
          return NextResponse.json(
            { success: false, error: "Sucursal no encontrada" },
            { status: 400 }
          )
        }
      }
      updateData.branchId = branchId
    }
    if (phone !== undefined) updateData.phone = phone
    if (isActive !== undefined) updateData.isActive = isActive

    const user = await db.user.update({
      where: { id },
      data: updateData,
      include: {
        branch: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Usuario actualizado exitosamente",
      data: {
        ...user,
        password: undefined
      }
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session || !session.user.tenantId || session.user.role !== "TENANT_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el usuario pertenece al tenant
    const user = await db.user.findFirst({
      where: { id, tenantId: session.user.tenantId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    await db.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado exitosamente"
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

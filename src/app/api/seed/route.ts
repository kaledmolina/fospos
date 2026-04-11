import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// Endpoint para crear el Super Admin inicial
// Solo funciona si no existe ningún usuario
export async function POST(request: Request) {
  try {
    // Verificar si ya existe algún usuario
    const existingUser = await db.user.findFirst()
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Ya existen usuarios en el sistema" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { email, password, name, setupKey } = body

    // Validar Clave de Seguridad desde .env
    const envSetupKey = process.env.SETUP_KEY
    if (!envSetupKey || setupKey !== envSetupKey) {
      return NextResponse.json(
        { success: false, error: "Clave de Seguridad (Setup Key) inválida" },
        { status: 401 }
      )
    }

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Email, contraseña y nombre son requeridos" },
        { status: 400 }
      )
    }

    // Crear Super Admin
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const superAdmin = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "SUPER_ADMIN",
        tenantId: null
      }
    })

    return NextResponse.json({
      success: true,
      message: "Super Admin creado exitosamente",
      data: {
        id: superAdmin.id,
        email: superAdmin.email,
        name: superAdmin.name,
        role: superAdmin.role
      }
    })
  } catch (error) {
    console.error("Error creating super admin:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

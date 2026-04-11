import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ success: false, error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Validar extensión básica
    if (!file.name.endsWith(".db")) {
      return NextResponse.json({ success: false, error: "El archivo debe tener extensión .db" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const dbPath = path.join(process.cwd(), "db", "custom.db")

    // Cerrar conexiones antes de sobrescribir
    await db.$disconnect()
    
    // Sobrescribir base de datos
    fs.writeFileSync(dbPath, buffer)

    return NextResponse.json({
      success: true,
      message: "Base de datos restaurada correctamente. Recargando sistema..."
    })
  } catch (error) {
    console.error("Error restoring backup:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

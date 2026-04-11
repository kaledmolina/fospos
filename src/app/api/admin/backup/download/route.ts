import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    const dbPath = path.join(process.cwd(), "db", "custom.db")
    
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ success: false, error: "Base de datos no encontrada" }, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(dbPath)
    
    const date = new Date().toISOString().split('T')[0]
    const filename = `fostpos_backup_${date}.db`

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error downloading backup:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

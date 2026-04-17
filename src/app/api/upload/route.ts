import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No se ha proporcionado ningún archivo" },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "El archivo debe ser una imagen" },
        { status: 400 }
      )
    }

    // Validar tamaño (ej: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "La imagen no debe superar los 5MB" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear nombre de archivo único
    const extension = file.name.split(".").pop()
    const filename = `${uuidv4()}.${extension}`
    
    // Ruta de guardado
    const uploadDir = join(process.cwd(), "public", "uploads", "products")
    const path = join(uploadDir, filename)

    // Escribir archivo
    await writeFile(path, buffer)

    // Retornar la URL relativa
    const imageUrl = `/uploads/products/${filename}`

    return NextResponse.json({
      success: true,
      message: "Imagen subida exitosamente",
      imageUrl
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { success: false, error: "Error interno al subir el archivo" },
      { status: 500 }
    )
  }
}

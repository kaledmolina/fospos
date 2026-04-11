import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Endpoint para resetear la base de datos (solo si no hay ventas)
export async function POST() {
  try {
    // Verificar si hay ventas (no borrar si hay datos reales)
    const salesCount = await db.sale.count()
    
    if (salesCount > 0) {
      return NextResponse.json(
        { success: false, error: "No se puede resetear: ya hay ventas registradas" },
        { status: 400 }
      )
    }
    
    // Borrar todo en orden correcto (respetando foreign keys)
    await db.creditPayment.deleteMany()
    await db.credit.deleteMany()
    await db.saleItem.deleteMany()
    await db.sale.deleteMany()
    await db.product.deleteMany()
    await db.category.deleteMany()
    await db.customer.deleteMany()
    await db.cashRegister.deleteMany()
    await db.user.deleteMany()
    await db.tenant.deleteMany()
    
    return NextResponse.json({
      success: true,
      message: "Base de datos reseteada. Recarga la página para crear el Super Admin."
    })
  } catch (error) {
    console.error("Error resetting database:", error)
    return NextResponse.json(
      { success: false, error: "Error al resetear la base de datos" },
      { status: 500 }
    )
  }
}

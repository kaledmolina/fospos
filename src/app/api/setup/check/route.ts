import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Endpoint público para verificar si existe algún usuario en el sistema
// No requiere autenticación
export async function GET() {
  try {
    const userCount = await db.user.count()
    
    return NextResponse.json({
      success: true,
      needsSetup: userCount === 0,
      hasUsers: userCount > 0,
      count: userCount
    })
  } catch (error) {
    console.error("Error checking users:", error)
    return NextResponse.json(
      { success: false, hasUsers: false, count: 0 },
      { status: 500 }
    )
  }
}

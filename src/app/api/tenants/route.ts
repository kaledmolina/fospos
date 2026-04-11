import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// GET - Listar todos los tenants (Solo Super Admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const tenants = await db.tenant.findMany({
      include: {
        _count: {
          select: {
            products: true,
            customers: true,
            sales: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Calcular ventas totales por tenant
    const tenantsWithSales = await Promise.all(
      tenants.map(async (tenant) => {
        const sales = await db.sale.aggregate({
          where: { tenantId: tenant.id },
          _sum: { total: true }
        })
        return {
          ...tenant,
          totalSales: sales._sum.total || 0
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: tenantsWithSales
    })
  } catch (error) {
    console.error("Error fetching tenants:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Registrar nuevo negocio (Landing Page)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessName, nit, ownerName, phone, email, city, address, password } = body

    // Validación de campos requeridos
    if (!businessName || !nit || !ownerName || !phone || !email || !city || !password) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // Verificar si ya existe un negocio con ese NIT
    const existingTenant = await db.tenant.findUnique({
      where: { nit }
    })

    if (existingTenant) {
      return NextResponse.json(
        { success: false, error: "Ya existe un negocio registrado con ese NIT" },
        { status: 400 }
      )
    }

    // Verificar si ya existe un usuario con ese email
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Ya existe una cuenta con ese correo electrónico" },
        { status: 400 }
      )
    }

    // Crear el tenant, su cursal inicial y el usuario en una transacción
    const result = await db.$transaction(async (tx) => {
      let initialStatus: "PENDING" | "ACTIVE" = "PENDING"
      let activationCodeId: string | null = null

      // Validar código de activación si se proporcionó
      if (body.activationCode) {
        const validCode = await tx.activationCode.findFirst({
          where: {
            code: body.activationCode,
            isUsed: false
          }
        })

        if (!validCode) {
           throw new Error("El código de activación es inválido o ya ha sido usado")
        }
        
        initialStatus = "ACTIVE"
        activationCodeId = validCode.id
      }

      // 1. Crear el tenant
      const tenant = await tx.tenant.create({
        data: {
          businessName,
          nit,
          ownerName,
          phone,
          email,
          city,
          address,
          status: initialStatus,
          activatedAt: initialStatus === "ACTIVE" ? new Date() : null
        }
      })

      // 2. Marcar el código de activación como usado si aplica
      if (activationCodeId) {
        await tx.activationCode.update({
          where: { id: activationCodeId },
          data: {
            isUsed: true,
            usedAt: new Date(),
            tenantId: tenant.id
          }
        })
      }

      // 3. Crear la sucursal inicial (Sede Principal)
      const branch = await tx.branch.create({
        data: {
          tenantId: tenant.id,
          name: businessName,
          city,
          address,
          phone,
          isMain: true,
          isActive: true
        }
      })

      // 4. Crear el usuario administrador vinculado al tenant y a la sucursal
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: ownerName,
          role: "TENANT_ADMIN",
          tenantId: tenant.id,
          branchId: branch.id
        }
      })

      return { tenant, branch, user }
    })

    return NextResponse.json({
      success: true,
      message: "¡Solicitud registrada exitosamente! Tu cuenta está pendiente de activación. Nos comunicaremos contigo pronto.",
      data: {
        id: result.tenant.id,
        businessName: result.tenant.businessName,
        status: result.tenant.status,
        mainBranchId: result.branch.id
      }
    })
  } catch (error: any) {
    console.error("Error creating tenant:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Error interno del servidor" },
      { status: error.message ? 400 : 500 }
    )
  }
}

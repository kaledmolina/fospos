import { db } from './src/lib/db'

async function checkUsers() {
  const users = await db.user.findMany({
    include: {
      tenant: { select: { businessName: true } },
      branch: { select: { name: true } }
    }
  })
  
  console.log("=== TODOS LOS USUARIOS ===")
  for (const user of users) {
    console.log({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      tenant: user.tenant?.businessName || 'SIN TENANT',
      branch: user.branch?.name || 'Sin sucursal'
    })
  }
  
  await db.$disconnect()
}

checkUsers()

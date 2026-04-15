const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.cashRegister.updateMany({
    where: { 
      status: 'OPEN',
      branchId: null
    },
    data: {
      status: 'CLOSED',
      closedAt: new Date(),
      notes: 'Cierre automático por migración de sucursales'
    }
  })
  console.log(`Updated ${result.count} orphan registers.`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

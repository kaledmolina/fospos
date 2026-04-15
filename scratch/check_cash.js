const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const openRegisters = await prisma.cashRegister.findMany({
    where: { status: 'OPEN' },
    select: {
      id: true,
      tenantId: true,
      branchId: true,
      openedAt: true,
      initialCash: true,
      totalSales: true
    }
  })
  console.log('Open Registers:', JSON.stringify(openRegisters, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

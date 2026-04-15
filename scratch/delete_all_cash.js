const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.cashRegister.deleteMany({})
  console.log(`Deleted ${result.count} cash registers.`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

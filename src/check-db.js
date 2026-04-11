const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.count()
  console.log('--- DB CHECK ---')
  console.log('User count:', users)
}

main().finally(() => prisma.$disconnect())

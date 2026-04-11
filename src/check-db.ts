import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.count()
  const tenants = await prisma.tenant.count()
  console.log('--- DB CHECK ---')
  console.log('User count:', users)
  console.log('Tenant count:', tenants)
  if (users > 0) {
    const user = await prisma.user.findFirst({ select: { email: true, role: true } })
    console.log('First user:', user)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

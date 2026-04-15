
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const user = await prisma.user.update({
    where: { email: 'kaledmolynft2@gmail.com' },
    data: { password: hashedPassword }
  });
  console.log('Password reset for:', user.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test data...');

  // 1. Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { nit: '900123456-1' },
    update: {},
    create: {
      nit: '900123456-1',
      businessName: 'Test Business',
      ownerName: 'Test Owner',
      phone: '1234567890',
      email: 'test@business.com',
      city: 'Test City',
      status: 'ACTIVE',
    },
  });

  // 2. Create Branch
  const branch = await prisma.branch.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Test Branch' } },
    update: {},
    create: {
      name: 'Test Branch',
      address: 'Test Street 123',
      tenantId: tenant.id,
      isActive: true,
    },
  });

  // 3. Create User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@fostpos.com' },
    update: {
      password: hashedPassword,
      tenantId: tenant.id,
      role: 'TENANT_ADMIN',
      isActive: true,
    },
    create: {
      email: 'test@fostpos.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'TENANT_ADMIN',
      tenantId: tenant.id,
      isActive: true,
    },
  });

  // Connect user to branch
  await prisma.user.update({
    where: { id: user.id },
    data: {
      branches: {
        connect: { id: branch.id }
      }
    }
  });

  // 4. Create Category
  const category = await prisma.category.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Test Category' } },
    update: {},
    create: {
      name: 'Test Category',
      tenantId: tenant.id,
    },
  });

  // 5. Create Product
  await prisma.product.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'TEST-PROD-001' } },
    update: {
      stock: 100,
      salePrice: 1000,
    },
    create: {
      code: 'TEST-PROD-001',
      name: 'Test Product',
      description: 'A product for testing',
      salePrice: 1000,
      costPrice: 500,
      stock: 100,
      unit: 'UND',
      tenantId: tenant.id,
      categoryId: category.id,
      isActive: true,
    },
  });

  console.log('✅ Test data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

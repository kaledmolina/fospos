const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('--- WIPING DATABASE (Using Prisma Models) ---')
  
  const models = [
    'saleItem', 'creditPayment', 'credit', 'sale', 'cashRegister',
    'expense', 'productStock', 'product', 'category', 'customer',
    'notification', 'inventoryMovement', 'subscriptionService', 
    'customerSubscription', 'pointConfig', 'coupon', 'activationCode',
    'branch', 'user', 'tenant'
  ]

  for (const model of models) {
    try {
      if (prisma[model]) {
        await prisma[model].deleteMany({})
        console.log(`Wiped ${model}`)
      }
    } catch (e) {
      console.log(`Failed to wipe ${model}:`, e.message)
    }
  }

  console.log('--- WIPE COMPLETE ---')
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())

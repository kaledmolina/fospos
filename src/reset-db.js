const { PrismaClient } = require('./generated/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando borrado selectivo de datos...')

  try {
    // 1. Datos transaccionales y de registro
    console.log('🗑️  Borrando movimientos y registros...')
    await prisma.inventoryMovement.deleteMany()
    await prisma.saleItem.deleteMany()
    await prisma.salePayment.deleteMany()
    await prisma.giftCardRedemption.deleteMany()
    await prisma.purchaseOrderItem.deleteMany()
    await prisma.purchaseOrder.deleteMany()
    await prisma.sale.deleteMany()
    await prisma.creditPayment.deleteMany()
    await prisma.credit.deleteMany()
    await prisma.cashRegister.deleteMany()
    await prisma.expense.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.activityLog.deleteMany()

    // 2. Suscripciones y Fidelización
    console.log('🗑️  Borrando suscripciones y cupones...')
    await prisma.customerSubscription.deleteMany()
    await prisma.subscriptionService.deleteMany()
    await prisma.coupon.deleteMany()
    await prisma.giftCard.deleteMany()

    // 3. Inventario y Productos
    console.log('🗑️  Borrando productos y lotes...')
    await prisma.productBatch.deleteMany()
    await prisma.productPresentation.deleteMany()
    await prisma.productStock.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.supplier.deleteMany()

    // 4. Clientes
    console.log('🗑️  Borrando clientes...')
    await prisma.customer.deleteMany()

    console.log('✅ Datos borrados exitosamente.')
    console.log('ℹ️  Se mantuvieron: Usuarios, Tenants, Sucursales y Códigos de Activación.')
  } catch (error) {
    console.error('❌ Error al borrar datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

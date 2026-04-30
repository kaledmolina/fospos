const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando limpieza de base de datos ---');
  
  try {
    // El orden importa por las llaves foráneas
    console.log('Borrando movimientos de inventario...');
    await prisma.inventoryMovement.deleteMany({});
    
    console.log('Borrando items de venta...');
    await prisma.saleItem.deleteMany({});
    
    console.log('Borrando pagos de venta...');
    await prisma.salePayment.deleteMany({});
    
    console.log('Borrando redenciones de tarjetas de regalo...');
    await prisma.giftCardRedemption.deleteMany({});
    
    console.log('Borrando créditos y abonos...');
    await prisma.creditPayment.deleteMany({});
    await prisma.credit.deleteMany({});
    
    console.log('Borrando ventas...');
    await prisma.sale.deleteMany({});
    
    console.log('Borrando presentaciones de productos...');
    await prisma.productPresentation.deleteMany({});
    
    console.log('Borrando lotes de productos...');
    await prisma.productBatch.deleteMany({});
    
    console.log('Borrando stock por sucursal...');
    await prisma.productStock.deleteMany({});
    
    console.log('Borrando productos...');
    await prisma.product.deleteMany({});

    console.log('Borrando categorías...');
    await prisma.category.deleteMany({});
    
    console.log('--- Limpieza completada con éxito ---');
  } catch (error) {
    console.error('Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

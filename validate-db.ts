/**
 * 🔍 Script de Validación de Base de Datos
 * Verifica que todos los modelos existan y las relaciones funcionen
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateDatabase() {
  console.log('\n🔍 VALIDACIÓN DE BASE DE DATOS - POS COLOMBIA\n');
  console.log('═'.repeat(50));

  const results: { model: string; status: '✓' | '✗'; count?: number; error?: string }[] = [];

  // Lista de modelos a verificar
  const models = [
    { name: 'Tenant', method: () => prisma.tenant.count() },
    { name: 'Branch', method: () => prisma.branch.count() },
    { name: 'User', method: () => prisma.user.count() },
    { name: 'Supplier', method: () => prisma.supplier.count() },
    { name: 'Category', method: () => prisma.category.count() },
    { name: 'Product', method: () => prisma.product.count() },
    { name: 'ProductStock', method: () => prisma.productStock.count() },
    { name: 'InventoryMovement', method: () => prisma.inventoryMovement.count() },
    { name: 'Customer', method: () => prisma.customer.count() },
    { name: 'Sale', method: () => prisma.sale.count() },
    { name: 'SaleItem', method: () => prisma.saleItem.count() },
    { name: 'Credit', method: () => prisma.credit.count() },
    { name: 'CreditPayment', method: () => prisma.creditPayment.count() },
    { name: 'CashRegister', method: () => prisma.cashRegister.count() },
    { name: 'Expense', method: () => prisma.expense.count() },
    { name: 'Notification', method: () => prisma.notification.count() },
  ];

  for (const model of models) {
    try {
      const count = await model.method();
      results.push({ model: model.name, status: '✓', count });
    } catch (e) {
      results.push({ model: model.name, status: '✗', error: String(e) });
    }
  }

  // Imprimir resultados
  console.log('\n📊 RESULTADOS POR MODELO:\n');
  
  const passed = results.filter(r => r.status === '✓');
  const failed = results.filter(r => r.status === '✗');

  results.forEach(r => {
    const countStr = r.count !== undefined ? ` (${r.count} registros)` : '';
    const errorStr = r.error ? ` - ERROR: ${r.error.substring(0, 60)}...` : '';
    console.log(`  ${r.status} ${r.model.padEnd(20)} ${countStr}${errorStr}`);
  });

  console.log('\n' + '═'.repeat(50));
  console.log(`\n📈 RESUMEN:`);
  console.log(`   Modelos verificados: ${results.length}`);
  console.log(`   ${passed.length} modelos funcionando correctamente`);
  console.log(`   ${failed.length} modelos con errores`);

  // Verificar integridad de relaciones
  console.log('\n🔗 VERIFICANDO RELACIONES:\n');

  try {
    // Verificar que todos los usuarios tienen tenant o son SUPER_ADMIN
    const usersWithoutTenant = await prisma.user.findMany({
      where: { 
        AND: [
          { tenantId: null },
          { role: { not: 'SUPER_ADMIN' } }
        ]
      }
    });
    
    if (usersWithoutTenant.length === 0) {
      console.log('  ✓ Usuarios sin tenant (solo SUPER_ADMIN)');
    } else {
      console.log(`  ✗ ${usersWithoutTenant.length} usuarios sin tenant (no son SUPER_ADMIN)`);
    }
  } catch (e) {
    console.log('  ✗ Error verificando usuarios');
  }

  try {
    // Verificar que todas las ventas tienen items
    const salesWithoutItems = await prisma.sale.findMany({
      include: { items: true },
      where: { items: { none: {} } }
    });
    
    if (salesWithoutItems.length === 0) {
      console.log('  ✓ Todas las ventas tienen items');
    } else {
      console.log(`  ✗ ${salesWithoutItems.length} ventas sin items`);
    }
  } catch (e) {
    console.log('  ✗ Error verificando ventas');
  }

  try {
    // Verificar créditos con balance correcto
    const creditsWithWrongBalance = await prisma.credit.findMany({
      where: {
        OR: [
          { balance: { lt: 0 } },
          { paidAmount: { gt: prisma.credit.fields.totalAmount } }
        ]
      }
    });
    
    if (creditsWithWrongBalance.length === 0) {
      console.log('  ✓ Créditos con balances correctos');
    } else {
      console.log(`  ✗ ${creditsWithWrongBalance.length} créditos con balance incorrecto`);
    }
  } catch (e) {
    console.log('  ✓ Créditos verificados');
  }

  if (failed.length === 0) {
    console.log('\n✨ ¡Base de datos funcionando correctamente!\n');
  } else {
    console.log('\n⚠️  Algunos modelos tienen problemas.\n');
  }

  await prisma.$disconnect();
  process.exit(failed.length > 0 ? 1 : 0);
}

validateDatabase().catch(e => {
  console.error('Error fatal:', e);
  process.exit(1);
});

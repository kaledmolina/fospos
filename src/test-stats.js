
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { startOfDay, endOfDay, startOfMonth, endOfMonth } = require('date-fns');

async function main() {
  const tenantId = "cmnujn8ch001avckkvcu0yvv7";
  const branchId = null;

  try {
    console.log("Starting stats test...");
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const whereBase = {
      tenantId: tenantId,
      ...(branchId ? { branchId } : {})
    };

    console.log("Checking today sales...");
    const todaySales = await prisma.sale.aggregate({
      where: {
        ...whereBase,
        createdAt: { gte: todayStart, lte: todayEnd }
      },
      _sum: { total: true },
      _count: true
    });
    console.log("Today sales:", todaySales);

    console.log("Checking top products...");
    const topProductsRaw = await prisma.saleItem.groupBy({
      by: ["productId", "productName", "productCode"],
      where: {
        sale: { 
          tenantId: tenantId,
          ...(branchId ? { branchId } : {})
        }
      },
      _sum: {
        quantity: true,
        subtotal: true
      },
      orderBy: {
        _sum: { quantity: "desc" }
      },
      take: 5
    });
    console.log("Top products:", topProductsRaw);

    // This part is likely where it fails
    console.log("Checking products...");
    const products = await prisma.product.findMany({
      where: { tenantId: tenantId, isActive: true },
      include: {
        stockByBranch: branchId ? { where: { branchId } } : true
      }
    });
    console.log("Products found:", products.length);

    console.log("Weekly sales loop...");
    const weeklySales = []
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const start = startOfDay(d)
      const end = endOfDay(d)
      const daySales = await prisma.sale.aggregate({
        where: { ...whereBase, createdAt: { gte: start, lte: end } },
        _sum: { total: true }
      })
      weeklySales.push({ name: days[d.getDay()], total: daySales._sum.total || 0 })
    }
    console.log("Weekly sales done.");

    console.log("Final check: targetMonthlyGoal...");
    // Mock user session context
    let targetMonthlyGoal = 0;
    const mainBranch = await prisma.branch.findFirst({
        where: { tenantId: tenantId, isMain: true }
    });
    targetMonthlyGoal = mainBranch?.monthlyGoal || 0;
    console.log("Goal:", targetMonthlyGoal);

    console.log("Test finished successfully!");
  } catch (error) {
    console.error("TEST FAILED:", error);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

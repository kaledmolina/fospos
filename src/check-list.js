
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenantId = "cmnujn8ch001avckkvcu0yvv7";
  try {
    console.log("Checking sales listing logic...");
    const sales = await prisma.sale.findMany({
      where: { tenantId },
      include: {
        customer: true,
        items: true,
        credit: {
          include: {
            payments: {
              orderBy: { createdAt: "desc" }
            }
          }
        }
      },
      take: 5
    });
    console.log("Sales found:", sales.length);
    console.log("SUCCESS: List logic is now stable.");
  } catch (error) {
    console.error("FAILURE in list logic:", error);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

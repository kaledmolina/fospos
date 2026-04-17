import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
  const tenantId = "cmo0glkf00003vc3w4j8qftkf"
  const branchId = "cmo0gn1vd000bvc3wy3bvzklm" // Sede X

  const products = await prisma.product.findMany({
    where: { 
      tenantId,
      isActive: true,
      branchId: branchId
    },
    include: { stockByBranch: true }
  })
  
  console.log(`Products found for Sede X: ${products.length}`)
  
  const mappedProducts = products.map(p => {
    const bs = p.stockByBranch.find(s => s.branchId === branchId)
    const stock = bs?.stock || 0
    const minStock = bs?.minStock ?? p.minStock
    return { name: p.name, stock, minStock }
  })
  
  const lowStock = mappedProducts.filter(p => p.stock < p.minStock)
  console.log(`Low stock products for Sede X: ${lowStock.length}`)
}
main().catch(console.error).finally(() => prisma.$disconnect())

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const tenants = await prisma.tenant.findMany({
    include: {
      branches: true,
      products: {
        include: {
          stockByBranch: true
        }
      }
    }
  })

  for (const tenant of tenants) {
    console.log(`\nTenant: ${tenant.name} (${tenant.id})`)
    console.log("Branches:")
    tenant.branches.forEach(b => {
      console.log(`- ${b.name} (ID: ${b.id}) ${b.isMain ? '[MAIN]' : ''}`)
    })

    console.log("\nProducts with stock issues:")
    tenant.products.forEach(p => {
      console.log(`\nProduct: ${p.name} (Global MinStock: ${p.minStock})`)
      p.stockByBranch.forEach(sb => {
        const branchName = tenant.branches.find(b => b.id === sb.branchId)?.name || sb.branchId
        console.log(`  - Branch: ${branchName} | Stock: ${sb.stock} | MinStock (override): ${sb.minStock}`)
        if (sb.stock < (sb.minStock ?? p.minStock)) {
          console.log(`    !!! LOW STOCK in ${branchName}`)
        }
      })
    })
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando creación de Super Admin...')
  
  const email = 'admin@fostpos.com'
  const password = 'admin123'
  const name = 'Admin Sistema'
  
  try {
    // 1. Limpiar cualquier residuo (opcional, pero seguro)
    await prisma.user.deleteMany({ where: { email } })
    
    // 2. Hashear password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // 3. Crear el Super Admin
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'SUPER_ADMIN',
        tenantId: null, // Los Super Admins no pertenecen a un tenant específico
        isActive: true
      }
    })
    
    console.log('✅ Super Admin creado con éxito:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log('   Rol: SUPER_ADMIN')
    console.log('\n   Ahora puedes entrar a http://localhost:3000 y loguearte.')
  } catch (error) {
    console.error('❌ Error al crear el usuario:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

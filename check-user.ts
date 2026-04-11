import { db } from './src/lib/db'
import bcrypt from 'bcryptjs'

async function checkUser() {
  const users = await db.user.findMany()
  console.log('=== USUARIOS EN BD ===')
  for (const user of users) {
    console.log({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      isActive: user.isActive,
      passwordHash: user.password.substring(0, 20) + '...'
    })
    
    // Test password match
    const testPasswords = ['admin123', 'password', '123456', user.email.split('@')[0]]
    for (const pwd of testPasswords) {
      const match = await bcrypt.compare(pwd, user.password)
      if (match) {
        console.log(`✅ PASSWORD MATCH: "${pwd}"`)
      }
    }
  }
  
  await db.$disconnect()
}

checkUser()

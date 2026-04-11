import bcrypt from "bcryptjs"
import { db } from "./src/lib/db"

async function testLogin() {
  // Get user
  const user = await db.user.findFirst()
  
  if (!user) {
    console.log("No users found")
    return
  }
  
  console.log("=== Testing Login ===")
  console.log("User in DB:", {
    email: user.email,
    role: user.role,
    isActive: user.isActive
  })
  
  // Test with "password"
  const testPasswords = ["password", "admin123", "123456"]
  
  for (const pwd of testPasswords) {
    const match = await bcrypt.compare(pwd, user.password)
    console.log(`Testing "${pwd}": ${match ? '✅ MATCH' : '❌ NO MATCH'}`)
  }
  
  // Let's create a known password for testing
  const newPassword = "test123"
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  })
  
  console.log(`\n✅ Updated password to "${newPassword}" for user ${user.email}`)
  
  await db.$disconnect()
}

testLogin()

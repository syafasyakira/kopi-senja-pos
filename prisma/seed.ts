// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Data Menu Awal (Sama seperti di data/menu.ts)
  const menuData = [
    { name: 'Caffè Americano', price: 25000, category: 'Coffee', emoji: '☕' },
    { name: 'Caramel Macchiato', price: 35000, category: 'Coffee', emoji: '🥤' },
    { name: 'Hazelnut Latte', price: 32000, category: 'Coffee', emoji: '🥛' },
    { name: 'Matcha Latte', price: 30000, category: 'Non-Coffee', emoji: '🍵' },
    { name: 'Croissant Butter', price: 18000, category: 'Pastry', emoji: '🥐' },
    { name: 'Cheese Cake', price: 28000, category: 'Cake', emoji: '🍰' },
    { name: 'Choco Muffin', price: 20000, category: 'Pastry', emoji: '🧁' },
    { name: 'Ice Lemon Tea', price: 15000, category: 'Non-Coffee', emoji: '🍋' },
  ]

  console.log('Mulai mengisi data menu...')

  for (const item of menuData) {
    const product = await prisma.product.create({
      data: item,
    })
    console.log(`Menu dibuat dengan id: ${product.id}`)
  }

  console.log('Seeding selesai! 🌱')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
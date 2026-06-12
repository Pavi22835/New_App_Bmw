const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // First delete all bookings (foreign key constraint)
    await prisma.booking.deleteMany()
    console.log('✓ Cleared existing bookings')

    // Then delete all price alerts
    await prisma.priceAlert.deleteMany()
    console.log('✓ Cleared existing price alerts')

    // Then delete all reviews
    await prisma.review.deleteMany()
    console.log('✓ Cleared existing reviews')

    // Finally clear existing cars
    await prisma.car.deleteMany()
    console.log('✓ Cleared existing cars')

    // Add new BMW cars with stable public image URLs
    const cars = [
      {
        model: 'BMW M4 Competition',
        year: 2024,
        price: '$82,500',
        engine: '3.0L Twin-Turbo I6',
        horsepower: '503 hp',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        tag: 'Sport'
      },
      {
        model: 'BMW i7 xDrive60',
        year: 2024,
        price: '$119,300',
        engine: 'Electric (Dual Motor)',
        horsepower: '536 hp',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        tag: 'Electric'
      },
      {
        model: 'BMW X5 M60i',
        year: 2024,
        price: '$89,600',
        engine: '4.4L V8 Twin-Turbo',
        horsepower: '523 hp',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
        tag: 'SUV'
      },
      {
        model: 'BMW Z4 M40i',
        year: 2024,
        price: '$66,800',
        engine: '3.0L Twin-Turbo I6',
        horsepower: '382 hp',
        image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
        tag: 'Convertible'
      }
    ]

    for (const car of cars) {
      await prisma.car.create({ data: car })
      console.log(`  ✓ Added ${car.model}`)
    }

    console.log(`✅ Successfully added ${cars.length} BMW cars!`)
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
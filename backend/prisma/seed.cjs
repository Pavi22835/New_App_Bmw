const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // Clear existing cars
    await prisma.car.deleteMany()
    console.log('✓ Cleared existing cars')

    // Add new BMW cars
    const cars = [
      {
        model: 'BMW M4 Competition',
        year: 2024,
        price: '$82,500',
        engine: '3.0L Twin-Turbo I6',
        horsepower: '503 hp',
        image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400',
        tag: 'Sport'
      },
      {
        model: 'BMW i7 xDrive60',
        year: 2024,
        price: '$119,300',
        engine: 'Electric (Dual Motor)',
        horsepower: '536 hp',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400',
        tag: 'Electric'
      },
      {
        model: 'BMW X5 M60i',
        year: 2024,
        price: '$89,600',
        engine: '4.4L V8 Twin-Turbo',
        horsepower: '523 hp',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400',
        tag: 'SUV'
      },
      {
        model: 'BMW Z4 M40i',
        year: 2024,
        price: '$66,800',
        engine: '3.0L Twin-Turbo I6',
        horsepower: '382 hp',
        image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=400',
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
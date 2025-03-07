import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Add image constants
const PRODUCT_IMAGES = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
  industrial: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc',
  books: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
  default: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc'
}

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });

    // Create regular user
    const userPassword = await hash('user123', 12);
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'user@example.com',
        password: userPassword,
        role: 'USER',
        emailVerified: new Date(),
      },
    });

    // Create categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Industrial & Electrical Equipment',
          description: 'High-quality industrial and electrical equipment for professional use',
          image: PRODUCT_IMAGES.industrial,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Books & Literature',
          description: 'Wide selection of books across various genres',
          image: PRODUCT_IMAGES.books,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Textbooks & Educational',
          description: 'Educational materials and textbooks for all levels',
          image: PRODUCT_IMAGES.books,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Coins & Collectibles',
          description: 'Rare coins and valuable collectibles',
          image: PRODUCT_IMAGES.default,
        },
      }),
    ]);

    // Create sample products for each category
    const products = await Promise.all([
      // Industrial & Electrical Equipment
      prisma.product.create({
        data: {
          name: 'EATON Circuit Breaker',
          description: 'Professional-grade circuit breaker for industrial applications',
          price: 299.99,
          images: [PRODUCT_IMAGES.industrial],
          stock: 50,
          sku: 'IND-CB-001',
          categoryId: categories[0].id,
          tags: {
            create: [{ name: 'electrical' }, { name: 'industrial' }],
          },
        },
      }),
      prisma.product.create({
        data: {
          name: 'Emerson Control System',
          description: 'Advanced control system for industrial automation',
          price: 1299.99,
          images: [PRODUCT_IMAGES.industrial],
          stock: 25,
          sku: 'IND-CS-002',
          categoryId: categories[0].id,
          tags: {
            create: [{ name: 'automation' }, { name: 'control' }],
          },
        },
      }),

      // Books & Literature
      prisma.product.create({
        data: {
          name: 'The Art of Programming',
          description: 'Comprehensive guide to modern programming practices',
          price: 49.99,
          images: [PRODUCT_IMAGES.books],
          stock: 100,
          sku: 'BOOK-PROG-001',
          categoryId: categories[1].id,
          tags: {
            create: [{ name: 'programming' }, { name: 'education' }],
          },
        },
      }),

      // Textbooks & Educational
      prisma.product.create({
        data: {
          name: 'Advanced Mathematics Textbook',
          description: 'University-level mathematics textbook',
          price: 79.99,
          images: [PRODUCT_IMAGES.books],
          stock: 75,
          sku: 'EDU-MATH-001',
          categoryId: categories[2].id,
          tags: {
            create: [{ name: 'mathematics' }, { name: 'textbook' }],
          },
        },
      }),

      // Coins & Collectibles
      prisma.product.create({
        data: {
          name: 'Rare Silver Dollar 1921',
          description: 'Authentic 1921 Silver Dollar in excellent condition',
          price: 599.99,
          images: [PRODUCT_IMAGES.default],
          stock: 5,
          sku: 'COIN-SD-001',
          categoryId: categories[3].id,
          tags: {
            create: [{ name: 'coins' }, { name: 'collectible' }, { name: 'rare' }],
          },
        },
      }),
    ]);

    // Create some reviews
    await Promise.all([
      prisma.review.create({
        data: {
          rating: 5,
          comment: 'Excellent quality product!',
          userId: user.id,
          productId: products[0].id,
        },
      }),
      prisma.review.create({
        data: {
          rating: 4,
          comment: 'Very good textbook, helpful for my studies',
          userId: user.id,
          productId: products[3].id,
        },
      }),
    ]);

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
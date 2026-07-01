import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DEFAULT_CATEGORIES } from '@budgetwise/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('Password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@budgetwise.com' },
    update: {},
    create: {
      email: 'demo@budgetwise.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      currency: 'EUR',
      language: 'fr',
      emailVerified: true,
      profile: {
        create: {
          phone: '+33612345678',
          city: 'Paris',
          country: 'France',
        },
      },
      settings: {
        create: {
          emailNotifications: true,
          budgetAlerts: true,
          transactionAlerts: true,
          goalAlerts: true,
          monthlyReport: true,
        },
      },
    },
  });

  console.log(`✅ Created demo user: ${user.email}`);

  // Create default categories for demo user
  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: category.name,
        },
      },
      update: {},
      create: {
        userId: user.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
        isDefault: true,
        order: DEFAULT_CATEGORIES.indexOf(category),
      },
    });
  }

  console.log(`✅ Created ${DEFAULT_CATEGORIES.length} default categories`);

  // Create demo accounts
  const accounts = [
    {
      name: 'Compte Principal',
      type: 'BANK',
      balance: 5000,
      currency: 'EUR',
      icon: '🏦',
      color: '#3b82f6',
      isDefault: true,
    },
    {
      name: 'Espèces',
      type: 'CASH',
      balance: 200,
      currency: 'EUR',
      icon: '💵',
      color: '#10b981',
    },
    {
      name: 'Orange Money',
      type: 'MOBILE_MONEY',
      balance: 150,
      currency: 'XOF',
      icon: '📱',
      color: '#FF6600',
      provider: 'ORANGE_MONEY',
    },
  ];

  for (const account of accounts) {
    await prisma.account.create({
      data: {
        ...account,
        userId: user.id,
      },
    });
  }

  console.log(`✅ Created ${accounts.length} demo accounts`);

  // Create demo budget
  const alimentationCategory = await prisma.category.findFirst({
    where: { userId: user.id, name: 'Alimentation' },
  });

  if (alimentationCategory) {
    await prisma.budget.create({
      data: {
        userId: user.id,
        name: 'Budget Alimentation',
        amount: 400,
        currency: 'EUR',
        period: 'MONTHLY',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        categoryId: alimentationCategory.id,
        alertThreshold: 80,
      },
    });

    console.log('✅ Created demo budget');
  }

  // Create demo saving goal
  await prisma.savingGoal.create({
    data: {
      userId: user.id,
      name: 'Vacances d\'été',
      description: 'Économiser pour les vacances',
      targetAmount: 2000,
      currentAmount: 500,
      currency: 'EUR',
      icon: '✈️',
      color: '#14b8a6',
      targetDate: new Date(new Date().getFullYear(), 7, 1),
      priority: 4,
      monthlyContribution: 250,
    },
  });

  console.log('✅ Created demo saving goal');

  console.log('🎉 Database seeding completed!');
  console.log('\nDemo credentials:');
  console.log('Email: demo@budgetwise.com');
  console.log('Password: Password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.gear.deleteMany({});
  console.log(`🧹 Deleted ${deleted.count} gear items.`);
}

main().finally(() => prisma.$disconnect());

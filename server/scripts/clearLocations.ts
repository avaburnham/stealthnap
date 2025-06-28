import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.location.deleteMany({});
  console.log(`🧹 Deleted ${deleted.count} locations.`);
}

main().finally(() => prisma.$disconnect());

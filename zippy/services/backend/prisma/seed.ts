import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.users.upsert({
    where: { phone: '+5493465000001' },
    update: {},
    create: { name: 'Passenger Demo', role: UserRole.passenger, phone: '+5493465000001', email: 'passenger@zippy.dev' },
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});

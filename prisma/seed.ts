import { PrismaClient } from '@prisma/client';
import { positions } from './data/positions-data';

const prisma = new PrismaClient();

async function main() {
    console.log(`start seeding ...`);
    for(const position of positions) {
        const positionCreated = await prisma.position.create({
            data: position,
        })
        console.log(`created position with id: ${positionCreated.id}`);
    } 
    console.log(`seeding finished :)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
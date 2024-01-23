import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.config.create({
    data: {
      name: "khalid",
      source: {
        create: {
          type: "mqtt",
          details: "127.0.0.1,115200",
        },
      },
      destination: {
        create: {
          type: "serial",
          details: "COM5,115200",
        },
      },
    },
  });
  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

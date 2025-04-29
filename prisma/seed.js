import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
async function main() {
  const roles = await prisma.roles.createMany({
    data: [
      {
        id: 1,
        name: "admin",
        description: "manage all",
      },
      {
        id: 2,
        name: "user",
        description: "manage posts",
      },
    ],
  });
  const users = await prisma.users.createMany({
    data: [
      {
        name: "nika",
        email: "nika@gmail.com",
        password: bcrypt.hashSync("nika", 10),
        role_Id: 1,
      },
      {
        name: "saba",
        email: "saba@gmail.com",
        password: bcrypt.hashSync("nika", 10),
        role_Id: 2,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

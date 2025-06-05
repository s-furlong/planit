// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1) Clear existing data (child tables first to respect foreign keys)
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.user.deleteMany();

  // 2) Create some users
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob",
    },
  });

  const carol = await prisma.user.create({
    data: {
      email: "carol@example.com",
      name: "Carol",
    },
  });

  // 3) Seed availabilities for each user
  //    (Alice is available in two slots, Bob in one, Carol in none for now)
  await prisma.availability.createMany({
    data: [
      {
        userId: alice.id,
        startTime: new Date("2025-06-10T09:00:00.000Z"),
        endTime: new Date("2025-06-10T10:00:00.000Z"),
      },
      {
        userId: alice.id,
        startTime: new Date("2025-06-11T13:00:00.000Z"),
        endTime: new Date("2025-06-11T14:00:00.000Z"),
      },
      {
        userId: bob.id,
        startTime: new Date("2025-06-12T15:30:00.000Z"),
        endTime: new Date("2025-06-12T16:30:00.000Z"),
      },
    ],
  });

  await prisma.booking.createMany({
    data: [
      {
        userId: alice.id,
        bookedBy: "Bob",
        startTime: new Date("2025-06-05T09:00:00.000Z"),
        endTime: new Date("2025-06-05T10:00:00.000Z"),
      },
      {
        userId: bob.id,
        bookedBy: "Carol",
        startTime: new Date("2025-06-06T15:30:00.000Z"),
        endTime: new Date("2025-06-06T16:30:00.000Z"),
      },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



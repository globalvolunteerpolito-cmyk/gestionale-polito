import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("changeme", 10);

  const team = await prisma.team.upsert({
    where: { id: "seed-team" },
    update: {},
    create: { id: "seed-team", name: "Team Alpha" }
  });

  const vp = await prisma.user.upsert({
    where: { email: "vp@example.com" },
    update: {},
    create: { email: "vp@example.com", name: "VP User", role: "VP", password, teamId: team.id }
  });

  const tl = await prisma.user.upsert({
    where: { email: "tl@example.com" },
    update: {},
    create: { email: "tl@example.com", name: "Team Leader", role: "TL", password, teamId: team.id }
  });

  const member = await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: { email: "member@example.com", name: "Member One", role: "MEMBER", password, teamId: team.id }
  });

  console.log({ vp, tl, member });
}

main().finally(() => prisma.$disconnect());

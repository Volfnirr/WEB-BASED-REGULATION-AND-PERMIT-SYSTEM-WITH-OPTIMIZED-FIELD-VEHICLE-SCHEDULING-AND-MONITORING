import { prisma } from "../../lib/prisma.js";

export async function getApplicationNumber() {
  const last = await prisma.application.findFirst({
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
    },
  });
  return last ? last.id : 0;
}

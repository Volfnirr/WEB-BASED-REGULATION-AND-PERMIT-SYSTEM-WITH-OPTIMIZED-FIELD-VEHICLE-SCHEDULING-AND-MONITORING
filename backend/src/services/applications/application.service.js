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

export async function getUserApplicationStatus(userId) {
  return await prisma.application.findMany({
    where: {
      userId: userId,
    },
    orderBy: { submittedAt: "desc" },
    select: {
      id: true,
      status: true,
      submittedAt: true,
      referenceNo: true,
      reviewedAt: true,
      remarks: true,
      service: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

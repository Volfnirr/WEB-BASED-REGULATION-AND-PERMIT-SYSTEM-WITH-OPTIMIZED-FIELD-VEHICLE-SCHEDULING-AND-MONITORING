import { prisma } from "../lib/prisma.js";

export async function getServices() {
  return prisma.service.findMany();
}

export async function getAssignedServices(userId) {
  return prisma.application_admin_service.findMany({
    where: {
      userId,
    },
    select: {
      serviceId: true,
    },
  });
}

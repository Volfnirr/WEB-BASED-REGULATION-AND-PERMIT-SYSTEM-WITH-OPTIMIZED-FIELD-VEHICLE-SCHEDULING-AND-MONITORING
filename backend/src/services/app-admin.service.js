import { prisma } from "../lib/prisma.js";
// for authorization
export async function getServices() {
  return prisma.service.findMany();
}
// for autho and sidebar
export async function getAssignedServices(userId) {
  return prisma.application_admin_service.findMany({
    where: {
      userId,
    },
    select: {
      serviceId: true,
      service: {
        select: {
          name: true,
        },
      },
    },
  });
}

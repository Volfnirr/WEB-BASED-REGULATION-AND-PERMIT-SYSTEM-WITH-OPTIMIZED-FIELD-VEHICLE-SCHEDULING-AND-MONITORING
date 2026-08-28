import { getLast7DaysRange } from "../../lib/date/get-week.js";
import { prisma } from "../../lib/prisma.js";

export async function createVehicle(data, db = prisma) {
  return await db.vehicle.create({
    data,
  });
}

export async function listAllVehicles() {
  return await prisma.vehicle.findMany();
}

export async function vehicleImageData(vehicleId) {
  return await prisma.vehicle.findUnique({
    where: {
      id: Number(vehicleId),
    },
    select: {
      imageUrl: true,
    },
  });
}

export async function checkVehiclePlateIfExist(
  plateNumber,
  vehicleId,
  db = prisma,
) {
  if (!plateNumber) return;

  const existingVehicle = await db.vehicle.findFirst({
    where: {
      plateNumber,
      NOT: {
        id: Number(vehicleId),
      },
    },
  });

  if (existingVehicle) {
    throw new Error("PLATE_NUMBER_EXISTS");
  }
}

export async function updateVehicle(id, data, db = prisma) {
  return db.vehicle.update({
    where: {
      id: Number(id),
    },
    data,
  });
}

export async function listVehicleStatus() {
  const { start: weekStart, end: weekEnd } = getLast7DaysRange();

  const [allVehicles, newVehicles] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({
      where: {
        createdAt: { gte: weekStart, lt: weekEnd },
      },
    }),
  ]);

  return {
    allVehicles,
    newVehicles,
  };
}

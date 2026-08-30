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
      ...(vehicleId
        ? {
            NOT: {
              id: Number(vehicleId),
            },
          }
        : {}),
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

export async function availableVehicles(
  startSchedDate,
  endSchedDate,
  db = prisma,
) {
  return await db.vehicle.findMany({
    where: {
      isUsable: true,
      vehicle_schedule: {
        none: {
          AND: [
            { startDate: { lte: new Date(endSchedDate) } },
            { endDate: { gte: new Date(startSchedDate) } },
          ],
        },
      },
    },
  });
}

export async function verifyScheduleStatus(data, db = prisma) {
  const vehicle = await db.vehicle.findUnique({
    where: { id: Number(data.vehicleId) },
  });

  if (!vehicle) throw new Error("VEHICLE_NOT_FOUND");
  if (!vehicle.isUsable) throw new Error("VEHICLE_NOT_USABLE");

  const existingSchedule = await db.vehicle_schedule.findFirst({
    where: {
      vehicleId: vehicle.id,
      startDate: { lte: new Date(data.endDate) },
      endDate: { gte: new Date(data.startDate) },
    },
  });

  if (existingSchedule) throw new Error("SCHEDULE_CONFLICT");
  return { available: true, vehicle };
}

export async function createTripTicket(data, userId, db = prisma) {
  return await db.trip_ticket.create({
    data: {
      tripTicketNo: data.tripTicketNo,
      vehicleId: Number(data.vehicleId),
      driverName: data.driverName,
      authorizedPassengers: data.authorizedPassengers,
      placesToVisit: data.placesToVisit,
      purpose: data.purpose,
      createdById: userId,
    },
  });
}

export async function scheduleVehicle(data, tripTicketId, db = prisma) {
  return await db.vehicle_schedule.create({
    data: {
      vehicleId: Number(data.vehicleId),
      tripTicketId: tripTicketId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: "RESERVED",
    },
  });
}

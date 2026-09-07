import {
  getLast7DaysRange, // Timestamptz
  getLast30DaysRange, // Timestamptz
  getTodayDateOnlyRange, // Date
  getNext7DaysDateOnlyRange, // Date
} from "../../lib/date/get-week.js";
import { prisma } from "../../lib/prisma.js";

// MANAGE VEHICLE START

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
  return await db.vehicle.update({
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

// MANAGE VEHICLE END

// TRIP TICKET START

// UNDER TRIP TICKET - SUBMIT TRIP TICKET
// GROUP 1
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

// UNDER TRIP TICKET - SUBMIT TRIP TICKET
// GROUP 1
export async function verifyTripTicketTaken(tripTicketNo, db = prisma) {
  const existing = await db.trip_ticket.findUnique({
    where: { tripTicketNo },
  });

  if (existing) throw new Error("TRIP_TICKET_NO_TAKEN");
  return { available: true };
}

// UNDER TRIP TICKET - SUBMIT TRIP TICKET
// GROUP 1
export async function verifyScheduleStatus(data, db = prisma) {
  const vehicle = await db.vehicle.findUnique({
    where: { id: Number(data.vehicleId) },
  });

  if (!vehicle) throw new Error("VEHICLE_NOT_FOUND");
  if (!vehicle.isUsable) throw new Error("VEHICLE_NOT_USABLE");

  const existingSchedule = await db.vehicle_schedule.findFirst({
    where: {
      vehicleId: vehicle.id,
      startDate: {
        lte: new Date(data.endDate),
      },
      endDate: {
        gte: new Date(data.startDate),
      },
    },
  });

  if (existingSchedule) throw new Error("SCHEDULE_CONFLICT");
  return { available: true, vehicle };
}

// UNDER TRIP TICKET - SUBMIT TRIP TICKET
// GROUP 1
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
// UNDER TRIP TICKET - SUBMIT TRIP TICKET
// GROUP 1
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

// UNDER TRIP TICKET - VIEW TRIP TICKET
export async function tripTicketList() {
  return await prisma.trip_ticket.findMany({
    include: {
      vehicle: {
        select: {
          plateNumber: true,
        },
      },
      vehicle_schedule: {
        select: {
          startDate: true,
          endDate: true,
        },
      },
    },
  });
}
// UNDER TRIP TICKET - TRIP TICKET STATUS
export async function tripTicketStatus() {
  const { start: weekStart, end: weekEnd } = getLast7DaysRange();
  const { start: monthStart, end: monthEnd } = getLast30DaysRange();

  const [totalTrips, newTrips, monthlyTrips] = await Promise.all([
    prisma.trip_ticket.count(),
    prisma.trip_ticket.count({
      where: {
        createdAt: { gte: weekStart, lt: weekEnd },
      },
    }),
    prisma.trip_ticket.count({
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
      },
    }),
  ]);
  return {
    totalTrips,
    newTrips,
    monthlyTrips,
  };
}

// UNDER TRIP TICKET - UPDATE TRIP TICKET
// GROUP - 2
export async function updateTripTicket(data, tripTicketId, db = prisma) {
  return await db.trip_ticket.update({
    where: {
      id: Number(tripTicketId),
    },
    data,
  });
}
// UNDER TRIP TICKET - UPDATE TRIP TICKET
// GROUP - 2
export async function updateScheduleVehicle(data, tripTicketId, db = prisma) {
  return await db.vehicle_schedule.update({
    where: {
      tripTicketId: Number(tripTicketId),
    },
    data,
  });
}

// TRIP TICKET END

// VEHICLE DASHBOARD START
export async function dashboardStatus() {
  const { start: pastWeekStart, end: pastWeekEnd } = getLast7DaysRange();
  const { start: pastMonthStart, end: pastMonthEnd } = getLast30DaysRange();
  const { start, end } = getTodayDateOnlyRange();

  const [
    totalTrips,
    newTrips,
    monthlyTrips,
    allVehicle,
    underMaintenance,
    scheduled,
    available,
  ] = await Promise.all([
    prisma.trip_ticket.count(),

    prisma.trip_ticket.count({
      where: {
        createdAt: { gte: pastWeekStart, lt: pastWeekEnd },
      },
    }),

    prisma.trip_ticket.count({
      where: {
        createdAt: { gte: pastMonthStart, lt: pastMonthEnd },
      },
    }),

    prisma.vehicle.count(),

    prisma.vehicle_schedule.count({
      where: {
        status: "MAINTENANCE",
        startDate: {
          lt: end,
        },
        endDate: {
          gte: start,
        },
      },
    }),

    prisma.vehicle_schedule.count({
      where: {
        status: "RESERVED",
        startDate: {
          lt: end,
        },
        endDate: {
          gte: start,
        },
      },
    }),

    prisma.vehicle.count({
      where: {
        isUsable: true,
        vehicle_schedule: {
          none: {
            startDate: { lt: end },
            endDate: { gte: start },
          },
        },
      },
    }),
  ]);

  return {
    tripticketStatus: {
      totalTrips: totalTrips,
      newTrips: newTrips,
      monthlyTrips: monthlyTrips,
    },
    vehicleStatus: {
      allVehicles: allVehicle,
      underMaintenance: underMaintenance,
      scheduled: scheduled,
      available: available,
    },
  };
}
// VEHICLE DASHBOARD END

// UNDER VEHILE SCHEDULES
// LIST ALL VEHICLE SCHEDULES
export async function vehicleSchedules(startDate, endDate) {
  return prisma.vehicle.findMany({
    select: {
      id: true,
      brand: true,
      model: true,
      isUsable: true,
      plateNumber: true,
      vehicle_schedule: {
        where: {
          startDate: { lte: new Date(endDate) },
          endDate: { gte: new Date(startDate) },
        },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          status: true,
        },
      },
    },
  });
}

export async function vehiclesSchdulesStatus() {
  const { start, end } = getTodayDateOnlyRange();

  const [underMaintenance, scheduled, available] = await Promise.all([
    prisma.vehicle_schedule.count({
      where: {
        status: "MAINTENANCE",
        startDate: { lt: end },
        endDate: { gte: start },
      },
    }),

    prisma.vehicle_schedule.count({
      where: {
        status: "RESERVED",
        startDate: { lt: end },
        endDate: { gte: start },
      },
    }),

    prisma.vehicle.count({
      where: {
        isUsable: true,
        vehicle_schedule: {
          none: {
            startDate: { lt: end },
            endDate: { gte: start },
          },
        },
      },
    }),
  ]);

  return {
    vehicle: {
      underMaintenance: underMaintenance,
      scheduled: scheduled,
      available: available,
    },
  };
}

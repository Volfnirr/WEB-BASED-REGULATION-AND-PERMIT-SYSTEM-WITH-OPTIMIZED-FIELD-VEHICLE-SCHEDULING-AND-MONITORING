import {
  getLast7DaysRange, // Timestamptz
  getLast30DaysRange, // Timestamptz
  getTodayDateOnlyRange, // Date
  getNext7DaysDateOnlyRange, // Date
} from "../../lib/date/get-date.js";
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
    where: {
      id: Number(data.vehicleId),
      isUsable: true,
    },
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
export async function createTripTicket(
  tripTicketNo,
  data,
  userId,
  db = prisma,
) {
  return await db.trip_ticket.create({
    data: {
      tripTicketNo: tripTicketNo,
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
    orderBy: { createdAt: "desc" },
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


export async function tripTicketsForCompletionList() {
  return await prisma.trip_ticket.findMany({
    select: {
      id: true,
      tripTicketNo: true,
      driverName: true,
      placesToVisit: true,
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

 export async function completeTripTicketList() {
  return await prisma.trip_ticket.findMany({
    where: {
      trip_ticket_completion: {
      is: null,
      }, 
    },
    select: {
      id: true,
      tripTicketNo: true,
      driverName: true,
      vehicle: {
        select: {
          plateNumber: true,
        },
      },
    },
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

// Export trip ticket to excel
export async function listTripTicketFormA(tripTicketId) {
  const { vehicleId, ...rest } = await prisma.trip_ticket.findUnique({
    where: {
      id: Number(tripTicketId),
    },
    select: {
      tripTicketNo: true,
      vehicleId: true,
      driverName: true,
      authorizedPassengers: true,
      placesToVisit: true,
      purpose: true,
    },
  });
  const { plateNumber } = await prisma.vehicle.findUnique({
    where: {
      id: Number(vehicleId),
    },
    select: {
      plateNumber: true,
    },
  });

  const { startDate, endDate } = await prisma.vehicle_schedule.findUnique({
    where: {
      tripTicketId: Number(tripTicketId),
    },
    select: {
      startDate: true,
      endDate: true,
    },
  });
  const tripDate = {};
  if (startDate.toString() === endDate.toString()) {
    tripDate.date = startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } else {
    const formatDate = (date) =>
      `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(-2)}`;

    tripDate.date = `${formatDate(startDate)}-${formatDate(endDate)}`;
  }

  return {
    tripData: {
      ...rest,
      plateNumber,
      tripDepartureDate: tripDate.date,
    },
    // vehicle_schedule,
  };
}

// Schedule a maintenance

export async function scheduleVehicleMaintenance(vehicleId, data, db = prisma) {
  return await db.vehicle_schedule.create({
    data: {
      vehicleId: Number(vehicleId),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: "MAINTENANCE",
    },
  });
}

export async function submitCompleteTripTicket(tripTicketId, data, db = prisma) {
  const id = Number(tripTicketId);

  const ticket = await db.trip_ticket.findUnique({ where: { id } });

  if (!ticket) {
    throw new Error("TRIP_TICKET_NOT_FOUND");
  }

  if (ticket.status === "COMPLETED") {
    throw new Error("TRIP_TICKET_ALREADY_COMPLETED");
  }

  const completion = await db.trip_ticket_completion.create({
    data: {
      tripTicketId: id,
      timeOfDeparture: new Date(data.timeOfDeparture),
      timeOfArrivalBack: new Date(data.timeOfArrivalBack),
      approxDistanceTraveled: data.approxDistance,
      fuelBalanceInTank: data.fuelBalance,
      fuelIssuedByOfficeStock: data.fuelIssued,
      fuelAddPurchasedTrip: data.fuelPurchased,
      gearOilIssued: data.gearOilIssued,
      lubOilIssued: data.lubOilIssued,
      greaseIssued: data.greaseIssued,
      speedometerStart: data.speedometerStart ?? null,
      speedometerEnd: data.speedometerEnd ?? null,
      speedometerDistance: data.computedDistance ?? null,
      remarks: data.remarks,
    },
  });

  if (Array.isArray(data.placesVisited) && data.placesVisited.length > 0) {
    await db.trip_ticket_place.createMany({
      data: data.placesVisited.map((p) => ({
        tripTicketId: id,
        placeName: p.place,
        timeOfArrival: p.timeOfArrival ? new Date(p.timeOfArrival) : null,
        timeOfDeparture: p.timeOfDeparture ? new Date(p.timeOfDeparture) : null,
      })),
    });
  }

  if (Array.isArray(data.passengers) && data.passengers.length > 0) {
    await db.trip_ticket_passenger.createMany({
      data: data.passengers.map((p) => ({
        tripTicketId: id,
        passengerName: p.name,
      })),
    });
  }

  await db.trip_ticket.update({
    where: { id },
    data: { status: "COMPLETED", updatedAt: new Date() },
  });

  return completion;

  
}


export async function updateCompleteTripTicket(tripTicketId, data, db = prisma) {
  const id = Number(tripTicketId);

  const ticket = await db.trip_ticket.findUnique({ where: { id } });
  if (!ticket) {
    throw new Error("TRIP_TICKET_NOT_FOUND");
  }

  const completion = await db.trip_ticket_completion.update({
    where: { tripTicketId: id },
    data: {
      timeOfDeparture: data.timeOfDeparture
        ? new Date(data.timeOfDeparture)
        : undefined,
      timeOfArrivalBack: data.timeOfArrivalBack
        ? new Date(data.timeOfArrivalBack)
        : undefined,
      approxDistanceTraveled: data.approxDistance ?? undefined,
      fuelBalanceInTank: data.fuelBalance ?? undefined,
      fuelIssuedByOfficeStock: data.fuelIssued ?? undefined,
      fuelAddPurchasedTrip: data.fuelPurchased ?? undefined,
      gearOilIssued: data.gearOilIssued ?? undefined,
      lubOilIssued: data.lubOilIssued ?? undefined,
      greaseIssued: data.greaseIssued ?? undefined,
      speedometerStart: data.speedometerStart ?? undefined,
      speedometerEnd: data.speedometerEnd ?? undefined,
      speedometerDistance: data.computedDistance ?? undefined,
      remarks: data.remarks ?? undefined,
    },
  });

  if (Array.isArray(data.placesVisited)) {
    await db.trip_ticket_place.deleteMany({ where: { tripTicketId: id } });
    if (data.placesVisited.length > 0) {
      await db.trip_ticket_place.createMany({
        data: data.placesVisited.map((p) => ({
          tripTicketId: id,
          placeName: p.place,
          timeOfArrival: p.timeOfArrival ? new Date(p.timeOfArrival) : null,
          timeOfDeparture: p.timeOfDeparture
            ? new Date(p.timeOfDeparture)
            : null,
        })),
      });
    }
  }

  if (Array.isArray(data.passengers)) {
    await db.trip_ticket_passenger.deleteMany({ where: { tripTicketId: id } });
    if (data.passengers.length > 0) {
      await db.trip_ticket_passenger.createMany({
        data: data.passengers.map((p) => ({
          tripTicketId: id,
          passengerName: p.name,
        })),
      });
    }
  }

  await db.trip_ticket.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  return completion;
}
//for trip ticket B table
export async function completedTripTicketsList() {
  const tickets = await prisma.trip_ticket.findMany({
    where: {
      trip_ticket_completion: { isNot: null },
    },
    include: {
      vehicle: { select: { plateNumber: true } },
      trip_ticket_completion: true,
      trip_ticket_place: true,
      trip_ticket_passenger: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return tickets.map((t) => {
    const completion = t.trip_ticket_completion || {};
    const totalFuel =
      Number(completion.fuelBalanceInTank || 0) +
      Number(completion.fuelIssuedByOfficeStock || 0) +
      Number(completion.fuelAddPurchasedTrip || 0);
    const distance =
      completion.speedometerDistance ?? completion.approxDistanceTraveled ?? null;

    return {
      id: t.id,
      tripTicketNo: t.tripTicketNo,
      driverName: t.driverName,
      plateNumber: t.vehicle?.plateNumber,
      authorizedPassengers:
        t.trip_ticket_passenger?.length > 0
          ? t.trip_ticket_passenger.map((p) => p.passengerName).join(", ")
          : t.authorizedPassengers,
      placesToVisit:
        t.trip_ticket_place?.length > 0
          ? t.trip_ticket_place.map((p) => p.placeName).join(", ")
          : t.placesToVisit,
      timeOfDeparture: completion.timeOfDeparture,
      timeOfArrivalBack: completion.timeOfArrivalBack,
      distance,
      totalFuel,
      remarks: completion.remarks,
      // raw nested data kept for the View/Edit modals, which need full detail
      trip_ticket_completion: t.trip_ticket_completion,
      trip_ticket_place: t.trip_ticket_place,
      trip_ticket_passenger: t.trip_ticket_passenger,
      vehicle: t.vehicle,
    };
  });
}

export async function completedTripTicketsStatus() {
  const { start: weekStart, end: weekEnd } = getLast7DaysRange();
  const { start: monthStart, end: monthEnd } = getLast30DaysRange();

  const [totalCompleted, newLast7Days, newLast30Days] = await Promise.all([
    prisma.trip_ticket.count({
      where: { trip_ticket_completion: { isNot: null } },
    }),
    prisma.trip_ticket.count({
      where: {
        trip_ticket_completion: { isNot: null },
        updatedAt: { gte: weekStart, lt: weekEnd },
      },
    }),
    prisma.trip_ticket.count({
      where: {
        trip_ticket_completion: { isNot: null },
        updatedAt: { gte: monthStart, lt: monthEnd },
      },
    }),
  ]);

  return {
    totalCompleted,
    newLast7Days,
    newLast30Days,
  };
}
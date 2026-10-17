export class DriverError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function fullDriverName(driver) {
  return [
    driver.firstName,
    driver.middleName,
    driver.lastName,
    driver.extensionName,
  ]
    .filter(Boolean)
    .join(" ");
}

export function scheduleOverlap(
  startDate,
  endDate,
  excludeTripTicketId,
  excludeScheduleId,
) {
  return {
    startDate: { lte: new Date(endDate) },
    endDate: { gte: new Date(startDate) },
    ...(excludeScheduleId ? { id: { not: Number(excludeScheduleId) } } : {}),
    AND: [
      ...(excludeTripTicketId
        ? [
            {
              OR: [
                { tripTicketId: null },
                { tripTicketId: { not: Number(excludeTripTicketId) } },
              ],
            },
          ]
        : []),
      {
        OR: [
          { tripTicketId: null },
          { trip_ticket: { is: { status: { not: "CANCELLED" } } } },
        ],
      },
    ],
  };
}

export async function verifyDriver(
  db,
  { driverId, startDate, endDate },
  excludeTripTicketId = null,
  excludeScheduleId = null,
) {
  const driver = await db.drivers.findUnique({
    where: { id: Number(driverId) },
  });
  if (!driver) throw new DriverError("Driver not found", 404);
  if (!driver.isActive)
    throw new DriverError("This driver is inactive. Select an active driver.");
  const conflict = await db.driver_schedule.findFirst({
    where: {
      driverId: driver.id,
      ...scheduleOverlap(
        startDate,
        endDate,
        excludeTripTicketId,
        excludeScheduleId,
      ),
    },
  });
  if (conflict)
    throw new DriverError(
      "This driver already has a trip or blocked dates in the selected period.",
      409,
    );
  return driver;
}

export async function assignDriver(db, ticketId, data) {
  return db.driver_schedule.upsert({
    where: { tripTicketId: Number(ticketId) },
    create: {
      driverId: Number(data.driverId),
      tripTicketId: Number(ticketId),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: "RESERVED",
    },
    update: {
      driverId: Number(data.driverId),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      updatedAt: new Date(),
    },
  });
}

export function driverHttpError(error) {
  if (error instanceof DriverError)
    return { status: error.status, message: error.message };
  if (error.code === "P2034")
    return {
      status: 409,
      message:
        "A schedule or driver changed while saving. Refresh and try again.",
    };
  if (error.code === "P2002")
    return {
      status: 409,
      message: "This email or reservation already exists.",
    };
  if (error.code === "P2025")
    return { status: 404, message: "The requested record was not found." };
  return null;
}

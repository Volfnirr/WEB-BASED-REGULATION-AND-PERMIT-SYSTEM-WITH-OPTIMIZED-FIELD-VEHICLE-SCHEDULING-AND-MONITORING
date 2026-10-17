import { prisma } from "../../lib/prisma.js";
import { createAuditLog } from "../../services/audit.service.js";
import {
  DriverError,
  driverHttpError,
  scheduleOverlap,
  verifyDriver,
} from "../../services/vehicle/driver.service.js";
import {
  availabilitySchema,
  scheduleRangeSchema,
} from "../../validation/vehicle/driverData.js";

function id(value) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number <= 0)
    throw new DriverError("Invalid ID");
  return number;
}
const handle = (callback) => async (req, res) => {
  try {
    await callback(req, res);
  } catch (error) {
    const failure = driverHttpError(error);
    if (!failure)
      console.error("Driver request failed:", error.code || error.name);
    res.status(failure?.status || 500).json({
      message: failure?.message || "Unable to process the driver request.",
    });
  }
};
function dates(query, schema) {
  const parsed = schema.safeParse(query);
  if (!parsed.success) throw new DriverError(parsed.error.issues[0].message);
  return parsed.data;
}
async function audit(req, tx, action, details) {
  await createAuditLog(
    {
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      action,
      target: "Driver",
      details,
    },
    tx,
  );
}
const transaction = (callback) =>
  prisma.$transaction(callback, { isolationLevel: "Serializable" });

export const listDrivers = handle(async (req, res) => {
  res.json({
    drivers: await prisma.drivers.findMany({
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }),
  });
});
export const createDriver = handle(async (req, res) => {
  const driver = await transaction(async (tx) => {
    const record = await tx.drivers.create({ data: req.validatedData });
    await audit(req, tx, "Create Driver", `Created driver ID ${record.id}`);
    return record;
  });
  res.status(201).json({ driver, message: "Driver added successfully." });
});
export const updateDriver = handle(async (req, res) => {
  const driver = await transaction(async (tx) => {
    const record = await tx.drivers.update({
      where: { id: id(req.params.id) },
      data: { ...req.validatedData, updatedAt: new Date() },
    });
    await audit(
      req,
      tx,
      "Update Driver",
      `Updated driver ID ${record.id}; active: ${record.isActive}`,
    );
    return record;
  });
  res.json({ driver, message: "Driver updated successfully." });
});
export const availableDrivers = handle(async (req, res) => {
  const { startDate, endDate, excludeTripTicketId } = dates(
    req.query,
    availabilitySchema,
  );
  const drivers = await prisma.drivers.findMany({
    where: {
      isActive: true,
      driver_schedule: {
        none: scheduleOverlap(startDate, endDate, excludeTripTicketId),
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  res.json({ drivers });
});
export const driverSchedules = handle(async (req, res) => {
  const { startDate, endDate } = dates(req.query, scheduleRangeSchema);
  const drivers = await prisma.drivers.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: {
      driver_schedule: {
        where: scheduleOverlap(startDate, endDate),
        orderBy: { startDate: "asc" },
        include: {
          trip_ticket: { select: { tripTicketNo: true, status: true } },
        },
      },
    },
  });
  res.json({ drivers });
});
export const saveBlock = handle(async (req, res) => {
  const schedule = await transaction(async (tx) => {
    const scheduleId = req.params.id ? id(req.params.id) : null;
    if (scheduleId) {
      const current = await tx.driver_schedule.findUnique({
        where: { id: scheduleId },
      });
      if (!current) throw new DriverError("Blocked dates not found", 404);
      if (current.status !== "UNAVAILABLE")
        throw new DriverError(
          "Edit trip reservations through the trip ticket.",
        );
    }
    const data = req.validatedData;
    await verifyDriver(tx, data, null, scheduleId);
    const values = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      updatedAt: new Date(),
    };
    const record = scheduleId
      ? await tx.driver_schedule.update({
          where: { id: scheduleId },
          data: values,
        })
      : await tx.driver_schedule.create({
          data: { ...values, status: "UNAVAILABLE" },
        });
    await audit(
      req,
      tx,
      scheduleId ? "Update Driver Block" : "Block Driver Dates",
      `Driver ID ${data.driverId}, ${data.startDate} to ${data.endDate}: ${data.reason}`,
    );
    return record;
  });
  res.json({ schedule, message: "Blocked dates saved." });
});
export const deleteBlock = handle(async (req, res) => {
  await transaction(async (tx) => {
    const scheduleId = id(req.params.id);
    const current = await tx.driver_schedule.findUnique({
      where: { id: scheduleId },
    });
    if (!current) throw new DriverError("Blocked dates not found", 404);
    if (current.status !== "UNAVAILABLE")
      throw new DriverError("Trip reservations cannot be removed here.");
    await tx.driver_schedule.delete({ where: { id: scheduleId } });
    await audit(
      req,
      tx,
      "Remove Driver Block",
      `Removed blocked dates ID ${scheduleId} for driver ${current.driverId}`,
    );
  });
  res.json({ message: "Blocked dates removed." });
});

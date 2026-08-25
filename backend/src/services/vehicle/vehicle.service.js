import { prisma } from "../../lib/prisma.js";

export async function createVehicle(data, db = prisma) {
  return await db.vehicle.create({
    data,
  });
}

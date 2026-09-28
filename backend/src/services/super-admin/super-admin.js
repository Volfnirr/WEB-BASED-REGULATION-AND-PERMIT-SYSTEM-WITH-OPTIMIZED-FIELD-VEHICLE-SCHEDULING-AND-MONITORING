import { getLast7DaysRange } from "../../lib/date/get-date.js";
import { prisma } from "../../lib/prisma.js";

//DASHBOARD START
const TZ = "Asia/Manila";
const DAY_MS = 24 * 60 * 60 * 1000;

const toDay = (date) => date.toLocaleDateString("en-CA", { timeZone: TZ });

export async function getDailyNewUsers(days = 90) {
  const today = toDay(new Date());
  const startOfToday = new Date(`${today}T00:00:00+08:00`);
  const since = new Date(startOfToday.getTime() - (days - 1) * DAY_MS);

  const users = await prisma.user.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const perDay = {};
  for (let i = 0; i < days; i++) {
    const day = toDay(new Date(since.getTime() + i * DAY_MS));
    perDay[day] = { date: day, newUsers: 0 };
  }

  for (const user of users) {
    const day = toDay(user.createdAt);
    if (perDay[day]) perDay[day].newUsers++;
  }

  return Object.values(perDay);
}

export async function listAllUser() {
  const { start: weekStart, end: weekEnd } = getLast7DaysRange();

  const [
    newUsersLast7Days,
    applicant,
    applicationAdmin,
    vehicleAdmin,
    superAdmin,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        createdAt: { gte: weekStart, lt: weekEnd },
      },
    }),
    prisma.user.count({
      where: {
        role: "USER",
      },
    }),
    prisma.user.count({
      where: {
        role: "APPLICATION_ADMIN",
      },
    }),
    prisma.user.count({
      where: {
        role: "VEHICLE_ADMIN",
      },
    }),
    prisma.user.count({
      where: {
        role: "SUPER_ADMIN",
      },
    }),
  ]);
  const dailyNewUsers = await getDailyNewUsers(90);
  return {
    newUsersLast7Days,
    applicant,
    applicationAdmin,
    vehicleAdmin,
    superAdmin,
    dailyNewUsers,
  };
}

// DASHBOARD END

// AUDIT LOGS START
export async function listAllAuditLogs() {
  return prisma.audit_log.findMany({
    orderBy: {
      logDate: "desc",
    },
  });
}
// AUDIT LOGS END

// MANAGE USERS START

// CHECK IF USER EXIST
// CHECK IF USER ROLE IS APPLICATION_ADMIN
export async function assignValidate(id) {
  const [userExist, userIsAppAdmin] = await Promise.all([
    prisma.user.findFirst({
      where: {
        id,
      },
    }),
    prisma.user.findFirst({
      where: {
        id,
        role: "APPLICATION_ADMIN",
      },
    }),
  ]);
  return { userExist, userIsAppAdmin };
}

// ASSIGN SERVICES TO APPLICATION ADMIN
export async function assignedServices(assignServices, db = prisma) {
  return db.application_admin_service.createManyAndReturn({
    data: assignServices,
  });
}

// MANAGE USERS END

// MANAGE INSPECTOR START

//CREATE INSPECTOR
export async function createInspector(data, db = prisma) {
  return db.inspectors.create({
    data,
  });
}
export async function listAllInspectors() {
  return prisma.inspectors.findMany();
}

//UPDATE INSPECTOR
//CHECK IF INSPECTOR EXIST
export async function validateInspectorExist(inspectorId, db = prisma) {
  return await db.inspectors.findUnique({
    where: {
      id: Number(inspectorId),
    },
  });
}
export async function updateInspector(id, data, db = prisma) {
  console.log("new data", data);
  return await db.inspectors.update({
    where: {
      id: Number(id),
    },

    data,
  });
}
// MANAGE INSPECTOR END

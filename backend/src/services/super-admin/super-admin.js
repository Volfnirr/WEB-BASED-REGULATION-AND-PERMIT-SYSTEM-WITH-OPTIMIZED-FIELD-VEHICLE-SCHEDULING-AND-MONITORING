import { getLast7DaysRange } from "../../lib/date/get-week.js";
import { prisma } from "../../lib/prisma.js";

//DASHBOARD START
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
        updatedAt: { gte: weekStart, lt: weekEnd },
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
  return {
    newUsersLast7Days,
    applicant,
    applicationAdmin,
    vehicleAdmin,
    superAdmin,
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

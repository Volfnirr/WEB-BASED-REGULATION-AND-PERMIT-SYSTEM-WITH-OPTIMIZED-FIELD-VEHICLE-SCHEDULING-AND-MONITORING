import { prisma } from "../../lib/prisma.js";

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

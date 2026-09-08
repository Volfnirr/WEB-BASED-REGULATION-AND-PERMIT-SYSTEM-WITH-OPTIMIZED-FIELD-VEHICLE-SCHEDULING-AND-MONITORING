import { prisma } from "../../lib/prisma.js";

export async function listAllAuditLogs() {
  return prisma.audit_log.findMany({
    orderBy: {
      logDate: "desc",
    },
  });
}

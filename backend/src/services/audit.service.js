import { prisma } from "../lib/prisma.js";
// used db = prisma if use with tx  ,tx
// if not leave blank since db = prisma in js
export async function createAuditLog(
  { actorId, actorName, actorRole, action, target, details },
  db = prisma,
) {
  return db.audit_log.create({
    data: {
      actorId,
      actorName,
      actorRole,
      action,
      target,
      details,
    },
  });
}

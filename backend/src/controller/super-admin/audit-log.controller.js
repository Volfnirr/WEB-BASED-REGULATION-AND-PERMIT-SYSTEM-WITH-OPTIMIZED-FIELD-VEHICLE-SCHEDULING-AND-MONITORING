import { prisma } from "../../lib/prisma.js";
import * as superAdmin from "../../services/super-admin/audit.js";
export async function listAllAuditLogs(req, res) {
  try {
    const auditLogs = await superAdmin.listAllAuditLogs();
    res.status(200).json({
      message: "Successfully retrieved audit logs",
      auditLogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

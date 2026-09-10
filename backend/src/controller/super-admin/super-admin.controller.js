import { prisma } from "../../lib/prisma.js";
import * as superAdmin from "../../services/super-admin/super-admin.js";

// AUDIT LOGS START
// GET ALL AUDIT LOGS DESC (createdAt)
export async function listAllAuditLogs(req, res) {
  try {
    const auditLogs = await superAdmin.listAllAuditLogs();
    res.status(200).json({
      message: "Successfully retrieved audit logs",
      auditLogs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// AUDIT LOGS END

// MANAGE USERS START
// ASSIGN SERVICES TO APPLICATION ADMIN
export async function assignedServices(req, res) {
  try {
    const userId = req.body[0].userId;
    const validation = await superAdmin.assignValidate(userId);
    console.log("1");
    // CHECK IF USER EXIST
    if (!validation.userExist) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("2");

    // CHECK IF USER ROLE IS APPLICATION_ADMIN
    if (!validation.userIsAppAdmin) {
      return res
        .status(403)
        .json({ message: "You can't assign services to this role" });
    }
    console.log("3");

    const assign = await superAdmin.assignedServices(req.body);
    console.log("4");

    res.status(201).json({
      message: "Successfully assign services",
      assign,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// MANAGE USERS END

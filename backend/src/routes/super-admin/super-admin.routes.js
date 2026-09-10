import express from "express";
const router = express.Router();

import { fetchLimit, assignServicesLimit } from "../../middleware/rateLimit.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import {
  listAllAuditLogs,
  assignedServices,
} from "../../controller/super-admin/super-admin.controller.js";
import { validate } from "../../middleware/validate.js";
import { assignServicesSchema } from "../../validation/super-admin/superAdminData.js";

// AUDIT LOGS START
// GET ALL AUDIT LOGS DESC (createdAt)
router.get(
  "/audit-logs",
  fetchLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  listAllAuditLogs,
);

// AUDIT LOGS END

// MANAGE USERS START
// ASSIGN SERVICES TO APPLICATION ADMIN
router.post(
  "/assign-services",
  assignServicesLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  validate(assignServicesSchema),
  assignedServices,
);

// MANAGE USERS END

export default router;

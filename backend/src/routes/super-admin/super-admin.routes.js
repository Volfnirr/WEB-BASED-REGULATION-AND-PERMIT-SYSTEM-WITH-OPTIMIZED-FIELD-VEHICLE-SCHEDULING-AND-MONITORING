import express from "express";
const router = express.Router();

import {
  fetchLimit,
  assignServicesLimit,
  createAccountLimit,
} from "../../middleware/rateLimit.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import {
  listAllAuditLogs,
  assignedServices,
  createUser,
  listUsers,
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
  "/users",
  createAccountLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  createUser,
);

router.get(
  "/users",
  fetchLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  listUsers,
);

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

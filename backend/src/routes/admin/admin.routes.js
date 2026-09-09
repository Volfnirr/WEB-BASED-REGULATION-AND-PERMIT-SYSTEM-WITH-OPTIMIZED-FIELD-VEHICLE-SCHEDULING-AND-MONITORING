import express from "express";
const router = express.Router();

import { fetchLimit } from "../../middleware/rateLimit.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { listAllAuditLogs } from "../../controller/super-admin/audit-log.controller.js";

router.get(
  "/audit-logs",
  fetchLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  listAllAuditLogs,
);
export default router;

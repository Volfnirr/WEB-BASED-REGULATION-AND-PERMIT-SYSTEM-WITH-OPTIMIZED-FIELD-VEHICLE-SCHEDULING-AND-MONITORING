import express from "express";
const router = express.Router();

import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { getUserApplicationStatus } from "../../controller/applications/user-application-status.js";
router.get(
  "/status",
  requireAuthentication,
  requireAuthorization("USER"),
  getUserApplicationStatus,
);
export default router;

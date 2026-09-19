import express from "express";
const router = express.Router();

import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import {
  getUserApplicationStatus,
  logUserCreate,
} from "../../controller/applications/user-application-status.js";
router.get(
  "/status",
  requireAuthentication,
  requireAuthorization("USER"),
  getUserApplicationStatus,
);
router.post("/users/create", logUserCreate);
export default router;

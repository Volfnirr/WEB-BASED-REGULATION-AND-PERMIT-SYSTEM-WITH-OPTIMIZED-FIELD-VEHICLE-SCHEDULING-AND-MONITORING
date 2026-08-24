import express from "express";
const router = express.Router();

import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAppAdminServices } from "../../middleware/requireAppAdminServices.js";
import { remarks } from "../../validation/remarksData.js";
import { validate } from "../../middleware/validate.js";

import {
  listAppAdminAssignedApplications,
  listAllApplicationsStatus,
  selfAssignApplication,
  approveApplication,
  rejectApplication,
} from "../../controller/applications/admin.controller.js";

router.get(
  "/",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([1, 2, 3, 4]),
  listAppAdminAssignedApplications,
);

router.get(
  "/status",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([1, 2, 3, 4]),
  listAllApplicationsStatus,
);

router.patch(
  "/:id/assign",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([1, 2, 3, 4]),
  selfAssignApplication,
);

router.patch(
  "/:id/approve",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([1, 2, 3, 4]),
  validate(remarks),
  approveApplication,
);

router.patch(
  "/:id/reject",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([1, 2, 3, 4]),
  validate(remarks),
  rejectApplication,
);

export default router;

import express from "express";
const router = express.Router();

import { formSubmitLimiter } from "../../middleware/rateLimit.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAppAdminServices } from "../../middleware/requireAppAdminServices.js";

import { validate } from "../../middleware/validate.js";
import { residentialFormSchema } from "../../validation/residentialData.js";
import {
  submitResidentialForm,
  listResidentialApplications,
  viewResidentialFormById,
  listResidentialAppStatus,
} from "../../controller/applications/residential.controller.js";

// User submits a residential application
router.post(
  "/residential",
  formSubmitLimiter,
  requireAuthentication,
  requireAuthorization("USER"),
  validate(residentialFormSchema),
  submitResidentialForm,
);

// Get all pending  residential applications for self assign
// FOR APPLICATION ADMINS ASSIGNED TO RESIDENTIAL SERVICES
router.get(
  "/residential",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([2]),
  listResidentialApplications,
);

// Get residential application status
router.get(
  "/residential/status",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([2]),
  listResidentialAppStatus,
);
// Get Residential Form by ID
router.get(
  "/residential/:id",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([2]),
  viewResidentialFormById,
);

export default router;

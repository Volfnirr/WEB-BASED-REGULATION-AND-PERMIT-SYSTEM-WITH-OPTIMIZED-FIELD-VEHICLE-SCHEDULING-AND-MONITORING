import express from "express";
const router = express.Router();

import { formSubmitLimiter } from "../../middleware/rateLimit.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAppAdminServices } from "../../middleware/requireAppAdminServices.js";
import { validate } from "../../middleware/validate.js";
import { treeCuttingFormSchema } from "../../validation/treeCuttingData.js";
import {
  submitTreeCuttingForm,
  listTreeCuttingApplications,
  viewTreeCuttingFormById,
  listTreeCuttingAppStatus,
} from "../../controller/applications/tree-cutting.controller.js";
// /api/v1/applications
// User submits a tree-cutting application
router.post(
  "/tree-cutting",
  formSubmitLimiter,
  requireAuthentication,
  requireAuthorization("USER"),
  validate(treeCuttingFormSchema),
  submitTreeCuttingForm,
);

// Get all pending  tree cutting applications for self assign
// FOR APPLICATION ADMINS ASSIGNED TO TREE-CUTTING SERVICES
router.get(
  "/tree-cutting",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([3]),
  listTreeCuttingApplications,
);

// Get tree cutting application status
router.get(
  "/tree-cutting/status",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([3]),
  listTreeCuttingAppStatus,
);

// Get Tree Cutting Form by ID
router.get(
  "/tree-cutting/:id",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([3]),
  viewTreeCuttingFormById,
);

export default router;

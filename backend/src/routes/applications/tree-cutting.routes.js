import express from "express";
const router = express.Router();

import { formSubmitLimiter } from "../../middleware/rateLimit.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAppAdminServices } from "../../middleware/requireAppAdminServices.js";
import { validate } from "../../middleware/validate.js";
import { treeCuttingFormSchema } from "../../validation/treeCuttingData.js";
import { remarks } from "../../validation/remarksData.js";
import {
  submitTreeCuttingForm,
  listTreeCuttingApplications,
  selfAssignTreeCuttingApplication,
  viewTreeCuttingFormById,
  approveTreeCuttingApplication,
  rejectTreeCuttingApplication,
} from "../../controller/applications/tree-cutting.controller.js";
// /api/v1/applications
router.post(
  "/tree-cutting",
  formSubmitLimiter,
  requireAuthentication,
  requireAuthorization("USER"),
  validate(treeCuttingFormSchema),
  submitTreeCuttingForm,
);

// Get all pending  tree cutting applications
// FOR APPLICATION ADMINS ASSIGNED TO TREE-CUTTING SERVICES
router.get(
  "/tree-cutting/applications",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([3]),
  listTreeCuttingApplications,
);

// Get Tree Cutting Form by ID
router.get(
  "/tree-cutting/applications/:id",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([3]),
  viewTreeCuttingFormById,
);

// Allow Application Admins assigned to Tree Cutting Services to self-assign to applications

router.patch(
  "/tree-cutting/applications/:id/assign",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([3]),
  selfAssignTreeCuttingApplication,
);

// Approve tree cutting applications
router.patch(
  "/tree-cutting/applications/:id/approve",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([3]),
  validate(remarks),
  approveTreeCuttingApplication,
);

// Reject tree cutting applications
router.patch(
  "/tree-cutting/applications/:id/reject",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([3]),
  validate(remarks),
  rejectTreeCuttingApplication,
);

export default router;

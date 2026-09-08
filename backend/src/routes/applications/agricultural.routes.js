import express from "express";
const router = express.Router();

import { formSubmitLimiter } from "../../middleware/rateLimit.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAppAdminServices } from "../../middleware/requireAppAdminServices.js";

import { validate } from "../../middleware/validate.js";
import { agriculturalFormSchema } from "../../validation/agriculturalData.js";

import {
  submitAgriculturalFormMW,
  listAgriculturalApplications,
  viewAgriculturalFormById,
  listAgriculturalAppStatus,
} from "../../controller/applications/agricultural.controller.js";

router.post(
  "/agricultural",
  formSubmitLimiter,
  requireAuthentication,
  requireAuthorization("USER"),
  validate(agriculturalFormSchema),
  submitAgriculturalFormMW,
);

router.get(
  "/agricultural",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([1]),
  listAgriculturalApplications,
);

router.get(
  "/agricultural/status",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([1]),
  listAgriculturalAppStatus,
);

router.get(
  "/agricultural/:id",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([1]),
  viewAgriculturalFormById,
);

export default router;
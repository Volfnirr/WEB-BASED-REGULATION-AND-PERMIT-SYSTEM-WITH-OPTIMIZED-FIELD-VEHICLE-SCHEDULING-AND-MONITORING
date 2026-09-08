import express from "express";
const router = express.Router();

import { formSubmitLimiter } from "../../middleware/rateLimit.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAppAdminServices } from "../../middleware/requireAppAdminServices.js";

import { validate } from "../../middleware/validate.js";
import { chainsawFormSchema } from "../../validation/chainsawData.js";

import {
  submitChainsawForm,
  listChainsawApplications,
  viewChainsawFormById,
  listChainsawAppStatus,
} from "../../controller/applications/chainsaw.controller.js";

router.post(
  "/chainsaw",
  formSubmitLimiter,
  requireAuthentication,
  requireAuthorization("USER"),
  validate(chainsawFormSchema),
  submitChainsawForm,
);

router.get(
  "/chainsaw",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([1]),
  listChainsawApplications,
);

router.get(
  "/chainsaw/status",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([1]),
  listChainsawAppStatus,
);

router.get(
  "/chainsaw/:id",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  requireAppAdminServices([1]),
  viewChainsawFormById,
);

export default router;
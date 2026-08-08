import express from "express";
const router = express.Router();

import { formSubmitLimiter } from "../../middleware/rateLimit.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { validate } from "../../middleware/validate.js";
import { residentialFormSchema } from "../../validation/residentialData.js";
import { submitResidentialFormMW } from "../../controller/applications/application.controller.js";

router.post(
  "/applications/residential",
  formSubmitLimiter,
  requireAuthentication,
  requireAuthorization("USER"),
  validate(residentialFormSchema),
  submitResidentialFormMW,
);
export default router;

import express from "express";
const router = express.Router();

import { formSubmitLimiter } from "../../middleware/rateLimit.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { validate } from "../../middleware/validate.js";
import { residentialFormSchema } from "../../validation/residentialData.js";
import { submitResidentialForm } from "../../controller/applications/residential.controller.js";

router.post(
  "/residential",
  formSubmitLimiter,
  requireAuthentication,
  requireAuthorization("USER"),
  validate(residentialFormSchema),
  submitResidentialForm,
);
export default router;

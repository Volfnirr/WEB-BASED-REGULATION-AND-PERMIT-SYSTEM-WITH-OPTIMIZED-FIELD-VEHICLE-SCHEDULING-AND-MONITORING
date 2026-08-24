import express from "express";
const router = express.Router();

import { formSubmitLimiter } from "../../middleware/rateLimit.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { validate } from "../../middleware/validate.js";
import { agriculturalFormSchema } from "../../validation/agriculturalData.js";
import { submitAgriculturalFormMW } from "../../controller/applications/agricultural.controller.js";

router.post(
  "/agricultural",
  formSubmitLimiter,
  requireAuthentication,
  requireAuthorization("USER"),
  validate(agriculturalFormSchema),
  submitAgriculturalFormMW,
);

export default router;

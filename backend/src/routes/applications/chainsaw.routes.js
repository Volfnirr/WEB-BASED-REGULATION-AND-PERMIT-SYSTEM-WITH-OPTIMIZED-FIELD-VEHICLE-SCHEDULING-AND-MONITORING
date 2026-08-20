import express from "express";
const router = express.Router();

import { formSubmitLimiter } from "../../middleware/rateLimit.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { validate } from "../../middleware/validate.js";
import { chainsawFormSchema } from "../../validation/ChainsawData.js";
import { submitChainsawFormMW } from "../../controller/applications/chainsaw.controller.js";

router.post(
  "/chainsaw",
  formSubmitLimiter,
  requireAuthentication,
  requireAuthorization("USER"),
  validate(chainsawFormSchema),
  submitChainsawFormMW,
);
export default router;

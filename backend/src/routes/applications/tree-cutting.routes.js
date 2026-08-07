import express from "express";
const router = express.Router();

import { formSubmitLimiter } from "../../middleware/rateLimit.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { validate } from "../../middleware/validate.js";
import { treeCuttingFormSchema } from "../../validation/treeCuttingData.js";
import { submitTreeCuttingFormMW } from "../../controller/applications/tree-cutting.controller.js";
// router.get("/applications", );
router.post(
  "/applications/tree-cutting",
  formSubmitLimiter,
  requireAuthentication,
  requireAuthorization("USER"),
  validate(treeCuttingFormSchema),
  submitTreeCuttingFormMW,
);
export default router;

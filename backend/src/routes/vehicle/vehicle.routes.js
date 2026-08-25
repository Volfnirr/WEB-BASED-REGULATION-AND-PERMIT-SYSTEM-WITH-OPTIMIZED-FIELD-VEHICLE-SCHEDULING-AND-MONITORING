import express from "express";
const router = express.Router();

import { vehicleAction } from "../../middleware/rateLimit.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { validate } from "../../middleware/validate.js";
import { vehicleSchema } from "../../validation/vehicle/vehicleData.js";
import { createVehicle } from "../../controller/vehicle/vehicle.controller.js";
import { attachFile } from "../../middleware/attachment.js";
import upload from "../../middleware/upload.js";
// Create a new vehicle
// Sarap tulugan HAHAHAHA 2:00 AM 12 hours na taenaaa
router.post(
  "/",
  vehicleAction,
  requireAuthentication,
  requireAuthorization("VEHICLE_ADMIN"),
  upload.single("imageUrl"),
  attachFile("imageUrl"),
  validate(vehicleSchema),
  createVehicle,
);

export default router;

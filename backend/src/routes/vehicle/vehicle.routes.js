import express from "express";
const router = express.Router();

import {
  vehicleAction,
  fetchLimit,
  vehicleSubmitTicketLimit,
} from "../../middleware/rateLimit.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { validate } from "../../middleware/validate.js";
import { attachFile } from "../../middleware/attachment.js";
import upload from "../../middleware/upload.js";
import {
  vehicleSchema,
  updateVehicleSchema,
} from "../../validation/vehicle/vehicleData.js";
import { tripTicketFormSchema } from "../../validation/vehicle/tripTicketData.js";
import {
  createVehicle,
  listAllVehicles,
  updateVehicle,
  vehicleStatus,
  availableVehicles,
  submitTripAndSchedule,
} from "../../controller/vehicle/vehicle.controller.js";

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

router.patch(
  "/:id",
  vehicleAction,
  requireAuthentication,
  requireAuthorization("VEHICLE_ADMIN"),
  upload.single("imageUrl"),
  attachFile("imageUrl"),
  validate(updateVehicleSchema),
  updateVehicle,
);

router.get(
  "/",
  requireAuthentication,
  requireAuthorization("VEHICLE_ADMIN"),
  listAllVehicles,
);

router.get(
  "/status",
  requireAuthentication,
  requireAuthorization("VEHICLE_ADMIN"),
  vehicleStatus,
);

router.get(
  "/schedules/available",
  fetchLimit,
  requireAuthentication,
  requireAuthorization("VEHICLE_ADMIN"),
  availableVehicles,
);

router.post(
  "/trip-ticket",
  vehicleSubmitTicketLimit,
  requireAuthentication,
  requireAuthorization("VEHICLE_ADMIN"),
  validate(tripTicketFormSchema),
  submitTripAndSchedule,
);

export default router;

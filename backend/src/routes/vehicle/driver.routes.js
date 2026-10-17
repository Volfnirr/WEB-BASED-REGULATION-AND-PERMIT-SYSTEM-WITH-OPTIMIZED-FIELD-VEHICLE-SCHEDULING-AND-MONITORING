import express from "express";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { validate } from "../../middleware/validate.js";
import { fetchLimit, vehicleAction } from "../../middleware/rateLimit.js";
import {
  driverSchema,
  updateDriverSchema,
  blockedDatesSchema,
} from "../../validation/vehicle/driverData.js";
import * as drivers from "../../controller/vehicle/driver.controller.js";

const router = express.Router();
router.use(requireAuthentication, requireAuthorization("VEHICLE_ADMIN"));
router.get("/", fetchLimit, drivers.listDrivers);
router.post("/", vehicleAction, validate(driverSchema), drivers.createDriver);
router.get("/available", fetchLimit, drivers.availableDrivers);
router.get("/schedules", fetchLimit, drivers.driverSchedules);
router.post(
  "/blocks",
  vehicleAction,
  validate(blockedDatesSchema),
  drivers.saveBlock,
);
router.patch(
  "/blocks/:id",
  vehicleAction,
  validate(blockedDatesSchema),
  drivers.saveBlock,
);
router.delete("/blocks/:id", vehicleAction, drivers.deleteBlock);
router.patch(
  "/:id",
  vehicleAction,
  validate(updateDriverSchema),
  drivers.updateDriver,
);
export default router;

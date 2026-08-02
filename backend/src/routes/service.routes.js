import express from "express";
import {
  getAppAdminServices,
  getAppAdminAssignServices,
} from "../controller/appAdminService.controller.js";
//example lol tulog
const router = express.Router();

router.get("/services", getAppAdminServices);
router.get("/services/my", getAppAdminAssignServices);
export default router;

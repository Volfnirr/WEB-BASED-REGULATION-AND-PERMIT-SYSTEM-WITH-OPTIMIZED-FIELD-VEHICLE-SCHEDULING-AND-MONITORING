import express from "express";
import {
  getAppAdminServices,
  getAppAdminAssignServices,
} from "../controller/app-admin.controller.js";
const router = express.Router();

import { requireAuthentication } from "../middleware/requireAuthentication.js";
// This is for requireAuthorization
// Important: use after requireAuthentication
// requireAuthorization to use: requireAuthorization(role)
// role = the required role needed to perform the allowed actions
import { requireAuthorization } from "../middleware/requireAuthorization.js";
// This is for requireAppAdminServices
// Important: user after requireAuthentication a nd requireAuthorization
// requireAppAdminServices to use: requireAuthorization(["services","services"])
// service = add required service for that action
// services are
// 1 = Agricultural Free Patent,
// 2 = Residential Free Patent,
// 3 = Tree Cutting Permit,
// 4 = Chainsaw Registration
import { requireAppAdminServices } from "../middleware/requireAppAdminServices.js";
//example lol tulog

router.get(
  "/services",
  requireAuthentication,
  requireAuthorization("APPLICATION_ADMIN"),
  getAppAdminServices,
);
router.get(
  "/services/my",
  requireAuthentication,
  requireAppAdminServices([1]),
  getAppAdminAssignServices,
);
export default router;

import express from "express";
const router = express.Router();

import {
  fetchLimit,
  assignServicesLimit,
  createAccountLimit,
  createInspectorLimit,
} from "../../middleware/rateLimit.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import {
  listAllAuditLogs,
  assignedServices,
  createUser,
  listUsers,
  createInspector,
  updateInspector,
  listAllInspectors,
  dashboard,
  UnbanUser,
  banUser,
  ChangeUserPassword,
  ChangeUserRole,
  ChangeUserName,
} from "../../controller/super-admin/super-admin.controller.js";
import { validate } from "../../middleware/validate.js";
import { assignServicesSchema } from "../../validation/super-admin/superAdminData.js";
import {
  createInspectorSchema,
  updatetripInspectorSchema,
} from "../../validation/super-admin/inspectorsData.js";
import {
  createUserSchema,
  banSchema,
  unBanSchema,
  changePasswordSchema,
  changeRoleSchema,
  editUserNameSchema,
} from "../../validation/super-admin/adminActionsData.js";

router.get(
  "/dashboard",
  fetchLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  dashboard,
);

// AUDIT LOGS START
// GET ALL AUDIT LOGS DESC (createdAt)
router.get(
  "/audit-logs",
  fetchLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  listAllAuditLogs,
);

// AUDIT LOGS END

// MANAGE USERS START
// ASSIGN SERVICES TO APPLICATION ADMIN

router.post(
  "/users",
  createAccountLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  validate(createUserSchema),
  createUser,
);

router.post(
  "/users/ban",
  createAccountLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  validate(banSchema),
  banUser,
);

router.post(
  "/users/unban",
  createAccountLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  validate(unBanSchema),
  UnbanUser,
);

router.post(
  "/users/name",
  createAccountLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  validate(editUserNameSchema),
  ChangeUserName,
);

router.post(
  "/users/password",
  createAccountLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  validate(changePasswordSchema),
  ChangeUserPassword,
);

router.post(
  "/users/role",
  createAccountLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  validate(changeRoleSchema),
  ChangeUserRole,
);

router.get(
  "/users",
  fetchLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  listUsers,
);

router.post(
  "/assign-services",
  assignServicesLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  validate(assignServicesSchema),
  assignedServices,
);

// MANAGE USERS END

// MANAGE INSPECTOR START

router.post(
  "/inspectors",
  createInspectorLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  validate(createInspectorSchema),
  createInspector,
);

router.get(
  "/inspectors",
  fetchLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  listAllInspectors,
);

router.patch(
  "/inspectors/:id",
  createInspectorLimit,
  requireAuthentication,
  requireAuthorization("SUPER_ADMIN"),
  validate(updatetripInspectorSchema),
  updateInspector,
);
// MANAGE INSPECTOR END
export default router;

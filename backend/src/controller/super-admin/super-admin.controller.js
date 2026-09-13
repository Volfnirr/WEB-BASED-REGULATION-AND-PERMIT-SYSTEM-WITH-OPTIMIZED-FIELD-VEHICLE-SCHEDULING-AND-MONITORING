import { prisma } from "../../lib/prisma.js";
import { auth } from "../../lib/auth.js";
import { APIError } from "better-auth/api";
import { fromNodeHeaders } from "better-auth/node";
import { createAuditLog } from "../../services/audit.service.js";
import * as superAdmin from "../../services/super-admin/super-admin.js";

// AUDIT LOGS START
// GET ALL AUDIT LOGS DESC (createdAt)
export async function listAllAuditLogs(req, res) {
  try {
    const auditLogs = await superAdmin.listAllAuditLogs();
    res.status(200).json({
      message: "Successfully retrieved audit logs",
      auditLogs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// AUDIT LOGS END

// MANAGE USERS START
// Create user using better auth
export async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await auth.api.createUser({
      body: {
        email, // required, The email of the user.
        password, // required, The password of the user.
        name, // required, The name of the user.
        role, // A string or array of  stringsrepresenting the roles to apply to the new user.
        data: {
          termsAndCondition: true,
        }, // Extra fields for the user. Including custom additional fields.
      },
    });

    await createAuditLog(
      {
        actorId: req.user.id,
        actorName: req.user.name,
        actorRole: req.user.role,
        action: "Create new account",
        target: "Create Account",
        details: `Created a new account with ID: ${newUser.user.id} ROLE: ${newUser.user.role}`,
      },
      // tx,
    );

    res.status(201).json({
      message: "Account created successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof APIError) {
      return res.status(error.statusCode).json({
        message: error.body?.message ?? error.message,
        error: error.body?.message ?? error.message,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

//List User
export async function listUsers(req, res) {
  try {
    const query = req.query;
    const users = await auth.api.listUsers({
      query,
      headers: fromNodeHeaders(req.headers),
    });
    res.status(200).json({
      message: "Successfully fetched users",
      users,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof APIError) {
      return res.status(error.statusCode).json({
        message: error.body?.message ?? error.message,
        error: error.body?.message ?? error.message,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

// ASSIGN SERVICES TO APPLICATION ADMIN
export async function assignedServices(req, res) {
  try {
    const assignServices = await prisma.$transaction(async (tx) => {
      const userId = req.body[0].userId;
      const validation = await superAdmin.assignValidate(userId);
      console.log("1");
      // CHECK IF USER EXIST
      if (!validation.userExist) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("2");

      // CHECK IF USER ROLE IS APPLICATION_ADMIN
      if (!validation.userIsAppAdmin) {
        return res
          .status(403)
          .json({ message: "You can't assign services to this role" });
      }
      console.log("3");

      const assign = await superAdmin.assignedServices(req.body, tx);
      console.log("4");

      const serviceIds = assign.map((row) => row.serviceId);

      await createAuditLog(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: "Assign service",
          target: "Services",
          details: `Assign a services (${serviceIds}) to user ID: ${userId}`,
        },
        tx,
      );
      return assign;
    });
    res.status(201).json({
      message: "Successfully assign services",
      assignServices,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// MANAGE USERS END

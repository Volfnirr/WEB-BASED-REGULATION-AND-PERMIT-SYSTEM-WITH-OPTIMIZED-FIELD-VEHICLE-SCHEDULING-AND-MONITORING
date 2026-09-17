import { error } from "better-auth/api";
import * as userApplicationStatus from "../../services/applications/application.service.js";
import { createAuditLog } from "../../services/audit.service.js";

// user my applications
export async function getUserApplicationStatus(req, res) {
  try {
    const application = await userApplicationStatus.getUserApplicationStatus(
      req.user.id,
    );

    if (application.length === 0) {
      return res.status(200).json({
        message: "Please create an application first to retrieve its status.",
        application: [],
      });
    }

    return res.status(200).json({
      message: "Successfully fetch user application status",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function logUserCreate(req, res) {
  try {
    if (!req.body.data) {
      res.status(200).json({
        message: "Invalid request",
      });
    }
    await createAuditLog({
      actorId: req.body.data.user.id,
      actorName: req.body.data.user.name,
      actorRole: req.body.data.user.role,
      action: "Create Account",
      target: "User",
      details: `User with name of ${req.body.data.user.name} and gmail of ${req.body.data.user.email} is created`,
    });
    res.status(201).json({
      message: "Successfully log user",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

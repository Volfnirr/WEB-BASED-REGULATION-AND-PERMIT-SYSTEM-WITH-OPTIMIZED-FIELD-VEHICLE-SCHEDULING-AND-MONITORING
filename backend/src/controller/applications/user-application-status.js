import { error } from "better-auth/api";
import * as userApplicationStatus from "../../services/applications/application.service.js";

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

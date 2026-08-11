import { error } from "better-auth/api";
import * as userApplicationStatus from "../../services/applications/application.service.js";
export async function getUserApplicationStatus(req, res) {
  try {
    const application = await userApplicationStatus.getUserApplicationStatus(
      req.user.id,
    );

    if (application.length === 0) {
      // No content return 204
      return res.status(204).json({
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

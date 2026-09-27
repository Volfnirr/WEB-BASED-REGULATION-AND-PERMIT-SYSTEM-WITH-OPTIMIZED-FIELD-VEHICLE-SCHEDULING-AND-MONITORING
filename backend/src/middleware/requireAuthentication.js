import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export async function requireAuthentication(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res.status(401).json({ message: "Login required" });
    }
    req.user = session.user;
    req.session = session.session;
    console.log(
      "User Email",
      req.user.email,
      new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
    );
    console.log(
      "User Name",
      req.user.name,
      new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
    );
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

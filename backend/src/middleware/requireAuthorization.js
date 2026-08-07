export function requireAuthorization(...userRoles) {
  try {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Login required" });
      }
      console.log("User role:", req.user.role);
      console.log("Allowed roles:", userRoles);
      if (!userRoles.includes(req.user.role)) {
        return res.status(403).json({
          message:
            "Unauthorized access: You do not have permission to perform this action",
        });
      }
      next();
    };
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

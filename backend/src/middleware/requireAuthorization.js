export function requireAuthorization(...userRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Login required" });
    }
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Unauthorized access: You do not have permission to perform this action",
      });
    }
    next();
  };
}

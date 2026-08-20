import { prisma } from "../lib/prisma.js";
// to use requireAppAdminServices([1,2,3,4])
export function requireAppAdminServices(services) {
  return async (req, res, next) => {
    try {
      const userRole = "APPLICATION_ADMIN";

      if (userRole !== req.user.role) {
        return res.status(403).json({
          message:
            "Unauthorized access: You do not have permission to perform this action",
        });
      }
      const assignedServices = await prisma.application_admin_service.findMany({
        where: { userId: req.session.userId },
      });

      const grantedAccess = assignedServices.some((s) =>
        services.includes(s.serviceId),
      );

      if (!grantedAccess) {
        return res.status(403).json({
          message: "Unauthorized access: You are not assigned to this service",
        });
      }
      req.user.assignedServices = assignedServices;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

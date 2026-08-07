import { prisma } from "../lib/prisma.js";
import {
  getServices,
  getAssignedServices,
} from "../services/app-admin.service.js";

export async function getAppAdminServices(req, res) {
  try {
    const services = await getServices();
    res.json(services);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAppAdminAssignServices(req, res) {
  try {
    const services = await getAssignedServices(req.session.userId);

    //lol rare
    if (services.length === 0) {
      console.log(
        `User:${req.user.name} Tried to access Services but was met with Unauthorized access: You are not assigned any services`,
      );
      return res.status(403).json({
        message: "Unauthorized access: You are not assigned to any services",
      });
    }

    res.json({
      name: req.user.name,
      services: services,
    });
    console.log(`${req.user.name},${req.user.role} services data sent `);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

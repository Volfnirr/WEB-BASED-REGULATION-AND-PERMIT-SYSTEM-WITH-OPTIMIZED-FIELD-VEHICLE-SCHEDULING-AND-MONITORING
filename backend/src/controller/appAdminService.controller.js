import { prisma } from "../lib/prisma.js";

export async function getAppAdminServices(req, res) {
  try {
    const services = await prisma.service.findMany();
    res.json(services);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAppAdminAssignServices(req, res) {
  try {
    const services = await prisma.application_admin_service.findMany({
      where: {
        userId: req.session.userId,
        // user: true,
      },
    });
    res.json(services);
    console.log(`${req.user.name}  services data sent`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

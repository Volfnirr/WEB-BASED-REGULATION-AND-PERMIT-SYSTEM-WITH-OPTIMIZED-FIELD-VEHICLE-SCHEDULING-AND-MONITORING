import { prisma } from "../../lib/prisma.js";
import { getApplicationNumber } from "../../services/applications/application.service.js";
import * as agriculturalService from "../../services/applications/agricultural.service.js";
import * as AssignService from "../../services/applications/assign-user.service.js";
import { createAuditLog } from "../../services/audit.service.js";
import { SERVICE_ID, SERVICE_PREFIX } from "../../lib/services.js";

export async function submitAgriculturalFormMW(req, res) {
  try {
    console.log("userId being sent:", req.user.id);

    const application = await prisma.$transaction(async (tx) => {
      const year = new Date().getFullYear();
      const serviceId = SERVICE_ID.AGRICULTURAL;

      const incrementRow = await tx.service_increment.upsert({
        where: {
          serviceId_year: { serviceId, year },
        },
        create: { serviceId, year, count: 1 },
        update: { count: { increment: 1 } },
      });

      const refNo = `${SERVICE_PREFIX[serviceId]}-${year}-${String(incrementRow.count).padStart(5, "0")}`;

      const newApplication = await agriculturalService.submitAgriculturalForm(
        refNo,
        req.user.id,
        req.validatedData,
        tx,
      );

      await createAuditLog(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: "Submit Form Application",
          target: "Agricultural Free Patent",
          details: `Submitted Agricultural Free Patent application (${newApplication.referenceNo})`,
        },
        tx,
      );

      return newApplication;
    });

    return res.status(201).json({
      message: "Agricultural free patent application submitted",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

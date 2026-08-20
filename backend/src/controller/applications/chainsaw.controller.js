import { prisma } from "../../lib/prisma.js";
import { getApplicationNumber } from "../../services/applications/application.service.js";
import * as chainsawService from "../../services/applications/chainsaw.service.js";
import * as AssignService from "../../services/applications/assign-user.service.js";
import { createAuditLog } from "../../services/audit.service.js";
import { SERVICE_ID, SERVICE_PREFIX } from "../../lib/services.js";

export async function submitChainsawFormMW(req, res) {
  try {
    const application = await prisma.$transaction(async (tx) => {
      const year = new Date().getFullYear();
      const serviceId = SERVICE_ID.CHAINSAW;

      const incrementRow = await tx.service_increment.upsert({
        where: {
          serviceId_year: { serviceId, year },
        },
        create: { serviceId, year, count: 1 },
        update: { count: { increment: 1 } },
      });

      const refNo = `${SERVICE_PREFIX[serviceId]}-${year}-${String(incrementRow.count).padStart(5, "0")}`;
      const newApplication = await chainsawService.submitChainsawForm(
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
          target: "Chainsaw Registration",
          details: `Submitted Chainsaw Registration application (${newApplication.referenceNo})`,
        },
        tx,
      );

      return newApplication;
    });

    return res.status(201).json({
      message: "Chainsaw registration application submitted",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

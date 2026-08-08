import { getApplicationNumber } from "../../services/applications/application.service.js";
import { submitResidentialForm } from "../../services/applications/residential.service.js";
import { createAuditLog } from "../../services/audit.service.js";
import { prisma } from "../../lib/prisma.js";

export async function submitResidentialFormMW(req, res) {
  try {
    const lastId = await getApplicationNumber();
    const nextId = lastId + 1;
    const year = new Date().getFullYear();
    // Residential Free Patent Form
    const refNo = `RFPF-${year}-${String(nextId).padStart(5, "0")}`;
    console.log("userId being sent:", req.user.id);

    const application = await prisma.$transaction(async (tx) => {
      const newApplication = await submitResidentialForm(
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
          target: "Residential Free Patent",
          details: `Submitted Residential Free Patent application (${refNo})`,
        },
        tx,
      );

      return newApplication;
    });

    return res.status(201).json({
      message: "Residential Free Patent application submitted",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

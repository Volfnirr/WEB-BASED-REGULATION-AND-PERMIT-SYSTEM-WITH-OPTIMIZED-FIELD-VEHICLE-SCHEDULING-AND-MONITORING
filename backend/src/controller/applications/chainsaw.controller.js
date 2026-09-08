import { prisma } from "../../lib/prisma.js";
import { getApplicationNumber } from "../../services/applications/application.service.js";
import { createAuditLog } from "../../services/audit.service.js";
// to use residentialService.exportName
import * as residentialService from "../../services/applications/chainsaw.service.js";
import { SERVICE_ID, SERVICE_PREFIX } from "../../lib/services.js";

export async function submitChainsawForm(req, res) {
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

      const newApplication = await residentialService.submitChainsawForm(
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
      message: "Chainsaw Registration application submitted",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// List all chainsaw applications with PENDING status and no ASSIGNED admin
export async function listChainsawApplications(req, res) {
  try {
    const chainsawApplications =
      await residentialService.listChainsawApplications();

    const applications = chainsawApplications.map((app) => ({
      id: app.id,
      status: app.status,
      submittedAt: app.submittedAt,
      referenceNo: app.referenceNo,
      assignedToId: app.assignedToId,
      serviceName: app.service.name,
      userAccName: app.user_application_userIdTouser.name,
      userAccEmail: app.user_application_userIdTouser.email,
      action: "SELF_ASSIGN",
    }));

    return res.status(200).json({
      message: "Chainsaw application list",
      applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// view an application by the selected id
export async function viewChainsawFormById(req, res) {
  try {
    const applicationData =
      await residentialService.listAssignedChainsawApplications(
        req.params.id,
      );

    if (applicationData.assignedToId !== req.user.id) {
      return res.status(409).json({
        message: `You are not authorized to access this form data, the only one with access is ${applicationData.user_application_assignedToIdTouser.name}`,
      });
    }

    const chainsawFormData = await residentialService.viewChainsawById(
      req.params.id,
    );
    return res.status(200).json({
      message: "Successfully get the Form data",
      chainsawFormData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// List chainsaw application status
export async function listChainsawAppStatus(req, res) {
  try {
    const status = await residentialService.listChainsawAppStatus();
    return res.status(200).json({
      message: "Successfully get the chainsaw application status",
      status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

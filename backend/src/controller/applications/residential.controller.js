import { prisma } from "../../lib/prisma.js";
import { getApplicationNumber } from "../../services/applications/application.service.js";
import { createAuditLog } from "../../services/audit.service.js";
// to use residentialService.exportName
import * as residentialService from "../../services/applications/residential.service.js";
import { SERVICE_ID, SERVICE_PREFIX } from "../../lib/services.js";

export async function submitResidentialForm(req, res) {
  try {
    const application = await prisma.$transaction(async (tx) => {
      const year = new Date().getFullYear();
      const serviceId = SERVICE_ID.RESIDENTIAL;

      const incrementRow = await tx.service_increment.upsert({
        where: {
          serviceId_year: { serviceId, year },
        },
        create: { serviceId, year, count: 1 },
        update: { count: { increment: 1 } },
      });

      const refNo = `${SERVICE_PREFIX[serviceId]}-${year}-${String(incrementRow.count).padStart(5, "0")}`;

      const newApplication = await residentialService.submitResidentialForm(
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
          details: `Submitted Residential Free Patent application (${newApplication.referenceNo})`,
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

// List all residential applications with PENDING status and no ASSIGNED admin
export async function listResidentialApplications(req, res) {
  try {
    const residentialApplications =
      await residentialService.listResidentialApplications();

    const applications = residentialApplications.map((app) => ({
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
      message: "Residential application list",
      applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// view an application by the selected id
export async function viewResidentialFormById(req, res) {
  try {
    const applicationData =
      await residentialService.listAssignedResidentialApplications(
        req.params.id,
      );

    if (applicationData.assignedToId !== req.user.id) {
      return res.status(409).json({
        message: `You are not authorized to access this form data, the only one with access is ${applicationData.user_application_assignedToIdTouser.name}`,
      });
    }

    const residentialFormData = await residentialService.viewResidentialById(
      req.params.id,
    );
    return res.status(200).json({
      message: "Successfully get the Form data",
      residentialFormData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

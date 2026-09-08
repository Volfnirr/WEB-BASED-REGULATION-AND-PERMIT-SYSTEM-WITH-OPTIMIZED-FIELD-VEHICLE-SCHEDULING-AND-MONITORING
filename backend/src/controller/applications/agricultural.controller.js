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

export async function listAgriculturalApplications(req, res) {
  try {
    const agriculturalApplications =
      await agriculturalService.listAgriculturalApplications();

    const applications = agriculturalApplications.map((app) => ({
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
      message: "Agricultural application list",
      applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function viewAgriculturalFormById(req, res) {
  try {
    const applicationData =
      await agriculturalService.listAssignedAgriculturalApplications(
        req.params.id,
      );

    if (applicationData.assignedToId !== req.user.id) {
      return res.status(409).json({
        message: `You are not authorized to access this form data, the only one with access is ${applicationData.user_application_assignedToIdTouser.name}`,
      });
    }

    const agriculturalFormData = await agriculturalService.viewAgriculturalById(
      req.params.id,
    );
    
    return res.status(200).json({
      message: "Successfully get the Form data",
      agriculturalFormData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function listAgriculturalAppStatus(req, res) {
  try {
    const status = await agriculturalService.listAgriculturalAppStatus();
    return res.status(200).json({
      message: "Successfully get the agricultural application status",
      status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
import { prisma } from "../../lib/prisma.js";
import { getApplicationNumber } from "../../services/applications/application.service.js";
import * as treeCuttingService from "../../services/applications/tree-cutting.service.js";
import * as AssignService from "../../services/applications/assign-user.service.js";
import { createAuditLog } from "../../services/audit.service.js";
import { SERVICE_ID, SERVICE_PREFIX } from "../../lib/services.js";
import { promise } from "zod";
import { getManilaYear } from "../../lib/date/get-date.js";

// Submit tree cutting application
export async function submitTreeCuttingForm(req, res) {
  try {
    const application = await prisma.$transaction(async (tx) => {
      const year = getManilaYear();
      const serviceId = SERVICE_ID.TREE_CUTTING;
      const incrementRow = await tx.service_increment.upsert({
        where: {
          serviceId_year: { serviceId, year },
        },
        create: { serviceId, year, count: 1 },
        update: { count: { increment: 1 } },
      });

      const refNo = `${SERVICE_PREFIX[serviceId]}-${year}-${String(incrementRow.count).padStart(5, "0")}`;
      const newApplication = await treeCuttingService.submitTreeCuttingForm(
        refNo,
        req.user.email,
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
          target: "Tree Cutting Permit",
          details: `Submitted Tree Cutting Permit application (${newApplication.referenceNo})`,
        },
        tx,
      );
      return newApplication;
    });

    return res.status(201).json({
      message: "Tree cutting application submitted",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// List all tree-cutting applications with PENDING status and no ASSIGNED admin
export async function listTreeCuttingApplications(req, res) {
  try {
    const treeCuttingApplications =
      await treeCuttingService.listTreeCuttingApplications();

    const applications = treeCuttingApplications.map((app) => ({
      id: app.id,
      status: app.status,
      submittedAt: app.submittedAt,
      referenceNo: app.referenceNo,
      assignedToId: app.assignedToId,
      serviceName: app.service.name,
      userAccName: app.user_application_userIdTouser.name,
      userAccEmail: app.user_application_userIdTouser.email,
    }));

    return res.status(200).json({
      message: "Tree cutting application list",
      applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// view an application by the selected id
export async function viewTreeCuttingFormById(req, res) {
  try {
    if (
      !Number.isSafeInteger(Number(req.params.id)) ||
      Number(req.params.id) < 1
    ) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const applicationData =
      await treeCuttingService.listAssignedToTreeCuttingApplications(
        req.params.id,
      );

    if (applicationData.assignedToId !== req.user.id) {
      return res.status(409).json({
        message: `You are not authorized to access this form data, the only one with access is ${applicationData.user_application_assignedToIdTouser.name}`,
      });
    }

    const treeCuttingFormData =
      await treeCuttingService.viewTreeCuttingFormById(req.params.id);
    return res.status(200).json({
      message: "Successfully get the Form data",
      treeCuttingFormData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function listTreeCuttingAppStatus(req, res) {
  try {
    const status = await treeCuttingService.listTreeCuttingAppStatus();
    return res.status(200).json({
      message: "Successfully get the tree cutting application status",
      status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

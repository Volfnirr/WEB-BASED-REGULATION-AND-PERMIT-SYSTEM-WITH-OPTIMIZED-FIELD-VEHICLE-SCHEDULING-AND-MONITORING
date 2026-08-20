import { prisma } from "../../lib/prisma.js";
import * as appAdmin from "../../services/applications/admin.service.js";
import { createAuditLog } from "../../services/audit.service.js";
import { sendEmail } from "../../email/sendEmail.js";
import { statusEmail } from "../../email/templates.js";

const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

export async function listAppAdminAssignedApplications(req, res) {
  try {
    const { status } = req.query;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid or missing status" });
    }

    const applications = await appAdmin.listAppAdminAssignedApplications(
      req.user.id,
      status,
    );

    const formatted = applications.map((app) => ({
      id: app.id,
      status: app.status,
      submittedAt: app.submittedAt,
      referenceNo: app.referenceNo,
      assignedToId: app.assignedToId,
      serviceId: app.service.id,
      serviceName: app.service.name,
      userAccName: app.user_application_userIdTouser.name,
      userAccEmail: app.user_application_userIdTouser.email,
      action: "VIEW",
    }));

    return res.status(200).json({
      message: `${status} assigned applications`,
      applications: formatted,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function selfAssignApplication(req, res) {
  try {
    const applicationData = await appAdmin.getApplicationForSelfAssign(
      req.params.id,
    );

    if (!applicationData) {
      return res.status(404).json({ message: "Application not found" });
    }

    const isAssignedToService = req.user.assignedServices?.some(
      (s) => s.serviceId === applicationData.serviceId,
    );

    if (!isAssignedToService) {
      return res.status(403).json({
        message:
          "You are not assigned to this service and cannot self-assign to this application",
      });
    }

    if (applicationData.status !== "PENDING") {
      return res
        .status(400)
        .json({ message: "You can only be assigned to PENDING applications" });
    }

    if (applicationData.assignedToId !== null) {
      return res.status(409).json({
        message: `This application is already assigned to ${applicationData.user_application_assignedToIdTouser.name}`,
      });
    }

    const application = await prisma.$transaction(async (tx) => {
      const assignedUserTo = await appAdmin.assignUserToApplication(
        req.params.id,
        req.user.id,
        tx,
      );

      await createAuditLog(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: "Self-Assign",
          target: `${applicationData.service.name} Application ${applicationData.referenceNo}`,
          details: `Assigned self to ${applicationData.service.name} application with Ref No of ${applicationData.referenceNo}`,
        },
        tx,
      );

      return assignedUserTo;
    });

    return res.status(200).json({
      message: `Successfully assigned yourself to the application with the ID of ${applicationData.id} and Ref No. of ${applicationData.referenceNo}`,
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Approve an application
export async function approveApplication(req, res) {
  try {
    const applicationData = await appAdmin.getApplicationForSelfAssign(
      req.params.id,
    );

    if (!applicationData) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (applicationData.assignedToId === null) {
      return res.status(409).json({
        message: "You can't approve an application that is not assigned",
      });
    }

    if (applicationData.assignedToId !== req.user.id) {
      return res.status(409).json({
        message: "You can't approve an application that doesn't belong to you",
      });
    }

    if (applicationData.status !== "PENDING") {
      return res.status(409).json({
        message: "You can only approve applications that are pending",
      });
    }

    const application = await prisma.$transaction(async (tx) => {
      const approvedApplication = await appAdmin.approveApplication(
        req.params.id,
        req.validatedData.remarks,
        req.user.id,
        tx,
      );

      await createAuditLog(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: "Approve",
          target: `${applicationData.service.name} Application ${applicationData.referenceNo}`,
          details: `Approved a ${applicationData.service.name} application with Ref No of ${applicationData.referenceNo}`,
        },
        tx,
      );

      await sendEmail(
        "volfnir24@gmail.com", // change to approvedApplication.user_application_userIdTouser.email pag meron ng domain huhuhu //gawa ka resend mo tapos palitan mo yung email kung ano yung email na ginamit mo paggawa ng resend
        statusEmail({
          applicantName: approvedApplication.user_application_userIdTouser.name,
          status: "APPROVED",
          applicationId: applicationData.referenceNo,
          appAdminId: req.user.name,
          remarks: approvedApplication.remarks,
        }),
      );

      return approvedApplication;
    });

    return res.status(200).json({
      message: `Successfully approved the application with the ID of ${applicationData.id} and Ref No. of ${applicationData.referenceNo}`,
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//Reject an application
export async function rejectApplication(req, res) {
  try {
    const applicationData = await appAdmin.getApplicationForSelfAssign(
      req.params.id,
    );

    if (!applicationData) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (applicationData.assignedToId === null) {
      return res.status(409).json({
        message: "You can't reject an application that is not assigned",
      });
    }

    if (applicationData.assignedToId !== req.user.id) {
      return res.status(409).json({
        message: "You can't reject an application that doesn't belong to you",
      });
    }

    if (applicationData.status !== "PENDING") {
      return res.status(409).json({
        message: "You can only reject applications that are pending",
      });
    }

    const application = await prisma.$transaction(async (tx) => {
      const rejectedApplication = await appAdmin.rejectApplication(
        req.params.id,
        req.validatedData.remarks,
        req.user.id,
        tx,
      );

      await createAuditLog(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: "Reject",
          target: `${applicationData.service.name} Application ${applicationData.referenceNo}`,
          details: `Rejected a ${applicationData.service.name} application with Ref No of ${applicationData.referenceNo}`,
        },
        tx,
      );

      await sendEmail(
        "volfnir24@gmail.com", // change to approvedApplication.user_application_userIdTouser.email pag meron ng domain huhuhu //gawa ka resend mo tapos palitan mo yung email kung ano yung email na ginamit mo paggawa ng resend
        statusEmail({
          applicantName: rejectedApplication.user_application_userIdTouser.name,
          status: "REJECTED",
          applicationId: applicationData.referenceNo,
          appAdminId: req.user.name,
          remarks: rejectedApplication.remarks,
        }),
      );

      return rejectedApplication;
    });

    return res.status(200).json({
      message: `Successfully rejected the application with the ID of ${applicationData.id} and Ref No. of ${applicationData.referenceNo}`,
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

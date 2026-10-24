import { prisma } from "../../lib/prisma.js";
import { createAuditLog } from "../../services/audit.service.js";
import * as inspectorService from "../../services/applications/inspector-workflow.js";

export async function availableInspectors(req, res) {
  try {
    const inspectors = await prisma.inspectors.findMany({
      where: { isAvailable: true },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        extensionName: true,
        email: true,
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    });
    return res.json({ inspectors });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to load inspectors" });
  }
}

export async function assignInspector(req, res) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const saved = await inspectorService.saveInspector(
        req.params.id,
        req.validatedData.assignedInspector,
        req.user,
        tx,
      );

      await createAuditLog(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: "Assign Inspector",
          target: `Application ${saved.application.referenceNo}`,
          details: `Changed inspector from ${saved.previousInspectorId ?? "unassigned"} to ${saved.inspector.id} (${saved.inspector.email}).`,
        },
        tx,
      );

      return saved;
    });
    return res.status(200).json({
      message: "Inspector saved",
      assignedInspector: result.inspector.id,
    });
  } catch (error) {
    if (error.message === "INVALID_APPLICATION_ID") {
      return res.status(400).json({
        message: "Invalid application id",
      });
    }

    if (error.message === "APPLICATION_NOT_FOUND") {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (error.message === "APPLICATION_REVIEW_FORBIDDEN") {
      return res.status(403).json({
        message: "You cannot review this application",
      });
    }

    if (error.message === "APPLICATION_NOT_PENDING") {
      return res.status(409).json({
        message: "Only pending applications can be changed",
      });
    }

    if (error.message === "INSPECTOR_SERVICE_NOT_SUPPORTED") {
      return res.status(400).json({
        message:
          "Inspector assignment is only available for residential and agricultural applications",
      });
    }

    if (error.message === "APPLICATION_FORM_NOT_FOUND") {
      return res.status(404).json({
        message: "Application form not found",
      });
    }

    if (error.message === "INVALID_INSPECTOR_ID") {
      return res.status(400).json({
        message: "Select a valid inspector",
      });
    }

    if (error.message === "INSPECTOR_NOT_FOUND") {
      return res.status(404).json({
        message: "Inspector not found",
      });
    }

    if (error.message === "INSPECTOR_NOT_AVAILABLE") {
      return res.status(409).json({
        message: "This inspector is no longer available",
      });
    }
    console.error(error);
    return res.status(500).json({ message: "Unable to save inspector" });
  }
}

import { prisma } from "../../lib/prisma.js";
import { getApplicationNumber } from "../../services/applications/application.service.js";
import * as treeCuttingService from "../../services/applications/tree-cutting.service.js";
import * as AssignService from "../../services/applications/assign-user.service.js";
import { createAuditLog } from "../../services/audit.service.js";
import { SERVICE_ID, SERVICE_PREFIX } from "../../lib/services.js";
import { promise } from "zod";

// Submit tree cutting application
export async function submitTreeCuttingForm(req, res) {
  try {
    // const lastId = await getApplicationNumber();
    // const nextId = lastId + 1;
    // const year = new Date().getFullYear();
    // const refNo = `TCPF-${year}-${String(nextId).padStart(5, "0")}`;
    // console.log("userId being sent:", req.user.id);

    // apply interactive transaction of prisma uhmmmmmmmmmm
    // two types of  transaction 1. Sequential 2. Interactive
    // interactive when when queries depend on each other
    // if one faill all fail no insert lol
    // wahhhhhhh guide sleep
    const application = await prisma.$transaction(async (tx) => {
      // use
      const year = new Date().getFullYear();
      const serviceId = SERVICE_ID.TREE_CUTTING;

      const incrementRow = await tx.service_increment.upsert({
        where: {
          serviceId_year: { serviceId, year },
        },
        create: { serviceId, year, count: 1 },
        update: { count: { increment: 1 } },
      });

      const refNo = `${SERVICE_PREFIX[serviceId]}-${year}-${String(incrementRow.count).padStart(5, "0")}`;
      // if i forgot to explain
      // parameters in order when you use them in the services sleepppppppppppppppppppppppppp
      const newApplication = await treeCuttingService.submitTreeCuttingForm(
        refNo,
        req.user.id,
        req.validatedData,
        tx,
      );

      // interative so if one fail all fail, buwahhhhh }:<
      // need it so you can keep track of all
      // first version lol
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
        // this thing is here because i do ({}),
        // db = prisma outside the destructuring but in the submitTreeCuttingForm theres no need to destructure
      );

      // only returnign newApplication here since we dont want to pass the auditlog to user
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
      action: "SELF_ASSIGN",
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

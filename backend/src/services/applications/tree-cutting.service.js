import { prisma } from "../../lib/prisma.js";
// using interactive transaction :<
// use in all services maybe? ahhhhhhhhhhhhh uhmmmmmmmmmmmmmm wahhhhhhhhhhhhh
// used db = prisma if use with tx  ,tx
// if not leave blank since db = prisma in js
export async function submitTreeCuttingForm(refNo, userId, data, db = prisma) {
  return db.application.create({
    data: {
      referenceNo: refNo,
      userId: userId,
      serviceId: 3,
      dataPrivacyConsent: data.privacyConsent,
      tree_cutting_permit_form: {
        create: {
          lastName: data.lastName,
          firstName: data.firstName,
          middleName: data.middleName,
          extensionName: data.extensionName,
          fullAddress: data.fullAddress,
          email: data.email,
          contactNo: data.contactNo,
          treeCuttingAddress: data.treeCuttingAddress,
          noTreesToBeRemoved: data.noTreesToBeRemoved,
          signatureName: data.signatureName,
        },
      },
    },
    include: {
      tree_cutting_permit_form: true,
    },
  });
}
// List all tree-cutting application with PENDING status
export async function listTreeCuttingApplications() {
  return await prisma.application.findMany({
    where: {
      serviceId: 3,
      status: "PENDING",
    },
    orderBy: { submittedAt: "desc" },
    select: {
      id: true,
      status: true,
      submittedAt: true,
      referenceNo: true,
      assignedToId: true,
      service: {
        select: {
          id: true,
          name: true,
        },
      },
      user_application_userIdTouser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

//list selected tree cutting application
export async function listAssignedToTreeCuttingApplications(applicationId) {
  return await prisma.application.findUnique({
    where: {
      id: Number(applicationId),
      serviceId: 3,
    },
    select: {
      id: true,
      status: true,
      assignedToId: true,
      referenceNo: true,
      service: {
        select: {
          id: true,
          name: true,
        },
      },
      user_application_assignedToIdTouser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

// view an application by the selected id
export async function viewTreeCuttingFormById(formId) {
  return await prisma.tree_cutting_permit_form.findUnique({
    where: {
      applicationId: Number(formId),
    },
    include: {
      application: {
        select: {
          referenceNo: true,
          submittedAt: true,
          status: true,
        },
      },
    },
  });
}

// Approve tree cutting application
export async function approveTreeCuttingApplication(
  id,
  remarks,
  reviewerId,
  db = prisma,
) {
  return await db.application.update({
    where: {
      id: Number(id),
    },
    data: {
      status: "APPROVED",
      remarks: remarks,
      reviewedAt: new Date(),
      reviewedById: reviewerId,
      updatedAt: new Date(),
    },
  });
}

// Reject tree cutting application
export async function rejectTreeCuttingApplication(
  id,
  remarks,
  reviewerId,
  db = prisma,
) {
  return await db.application.update({
    where: {
      id: Number(id),
    },
    data: {
      status: "REJECTED",
      remarks: remarks,
      reviewedAt: new Date(),
      reviewedById: reviewerId,
      updatedAt: new Date(),
    },
  });
}

import { prisma } from "../../lib/prisma.js";
//For application features
export async function listAppAdminAssignedApplications(userId, status) {
  return await prisma.application.findMany({
    where: {
      status,
      assignedToId: userId,
    },
    orderBy: {
      submittedAt: "desc",
    },
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
        select: { name: true, email: true },
      },
    },
  });
}

// for business rules of self assign
export async function getApplicationForSelfAssign(applicationId) {
  return prisma.application.findUnique({
    where: { id: Number(applicationId) },
    include: {
      service: true,
      user_application_assignedToIdTouser: true,
    },
  });
}

// self-assign a service to a application admin
export async function assignUserToApplication(
  applicationId,
  userId,
  db = prisma,
) {
  return await db.application.update({
    where: {
      id: Number(applicationId),
    },
    data: {
      assignedToId: userId,
    },
  });
}

// Approve an application
export async function approveApplication(id, remarks, reviewerId, db = prisma) {
  return await db.application.update({
    where: { id: Number(id) },
    data: {
      status: "APPROVED",
      remarks,
      reviewedAt: new Date(),
      reviewedById: reviewerId,
      updatedAt: new Date(),
    },
    include: {
      user_application_userIdTouser: true,
    },
  });
}

// Reject an application
export async function rejectApplication(id, remarks, reviewerId, db = prisma) {
  return await db.application.update({
    where: { id: Number(id) },
    data: {
      status: "REJECTED",
      remarks,
      reviewedAt: new Date(),
      reviewedById: reviewerId,
      updatedAt: new Date(),
    },
    include: {
      user_application_userIdTouser: true,
    },
  });
}

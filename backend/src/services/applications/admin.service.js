import { prisma } from "../../lib/prisma.js";
import {
  getLast30DaysRange,
  getLast7DaysRange,
} from "../../lib/date/get-week.js";
import { SERVICE_ID } from "../../lib/services.js";
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

// List All service applications status (All, Agri,Resi,Tree,Chainsaw)
// Status (New Applications (Past 7 days), Pending (All Time), Approved(Past 30 days), Rejected (Past 30 days))
// SERVICE_ID.AGRICULTURAL
export async function listAllApplicationsStatus() {
  const { start: weekStart, end: weekEnd } = getLast7DaysRange();
  const { start: monthStart, end: monthEnd } = getLast30DaysRange();
  const [
    // All Applications start
    newApplications,
    pendingApplications,
    approvedApplications,
    rejectedApplications,
    // All Applications end
    // All Agricultural start
    newAgriculturalApplications,
    pendingAgriculturalApplications,
    approvedAgriculturalApplications,
    rejectedAgriculturalApplications,
    // All Agricultural end
    // All Residential start
    newResidentialApplications,
    pendingResidentialApplications,
    approvedResidentialApplications,
    rejectedResidentialApplications,
    // All Residential end
    // All TreeCutting start
    newTreeCuttingApplications,
    pendingTreeCuttingApplications,
    approvedTreeCuttingApplications,
    rejectedTreeCuttingApplications,
    // All TreeCutting end
    // All Chainsaw start
    newChainsawApplications,
    pendingChainsawApplications,
    approvedChainsawApplications,
    rejectedChainsawApplications,
    // All TreeCutting end
  ] = await Promise.all([
    // All Applications Start
    // Today: New Applications
    prisma.application.count({
      where: {
        submittedAt: { gte: weekStart, lt: weekEnd },
      },
    }),
    // All: Pending Review
    prisma.application.count({
      where: {
        status: "PENDING",
      },
    }),
    // Today: Approved
    prisma.application.count({
      where: {
        status: "APPROVED",
        reviewedAt: { gte: monthStart, lt: monthEnd },
      },
    }),
    // Today: Rejected
    prisma.application.count({
      where: {
        status: "REJECTED",
        reviewedAt: { gte: monthStart, lt: monthEnd },
      },
    }),
    // All Applications End
    // 4 Services Start

    // Agricultural Start
    // Today: New Applications
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.AGRICULTURAL,
        submittedAt: { gte: weekStart, lt: weekEnd },
      },
    }),
    // All: Pending Review
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.AGRICULTURAL,
        status: "PENDING",
      },
    }),
    // Today: Approved
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.AGRICULTURAL,
        status: "APPROVED",
        reviewedAt: { gte: monthStart, lt: monthEnd },
      },
    }),
    // Today: Rejected
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.AGRICULTURAL,
        status: "REJECTED",
        reviewedAt: { gte: monthStart, lt: monthEnd },
      },
    }),
    // Agriculutral End

    // Residential Start
    // Today: New Applications
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.RESIDENTIAL,
        submittedAt: { gte: weekStart, lt: weekEnd },
      },
    }),
    // All: Pending Review
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.RESIDENTIAL,
        status: "PENDING",
      },
    }),
    // Today: Approved
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.RESIDENTIAL,
        status: "APPROVED",
        reviewedAt: { gte: monthStart, lt: monthEnd },
      },
    }),
    // Today: Rejected
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.RESIDENTIAL,
        status: "REJECTED",
        reviewedAt: { gte: monthStart, lt: monthEnd },
      },
    }),
    // Residential End

    // Tree cutting Start
    // Today: New Applications
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.TREE_CUTTING,
        submittedAt: { gte: weekStart, lt: weekEnd },
      },
    }),
    // All: Pending Review
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.TREE_CUTTING,
        status: "PENDING",
      },
    }),
    // Today: Approved
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.TREE_CUTTING,
        status: "APPROVED",
        reviewedAt: { gte: monthStart, lt: monthEnd },
      },
    }),
    // Today: Rejected
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.TREE_CUTTING,
        status: "REJECTED",
        reviewedAt: { gte: monthStart, lt: monthEnd },
      },
    }),
    // Tree Cutting End

    // Chainsaw Start
    // Today: New Applications
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.CHAINSAW,
        submittedAt: { gte: weekStart, lt: weekEnd },
      },
    }),
    // All: Pending Review
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.CHAINSAW,
        status: "PENDING",
      },
    }),
    // Today: Approved
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.CHAINSAW,
        status: "APPROVED",
        reviewedAt: { gte: monthStart, lt: monthEnd },
      },
    }),
    // Today: Rejected
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID.CHAINSAW,
        status: "REJECTED",
        reviewedAt: { gte: monthStart, lt: monthEnd },
      },
    }),
    // Chainsaw End
    //4 Services End
  ]);

  return {
    all: {
      newApplications: newApplications,
      pending: pendingApplications,
      approved: approvedApplications,
      rejected: rejectedApplications,
    },
    agri: {
      newApplications: newAgriculturalApplications,
      pending: pendingAgriculturalApplications,
      approved: approvedAgriculturalApplications,
      rejected: rejectedAgriculturalApplications,
    },
    resi: {
      newApplications: newResidentialApplications,
      pending: pendingResidentialApplications,
      approved: approvedResidentialApplications,
      rejected: rejectedResidentialApplications,
    },
    tree: {
      newApplications: newTreeCuttingApplications,
      pending: pendingTreeCuttingApplications,
      approved: approvedTreeCuttingApplications,
      rejected: rejectedTreeCuttingApplications,
    },
    chainsaw: {
      newApplications: newChainsawApplications,
      pending: pendingChainsawApplications,
      approved: approvedChainsawApplications,
      rejected: rejectedChainsawApplications,
    },
  };
}

import { prisma } from "../../lib/prisma.js";
import { getLast7DaysRange, getTodayRange } from "../../lib/date/get-week.js";
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
// List all tree-cutting applications with PENDING status and no ASSIGNED admin
export async function listTreeCuttingApplications() {
  return await prisma.application.findMany({
    where: {
      serviceId: 3,
      status: "PENDING",
      assignedToId: null,
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

//List selected tree cutting application for view
// used with get id

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

// View an application by the selected id
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
          remarks: true,
        },
      },
    },
  });
}

// List tree cutting status (This week (Approved,Rejected))
// Today (New Applications, Awaiting Assignment,Pending Review, Rejected, Approved))
export async function listTreeCuttingAppStatus() {
  const SERVICE_ID = 3;
  const { start: todayStart, end: todayEnd } = getTodayRange();
  const { start: weekStart, end: weekEnd } = getLast7DaysRange();

  const [
    newApplications,
    awaitingAssignment,
    pendingReview,
    approvedToday,
    rejectedToday,
    weeklyPending,
    weeklyApproved,
    weeklyRejected,
  ] = await Promise.all([
    // Today: New Applications
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        submittedAt: { gte: todayStart, lt: todayEnd },
      },
    }),
    // All: Awaiting Assignment
    prisma.application.count({
      where: { serviceId: SERVICE_ID, status: "PENDING", assignedToId: null },
    }),
    // All: Pending Review
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        status: "PENDING",
        assignedToId: { not: null },
      },
    }),
    // Today: Approved
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        status: "APPROVED",
        reviewedAt: { gte: todayStart, lt: todayEnd },
      },
    }),
    // Today: Rejected
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        status: "REJECTED",
        reviewedAt: { gte: todayStart, lt: todayEnd },
      },
    }),
    // This week: Pending
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        status: "PENDING",
        submittedAt: { gte: weekStart, lt: weekEnd },
      },
    }),
    // This week: Approved
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        status: "APPROVED",
        reviewedAt: { gte: weekStart, lt: weekEnd },
      },
    }),
    // This week: Rejected
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        status: "REJECTED",
        reviewedAt: { gte: weekStart, lt: weekEnd },
      },
    }),
  ]);

  return {
    today: {
      newApplications,
      awaitingAssignment,
      pendingReview,
      approved: approvedToday,
      rejected: rejectedToday,
    },
    thisWeek: {
      pending: weeklyPending,
      approved: weeklyApproved,
      rejected: weeklyRejected,
    },
  };
}

import { prisma } from "../../lib/prisma.js";
import { getLast7DaysRange, getTodayRange } from "../../lib/date/get-date.js";

export async function submitResidentialForm(
  refNo,
  userEmail,
  userId,
  data,
  db = prisma,
) {
  return db.application.create({
    data: {
      referenceNo: refNo,
      userId: userId,
      serviceId: 2,
      dataPrivacyConsent: data.privacyConsent,
      residential_free_patent_form: {
        create: {
          lastName: data.lastName,
          firstName: data.firstName,
          middleName: data.middleName || null,
          email: userEmail,
          fullAddress: data.fullAddress,
          contactNo: data.contactNo,
          citizenship: data.citizenship,
          civilStatus: data.civilStatus,
          dateOfBirth: data.dateOfBirth,
          sex: data.sex,
          spouseName: data.spouseName || null,
          province: data.province,
          municipality: data.municipality,
          barangay: data.barangay,
          specificLocation: data.specificLocation,
          lotNo: data.lotNo,
          surveyNo: data.surveyNo,
          landAreaSqm: parseFloat(data.landAreaSqm),
          occupationDate: data.occupationDate,
          heirPredecessorName: data.heirPredecessorName || null,
          heirRelationship: data.heirRelationship || null,
          heirDateOfDeath: data.heirDateOfDeath || null,
          transfereePredecessorName: data.transfereePredecessorName || null,
          transferAction: data.transferAction || null,
          transactionDate: data.transactionDate || null,
          employmentMarriageOccupationDate:
            data.employmentMarriageOccupationDate || null,
          marriageWithName: data.marriageWithName || null,
          forceAbsenceOccupationDate: data.forceAbsenceOccupationDate || null,
          motherLotOccupationDate: data.motherLotOccupationDate || null,
        },
      },
    },
    include: {
      residential_free_patent_form: true,
    },
  });
}

// List all residential applications with PENDING status and no ASSIGNED admin
export async function listResidentialApplications() {
  return await prisma.application.findMany({
    where: {
      serviceId: 2,
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

// used with get id
export async function listAssignedResidentialApplications(applicationId) {
  return await prisma.application.findUnique({
    where: {
      id: Number(applicationId),
      serviceId: 2,
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

// view residential form by id
export async function viewResidentialById(formId) {
  return await prisma.residential_free_patent_form.findUnique({
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
export async function listResidentialAppStatus() {
  const SERVICE_ID = 2;
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
    //Order hu
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

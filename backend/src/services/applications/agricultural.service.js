import { prisma } from "../../lib/prisma.js";
import { getLast7DaysRange, getTodayRange } from "../../lib/date/get-week.js";

export async function submitAgriculturalForm(refNo, userId, data, db = prisma) {
  return db.application.create({
    data: {
      referenceNo: refNo,
      userId: userId,
      serviceId: 1,
      dataPrivacyConsent: data.privacyConsent,
      agricultural_form: {
        create: {
          lastName: data.lastName,
          firstName: data.firstName,
          middleName: data.middleName || null,
          extensionName: data.extension || null,
          contactNo: data.contactNumber,
          email: data.email,
          dateOfBirth: new Date(data.birthday),
          sex: data.sex.toUpperCase(),
          citizenship: data.citizenship,
          naturalBorn: data.naturalBorn === "Yes",
          civilStatus: data.civilStatus,
          spouseName: data.spouse || null,
          fullAddress: data.mailingAddress,
          province: data.province,
          municipality: data.municipality,
          barangay: data.barangay,
          specificLocation: data.location || "",
          lotNo: data.lotNo,
          surveyNo: data.surveyNo || null,
          landAreaSqm: parseFloat(data.landAreaSqm),
          cultivationDate: data.cultivationDate || "",
          improvementsMade: data.improvements || "",
          isTransferee: !!data.transferee_info,
          transfereeDetails: data.transferee_info || null,
          heirRelationDetails: data.heir_info || null,
          heirDetailsRelation: data.evidence || null,
          heir1Name: data.heir1_name || null,
          heir1Address: data.heir1_address || null,
          heir2Name: data.heir2_name || null,
          heir2Address: data.heir2_address || null,
          heirRepresentativeName: data.heir_rep_name || null,
          heirsOfAncestorName: data.heirs_of || null,
          witness1Name: data.witness1_name,
          witness1Address: data.witness1_address,
          witness2Name: data.witness2_name,
          witness2Address: data.witness2_address,
          dateFiled: new Date(data.date_filed),
          signatureName: data.applicant_signature,
        },
      },
    },
    include: {
      agricultural_form: true,
    },
  });
}

export async function listAgriculturalApplications() {
  return await prisma.application.findMany({
    where: {
      serviceId: 1,
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

export async function listAssignedAgriculturalApplications(applicationId) {
  return await prisma.application.findUnique({
    where: {
      id: Number(applicationId),
      serviceId: 1,
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

export async function viewAgriculturalById(formId) {
  return await prisma.agricultural_form.findUnique({
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

export async function listAgriculturalAppStatus() {
  const SERVICE_ID = 1;
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
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        submittedAt: { gte: todayStart, lt: todayEnd },
      },
    }),
    prisma.application.count({
      where: { serviceId: SERVICE_ID, status: "PENDING", assignedToId: null },
    }),
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        status: "PENDING",
        assignedToId: { not: null },
      },
    }),
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        status: "APPROVED",
        reviewedAt: { gte: todayStart, lt: todayEnd },
      },
    }),
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        status: "REJECTED",
        reviewedAt: { gte: todayStart, lt: todayEnd },
      },
    }),
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        status: "PENDING",
        submittedAt: { gte: weekStart, lt: weekEnd },
      },
    }),
    prisma.application.count({
      where: {
        serviceId: SERVICE_ID,
        status: "APPROVED",
        reviewedAt: { gte: weekStart, lt: weekEnd },
      },
    }),
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
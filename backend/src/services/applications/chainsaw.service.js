import { prisma } from "../../lib/prisma.js";
import { getLast7DaysRange, getTodayRange } from "../../lib/date/get-week.js";

export async function submitChainsawForm(refNo, userId, data, db = prisma) {
  return db.application.create({
    data: {
      referenceNo: refNo,
      userId: userId,
      serviceId: 4, // Chainsaw Registration service ID
      dataPrivacyConsent: data.privacyConsent,
      chainsaw_registration_form: {
        create: {
        
          registrationType: data.registrationType.toUpperCase(), 
          
          lastName: data.lastname,
          firstName: data.firstname,
          middleName: data.middlename,
          extensionName: data.extension, 
          province: data.province,
          municipality: data.municipality,
          barangay: data.barangay,
          
          
          fullAddress: data.completeAddress, 
          email: data.email,
          
          
          contactNo: data.contactNumber, 
          
          brand: data.brand,
          model: data.model,
          
          
          dateOfAcquisition: new Date(data.dateAcquisition), 
          
          serialNumber: data.serialNumber,
          
          
          horsePower: parseFloat(data.horsePower), 
          
          
          maxGuideBarLength: parseFloat(data.guideBarLength), 
        },
      },
    },
    include: {
      chainsaw_registration_form: true, 
    },
  });
}

export async function listChainsawApplications() {
  return await prisma.application.findMany({
    where: {
      serviceId: 4,
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

export async function listAssignedChainsawApplications(applicationId) {
  return await prisma.application.findUnique({
    where: {
      id: Number(applicationId),
      serviceId: 4,
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

export async function viewChainsawById(formId) {
  return await prisma.chainsaw_registration_form.findUnique({
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

export async function listChainsawAppStatus() {
  const SERVICE_ID = 4;
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
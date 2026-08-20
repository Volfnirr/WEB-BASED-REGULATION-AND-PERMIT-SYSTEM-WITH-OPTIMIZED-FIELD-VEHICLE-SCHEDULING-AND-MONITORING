import { prisma } from "../../lib/prisma.js";

export async function submitResidentialForm(refNo, userId, data, db = prisma) {
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
          middleName: data.middleName,
          extensionName: data.extensionName,
          email: data.email,
          fullAddress: data.fullAddress,
          contactNo: data.contactNo,
          citizenship: data.citizenship,
          civilStatus: data.civilStatus,
          dateOfBirth: data.dateOfBirth,
          placeOfBirth: data.placeOfBirth,
          spouseName: data.spouseName,
          province: data.province,
          municipality: data.municipality,
          barangay: data.barangay,
          specificLocation: data.specificLocation,
          lotNo: data.lotNo,
          landAreaSqm: data.landAreaSqm,
          affidavitProvince: data.affidavitProvince,
          affidavitCity: data.affidavitCity,
          affiantName: data.affiantName,
          affiantAddress: data.affiantAddress,
          applicantFullName: data.applicantFullName,
          affidavitLandLocation: data.affidavitLandLocation,
          yearsOfOccupation: data.yearsOfOccupation,
          purposeOfUse: data.purposeOfUse,
          affidavitDate: data.affidavitDate,
          affidavitLocation: data.affidavitLocation,
          signatureAffiantName: data.signatureAffiantName,
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

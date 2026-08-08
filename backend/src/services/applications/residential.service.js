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

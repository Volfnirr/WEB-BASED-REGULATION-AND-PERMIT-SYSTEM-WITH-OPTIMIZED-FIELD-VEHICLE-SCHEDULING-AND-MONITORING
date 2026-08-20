import { prisma } from "../../lib/prisma.js";

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
          civilStatus:
            data.civilStatus.toUpperCase() === "ANULLED"
              ? "ANNULLED"
              : data.civilStatus.toUpperCase(),
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

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

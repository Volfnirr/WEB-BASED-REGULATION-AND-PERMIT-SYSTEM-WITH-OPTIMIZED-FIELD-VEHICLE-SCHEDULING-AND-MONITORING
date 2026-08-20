import { prisma } from "../../lib/prisma.js";


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
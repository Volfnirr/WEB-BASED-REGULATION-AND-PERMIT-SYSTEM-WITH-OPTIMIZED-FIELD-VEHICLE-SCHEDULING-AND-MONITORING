import { prisma } from "../../lib/prisma.js";
import { supabase } from "../../lib/supabase.js";
import { createAuditLog } from "../../services/audit.service.js";
import * as vehicleAdmin from "../../services/vehicle/vehicle.service.js";

export const createVehicle = async (req, res) => {
  try {
    const createVehicle = await prisma.$transaction(async (tx) => {
      const { imageUrl, ...vehicleData } = req.validatedData;

      let filePath = null;

      if (imageUrl) {
        const brand = vehicleData.brand.replace(/\s+/g, "-");
        const model = vehicleData.model.replace(/\s+/g, "-");

        filePath = `vehicle-${brand}-${model}-${vehicleData.plateNumber}-${Date.now()}.${imageUrl.mimetype.split("/")[1]}`;

        const { error } = await supabase.storage
          .from("vehicle-photos")
          .upload(filePath, imageUrl.buffer, {
            contentType: imageUrl.mimetype,
          });

        if (error) {
          throw new Error("UPLOAD_FAILED");
        }
      }

      const vehicle = await vehicleAdmin.createVehicle(
        {
          ...vehicleData,
          imageUrl: filePath,
        },
        tx,
      );

      await createAuditLog(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: "Create Vehicle",
          target: "Vehicle",
          details: `Created a new Vehicle with plate no of ${vehicle.plateNumber}`,
        },
        tx,
      );

      return vehicle;
    });

    res.status(201).json(createVehicle);
  } catch (error) {
    console.log(error);
    if (error.message === "UPLOAD_FAILED") {
      return res
        .status(500)
        .json({ message: "Failed to upload vehicle photo" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

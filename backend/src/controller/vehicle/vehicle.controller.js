import { prisma } from "../../lib/prisma.js";
import { supabase } from "../../lib/supabase.js";
import { createAuditLog } from "../../services/audit.service.js";
import * as vehicleAdmin from "../../services/vehicle/vehicle.service.js";

export async function createVehicle(req, res) {
  try {
    const createVehicle = await prisma.$transaction(async (tx) => {
      const { imageUrl, ...vehicleData } = req.validatedData;

      if (vehicleData.plateNumber) {
        await vehicleAdmin.checkVehiclePlateIfExist(
          vehicleData.plateNumber,
          req.params.id,
          tx,
        );
      }

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
          addedById: req.user.id,
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
          details: `Created vehicle (Plate No: ${vehicle.plateNumber}, ID: ${vehicle.id})`,
        },
        tx,
      );

      return vehicle;
    });

    return res.status(201).json({
      message: "Vehicle created successfully.",
      createVehicle,
    });
  } catch (error) {
    console.log(error);

    if (error.message === "PLATE_NUMBER_EXISTS") {
      return res.status(409).json({
        message: "Plate number is already in use",
      });
    }

    if (error.message === "UPLOAD_FAILED") {
      return res
        .status(500)
        .json({ message: "Failed to upload vehicle photo" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function listAllVehicles(req, res) {
  try {
    console.log("lol 0");

    const vehicleData = await vehicleAdmin.listAllVehicles();
    console.log("lol 1");

    const vehicleDataWithImages = await Promise.all(
      vehicleData.map(async (vehicle) => {
        console.log("lol 1.2");
        const { data, error } = await supabase.storage
          .from("vehicle-photos")
          .createSignedUrl(vehicle.imageUrl, 120);
        if (error) {
          console.log("lol 2");

          console.error(
            `Failed to sign URL for ${vehicle.imageUrl}:`,
            error.message,
          );
          console.log("lol 2.4");
          return { ...vehicle, imageUrl: null };
        }

        console.log("lol 3");
        return { ...vehicle, imageUrl: data.signedUrl };
      }),
    );

    console.log("lol 4");

    return res.status(200).json({
      message: "Vehicle List",
      vehicles: vehicleDataWithImages,
    });
  } catch (error) {
    console.error("listAllVehicles crashed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateVehicle(req, res) {
  try {
    const updateVehicle = await prisma.$transaction(async (tx) => {
      const { imageUrl, ...vehicleData } = req.validatedData;
      if (vehicleData.plateNumber) {
        await vehicleAdmin.checkVehiclePlateIfExist(
          vehicleData.plateNumber,
          req.params.id,
          tx,
        );
      }

      const imageData = await vehicleAdmin.vehicleImageData(req.params.id);

      if (imageUrl) {
        if (imageData.imageUrl) {
          const { error } = await supabase.storage
            .from("vehicle-photos")
            .update(imageData.imageUrl, imageUrl.buffer, {
              contentType: imageUrl.mimetype,
            });

          if (error) {
            throw new Error("UPLOAD_FAILED");
          }
        } else {
          const brand = vehicleData.brand.replace(/\s+/g, "-");
          const model = vehicleData.model.replace(/\s+/g, "-");

          const filePath = `vehicle-${brand}-${model}-${vehicleData.plateNumber}-${Date.now()}.${imageUrl.mimetype.split("/")[1]}`;

          const { error } = await supabase.storage
            .from("vehicle-photos")
            .upload(filePath, imageUrl.buffer, {
              contentType: imageUrl.mimetype,
            });

          if (error) {
            throw new Error("UPLOAD_FAILED");
          }

          vehicleData.imageUrl = filePath;
        }
      }

      const vehicle = await vehicleAdmin.updateVehicle(
        req.params.id,
        {
          ...vehicleData,
          updatedAt: new Date(),
        },
        tx,
      );

      await createAuditLog(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: "Update Vehicle",
          target: "Vehicle",
          details: `Updated vehicle (Plate No: ${vehicle.plateNumber}, ID: ${vehicle.id})`,
        },
        tx,
      );

      return vehicle;
    });

    return res.status(200).json({
      message: "Vehicle updated successfully.",
      updateVehicle,
    });
  } catch (error) {
    console.log(error);

    if (error.message === "PLATE_NUMBER_EXISTS") {
      return res.status(409).json({
        message: "Plate number is already in use",
      });
    }

    if (error.message === "UPLOAD_FAILED") {
      return res
        .status(500)
        .json({ message: "Failed to upload vehicle photo" });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function vehicleStatus(req, res) {
  try {
    const vehiclesInfo = await vehicleAdmin.listVehicleStatus();
    return res.status(200).json({
      message: "Successfully retrieved vehicle status.",
      vehiclesInfo,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

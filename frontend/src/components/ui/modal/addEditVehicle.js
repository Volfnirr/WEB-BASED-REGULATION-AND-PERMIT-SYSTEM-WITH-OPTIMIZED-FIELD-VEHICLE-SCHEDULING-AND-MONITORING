import { useEffect, useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { X, CalendarDays, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";
import {
  createVehicle,
  updateVehicle,
} from "@/lib/api/vehicle/manage-vehicles";

const vehicleSchema = z.object({
  brand: z.string().trim().min(1, "Brand name is required"),
  model: z.string().trim().min(1, "Modela name is required"),
  plateNumber: z.string().trim().min(1, "Plate Number is required"),
  fuelType: z.enum(
    ["DIESEL", "GASOLINE", "ELECTRIC"],
    "Please select a fuel type",
  ),
  seatCapacity: z.coerce.number(),
  color: z.string().trim(),
  isUsable: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .optional(),
  lastMaintenanceDate: z.date().optional(),
  lastRegistrationDate: z.date().optional(),
  registrationExpiration: z.date().optional(),
  imageUrl: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must not exceed 5MB",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG, or WEBP allowed",
    )
    .optional(),
});

const fuelTypeChoiches = [
  { id: 1, value: "DIESEL" },
  { id: 2, value: "GASOLINE" },
  { id: 3, value: "ELECTRIC" },
];

export default function AddEditVehicleModal({ open, onClose, vehicle }) {
  const [existingImageLink, setExistingImageLink] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [openLastMaintenanceDate, setOpenLastMaintenanceDate] = useState(false);
  const [openLastRegistrationDate, setOpenLastRegistrationDate] =
    useState(false);
  const [openRegistrationExpiration, setOpenRegistrationExpiration] =
    useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: "",
      model: "",
      plateNumber: "",
      fuelType: undefined,
      seatCapacity: "",
      color: "",
      isUsable: true,
      lastMaintenanceDate: undefined,
      lastRegistrationDate: undefined,
      registrationExpiration: undefined,
      imageUrl: undefined,
    },
  });
  useEffect(() => {
    if (!open) return;

    if (vehicle) {
      reset({
        brand: vehicle.brand,
        model: vehicle.model,
        plateNumber: vehicle.plateNumber,
        fuelType: vehicle.fuelType,
        seatCapacity: vehicle.seatCapacity,
        color: vehicle.color,
        lastMaintenanceDate: vehicle.lastMaintenanceDate
          ? new Date(vehicle.lastMaintenanceDate)
          : undefined,
        lastRegistrationDate: vehicle.lastRegistrationDate
          ? new Date(vehicle.lastRegistrationDate)
          : undefined,
        registrationExpiration: vehicle.registrationExpiration
          ? new Date(vehicle.registrationExpiration)
          : undefined,
        isUsable: vehicle.isUsable,
      });
      setExistingImageLink(vehicle.imageUrl);
      setNewImageFile(null);
    }
  }, [vehicle, open, reset]);

  const onSubmit = async (data) => {
    if (!vehicle && !newImageFile) {
      toast.error("Please add a vehicle image", {
        position: "top-center",
      });
      return;
    }
    const formData = new FormData();
    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("plateNumber", data.plateNumber);
    formData.append("fuelType", data.fuelType);
    formData.append("seatCapacity", data.seatCapacity);
    formData.append("color", data.color ?? "");
    formData.append("isUsable", data.isUsable);
    if (data.lastMaintenanceDate)
      formData.append(
        "lastMaintenanceDate",
        data.lastMaintenanceDate.toISOString(),
      );
    if (data.lastRegistrationDate)
      formData.append(
        "lastRegistrationDate",
        data.lastRegistrationDate.toISOString(),
      );
    if (data.registrationExpiration)
      formData.append(
        "registrationExpiration",
        data.registrationExpiration.toISOString(),
      );
    if (newImageFile) formData.append("imageUrl", newImageFile);
    console.log("Data", formData);

    try {
      if (vehicle) {
        await updateVehicle({ id: vehicle.id, formData });
        toast.success("Vehicle updated");
      } else {
        await createVehicle(formData);
        toast.success("Vehicle added");
      }
      onClose();
    } catch (err) {
      toast.error("Something went wrong. Please try again later.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 right-0 md:left-64 z-50 flex items-center justify-center pt-10 bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-xl bg-white">
        <div className="flex items-center justify-between border-b p-4 sm:p-6">
          <h2 className="text-xl font-bold sm:text-2xl">
            {vehicle ? "Edit Vehicle" : "Add Vehicle"}
          </h2>
          <button onClick={onClose} className=" cursor-pointer">
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
        >
          <div className="flex flex-col items-center gap-4">
            <label
              htmlFor="vehicleImage"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragActive(false);
                const file = e.dataTransfer.files[0];
                if (file) {
                  setNewImageFile(file);
                  setValue("imageUrl", file, { shouldValidate: true });
                }
              }}
              className={`w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-6 text-center cursor-pointer transition-colors
                ${
                  isDragActive
                    ? "border-[#1a5632] bg-gray-50 border-dashed"
                    : newImageFile || existingImageLink
                      ? "border-solid border-gray-300"
                      : "border-dashed border-gray-300 hover:border-[#1a5632] hover:bg-gray-50"
                }`}
            >
              {newImageFile || existingImageLink ? (
                <Image
                  src={
                    newImageFile
                      ? URL.createObjectURL(newImageFile)
                      : existingImageLink
                  }
                  height={280}
                  width={250}
                  alt="Vehicle preview"
                  className="w-full h-auto max-h-48 object-contain rounded-md bg-white"
                />
              ) : (
                <>
                  <Upload size={20} className="text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Drag and drop or{" "}
                    <span className="underline">select a file</span> to upload
                  </p>
                  <p className="text-xs text-gray-400">
                    Max 5MB — JPG, PNG, or WEBP
                  </p>
                </>
              )}
              <input
                id="vehicleImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setNewImageFile(file);
                  setValue("imageUrl", file, { shouldValidate: true });
                }}
              />
            </label>
            {(newImageFile || existingImageLink) && (
              <button
                type="button"
                onClick={() => {
                  setNewImageFile(null);
                  setExistingImageLink(null);
                  setValue("imageUrl", undefined, { shouldValidate: true });
                }}
                className="text-xs text-red-600 underline"
              >
                Remove image
              </button>
            )}
            {errors.imageUrl && (
              <div className="text-red-600 text-xs font-medium">
                {errors.imageUrl.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <input
              {...register("brand")}
              placeholder="Brand"
              className={inputClass}
            />
            {errors.brand && (
              <div className="text-red-600 text-xs font-medium">
                {errors.brand.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <input
              {...register("model")}
              placeholder="Model"
              className={inputClass}
            />
            {errors.model && (
              <div className="text-red-600 text-xs font-medium">
                {errors.model.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <input
              {...register("plateNumber")}
              placeholder="Plate Number"
              className={inputClass}
            />
            {errors.plateNumber && (
              <div className="text-red-600 text-xs font-medium">
                {errors.plateNumber.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <Controller
              name="fuelType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    size="20"
                    className="w-full px-2 py-2 mb-0 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm transition-colors text-start"
                  >
                    <SelectValue placeholder="Select Fuel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {fuelTypeChoiches.map((c) => (
                        <SelectItem key={c.id} value={c.value}>
                          {c.value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.fuelType && (
              <div className="text-red-600 text-xs font-medium">
                {errors.fuelType.message}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 text-left">
            <input
              type="number"
              {...register("seatCapacity")}
              placeholder="Seat Capacity"
              className={inputClass}
            />
            {errors.seatCapacity && (
              <div className="text-red-600 text-xs font-medium">
                {errors.seatCapacity.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <input
              {...register("color")}
              placeholder="Color"
              className={inputClass}
            />
            {errors.color && (
              <div className="text-red-600 text-xs font-medium">
                {errors.color.message}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="lastMaintenanceDate"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              Last Maintenance Date
            </label>
            <div className="flex flex-col gap-1 text-left">
              <Controller
                name="lastMaintenanceDate"
                control={control}
                render={({ field }) => (
                  <Popover
                    open={openLastMaintenanceDate}
                    onOpenChange={setOpenLastMaintenanceDate}
                  >
                    <PopoverTrigger
                      render={
                        <button
                          type="button"
                          id="lastMaintenanceDate"
                          className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm transition-colors text-start ${
                            field.value ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          <div className="flex flex-row justify-between items-center">
                            {field.value
                              ? new Date(field.value).toLocaleDateString()
                              : "Last Maintenance Date"}
                            <CalendarDays size={20} />
                          </div>
                        </button>
                      }
                    />
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        defaultMonth={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setOpenLastMaintenanceDate(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.lastMaintenanceDate && (
                <div className="text-red-600 text-xs font-medium">
                  {errors.lastMaintenanceDate.message}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="registrationExpiration"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              Registration Expiration
            </label>
            <div className="flex flex-col gap-1 text-left">
              <Controller
                name="registrationExpiration"
                control={control}
                render={({ field }) => (
                  <Popover
                    open={openRegistrationExpiration}
                    onOpenChange={setOpenRegistrationExpiration}
                  >
                    <PopoverTrigger
                      render={
                        <button
                          type="button"
                          id="registrationExpiration"
                          className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm transition-colors text-start ${
                            field.value ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          <div className="flex flex-row justify-between items-center">
                            {field.value
                              ? new Date(field.value).toLocaleDateString()
                              : "Registration Expiration"}
                            <CalendarDays size={20} />
                          </div>
                        </button>
                      }
                    />
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        defaultMonth={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setOpenRegistrationExpiration(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.registrationExpiration && (
                <div className="text-red-600 text-xs font-medium">
                  {errors.registrationExpiration.message}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="lastRegistrationDate"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              Last Registration Date
            </label>
            <div className="flex flex-col gap-1 text-left">
              <Controller
                name="lastRegistrationDate"
                control={control}
                render={({ field }) => (
                  <Popover
                    open={openLastRegistrationDate}
                    onOpenChange={setOpenLastRegistrationDate}
                  >
                    <PopoverTrigger
                      render={
                        <button
                          type="button"
                          id="lastRegistrationDate"
                          className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm transition-colors text-start ${
                            field.value ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          <div className="flex flex-row justify-between items-center">
                            {field.value
                              ? new Date(field.value).toLocaleDateString()
                              : "Last Registration Date"}
                            <CalendarDays size={20} />
                          </div>
                        </button>
                      }
                    />
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        defaultMonth={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setOpenLastRegistrationDate(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.lastRegistrationDate && (
                <div className="text-red-600 text-xs font-medium">
                  {errors.lastRegistrationDate.message}
                </div>
              )}
            </div>
          </div>
          {vehicle && (
            <div className="flex items-start justify-between gap-4 rounded-md border border-gray-300 px-4 py-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="isUsable"
                  className="text-sm font-bold text-gray-800"
                >
                  Is Vehicle Usable
                </label>
                <p className="text-xs text-gray-500">
                  Toggle on if the vehicle can still be used, toggle off if it
                  can't be used anymore
                </p>
              </div>
              <Controller
                name="isUsable"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="isUsable"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5 shrink-0"
                  />
                )}
              />
              {errors.isUsable && (
                <div className="text-red-600 text-xs font-medium">
                  {errors.isUsable.message}
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-5 py-2  cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-3 bg-[#1a5632] text-white font-bold rounded-lg shadow hover:bg-[#124024] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Spinner data-icon />
                </>
              ) : vehicle ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

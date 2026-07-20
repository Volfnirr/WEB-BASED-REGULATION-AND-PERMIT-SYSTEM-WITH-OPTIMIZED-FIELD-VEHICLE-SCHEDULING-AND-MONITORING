import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

export default function AddEditVehicleModal({ open, onClose, vehicle }) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    plateNo: "",
    fuelType: "",
    seatCapacity: "",
    lastMaintenance: "",
  });
  const [existingImageLink, setExistingImageLink] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    if (vehicle) {
      setForm(vehicle);
      setExistingImageLink(vehicle.link);
      setNewImageFile(null);
    } else {
      setForm({
        brand: "",
        model: "",
        plateNo: "",
        fuelType: "",
        seatCapacity: "",
        lastMaintenance: "",
      });
      setExistingImageLink(null);
      setNewImageFile(null);
    }
  }, [vehicle, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send `form` + newImageFile (or existingImageLink) to backend
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 left-0 right-0 md:left-64 z-50 flex items-center justify-center pt-10 bg-black/40 p-4">
      {" "}
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
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-full overflow-hidden rounded border  ">
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
                  className="drop-shadow-md w-full rounded-t-md  h-auto object-contain bg-white"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </div>

            <label className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white">
              {existingImageLink || newImageFile
                ? "Add new image"
                : "Add image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setNewImageFile(e.target.files[0])}
              />
            </label>
          </div>

          <input
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="w-full rounded border p-3"
          />
          <input
            placeholder="Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="w-full rounded border p-3"
          />
          <input
            placeholder="Plate Number"
            value={form.plateNo}
            onChange={(e) => setForm({ ...form, plateNo: e.target.value })}
            className="w-full rounded border p-3"
          />
          <select
            value={form.fuelType}
            onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
            className="w-full rounded border p-3"
          >
            <option value="">Fuel Type</option>
            <option>Diesel</option>
            <option>Gasoline</option>
            <option>Electric</option>
          </select>
          <input
            type="number"
            placeholder="Seat Capacity"
            value={form.seatCapacity}
            onChange={(e) => setForm({ ...form, seatCapacity: e.target.value })}
            className="w-full rounded border p-3"
          />
          <input
            type="date"
            value={form.lastMaintenance}
            onChange={(e) =>
              setForm({ ...form, lastMaintenance: e.target.value })
            }
            className="w-full rounded border p-3"
          />

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
              className="cursor-pointer rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-900"
            >
              {vehicle ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { saveDriverBlock, driverName } from "@/lib/api/vehicle/drivers";

const schema = z
  .object({
    driverId: z.coerce.number().int().positive("Select a driver"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().trim().min(1, "A reason is required").max(500),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export default function BlockForm({ block, drivers, startDate, onClose }) {
  const client = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      driverId: block?.driverId ?? "",
      startDate: block?.startDate.slice(0, 10) ?? startDate,
      endDate: block?.endDate.slice(0, 10) ?? startDate,
      reason: block?.reason ?? "",
    },
  });
  const mutation = useMutation({
    mutationFn: (data) => saveDriverBlock(block?.id, data),
    onSuccess: async (result) => {
      await client.invalidateQueries({ queryKey: ["drivers"] });
      toast.success(result.message);
      onClose();
    },
    onError: (error) => toast.error(error.message),
  });
  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="block-title"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6"
      >
        <h2 id="block-title" className="mb-4 text-lg font-bold">
          {block ? "Edit blocked dates" : "Block driver dates"}
        </h2>
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
        >
          <div>
            <label
              htmlFor="block-driver"
              className="mb-1 block text-xs font-semibold"
            >
              Driver *
            </label>
            <select
              id="block-driver"
              {...register("driverId")}
              className={inputClass}
            >
              <option value="">Select a driver</option>
              {drivers
                .filter(
                  (driver) => driver.isActive || driver.id === block?.driverId,
                )
                .map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driverName(driver)}
                    {!driver.isActive
                      ? " (inactive — reactivate before saving)"
                      : ""}
                  </option>
                ))}
            </select>
            {errors.driverId && (
              <p className="text-xs text-red-600">{errors.driverId.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["startDate", "From"],
              ["endDate", "Through"],
            ].map(([field, label]) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="mb-1 block text-xs font-semibold"
                >
                  {label} *
                </label>
                <input
                  id={field}
                  type="date"
                  {...register(field)}
                  className={inputClass}
                />
                {errors[field] && (
                  <p className="text-xs text-red-600">
                    {errors[field].message}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div>
            <label
              htmlFor="block-reason"
              className="mb-1 block text-xs font-semibold"
            >
              Reason *
            </label>
            <textarea
              id="block-reason"
              rows={3}
              {...register("reason")}
              placeholder="For example: approved leave"
              className={inputClass}
            />
            {errors.reason && (
              <p className="text-xs text-red-600">{errors.reason.message}</p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Both dates are included. Existing trip reservations cannot overlap
            these dates.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={mutation.isPending}
              className="bg-[#1a5632] text-white"
            >
              {mutation.isPending ? "Saving…" : "Save blocked dates"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

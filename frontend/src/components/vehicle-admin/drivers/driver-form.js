"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDriver, updateDriver } from "@/lib/api/vehicle/drivers";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  middleName: z.string().trim().max(100),
  extensionName: z.string().trim().max(10),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(255)
    .pipe(z.email("Enter a valid email")),
});
export default function DriverForm({ driver, onClose }) {
  const client = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: driver?.firstName ?? "",
      lastName: driver?.lastName ?? "",
      middleName: driver?.middleName ?? "",
      extensionName: driver?.extensionName ?? "",
      email: driver?.email ?? "",
    },
  });
  const mutation = useMutation({
    mutationFn: (data) =>
      driver?.id ? updateDriver(driver.id, data) : createDriver(data),
    onSuccess: async (data) => {
      await client.invalidateQueries({ queryKey: ["drivers"] });
      toast.success(data.message);
      onClose();
    },
    onError: (error) => toast.error(error.message),
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="driver-form-title"
        className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 id="driver-form-title" className="text-lg font-bold">
            {driver?.id ? "Edit driver" : "Add driver"}
          </h2>
          <button
            type="button"
            aria-label="Close"
            disabled={mutation.isPending}
            onClick={onClose}
            className="cursor-pointer"
          >
            <X />
          </button>
        </div>
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4 p-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ["firstName", "First name", true],
              ["lastName", "Last name", true],
              ["middleName", "Middle name"],
              ["extensionName", "Extension name"],
              ["email", "Email", true],
            ].map(([field, label, required]) => (
              <div
                key={field}
                className={field === "email" ? "sm:col-span-2" : ""}
              >
                <label
                  className="mb-1 block text-xs font-semibold text-gray-600"
                  htmlFor={field}
                >
                  {label}
                  {required ? " *" : ""}
                </label>
                <input
                  id={field}
                  {...register(field)}
                  type={field === "email" ? "email" : "text"}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-700 focus:outline-none"
                />
                {errors[field] && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors[field].message}
                  </p>
                )}
              </div>
            ))}
          </div>
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
              {mutation.isPending ? "Saving…" : "Save driver"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

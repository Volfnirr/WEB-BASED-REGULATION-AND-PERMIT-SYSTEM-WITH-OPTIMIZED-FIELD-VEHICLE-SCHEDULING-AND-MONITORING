"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner.js";
import { assignUserToApplication } from "@/lib/api/applications/app-admin-action";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function AssignApplication({
  onClose,
  refNo,
  accountName,
  email,
  serviceId,
  userName,
  assignedRole,
  assignedService,
}) {
  // const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({});
  const onSubmit = async (_) => {
    try {
      const response = await assignUserToApplication(serviceId);

      await Promise.all([
        // queryClient.invalidateQueries({ queryKey: ["agricultural"] }),
        queryClient.invalidateQueries({
          queryKey: ["agricultural-applications"],
        }),
        queryClient.invalidateQueries({ queryKey: ["agricultural-status"] }),
        queryClient.invalidateQueries({
          queryKey: ["residential-applications"],
        }),
        queryClient.invalidateQueries({ queryKey: ["residential-status"] }),
        queryClient.invalidateQueries({ queryKey: ["residential-status"] }),
        queryClient.invalidateQueries({
          queryKey: ["tree-cutting-applications"],
        }),
        queryClient.invalidateQueries({ queryKey: ["tree-cutting-status"] }),
        queryClient.invalidateQueries({ queryKey: ["chainsaw-applications"] }),
        queryClient.invalidateQueries({ queryKey: ["chainsaw-status"] }),
        queryClient.invalidateQueries({ queryKey: ["applications-dashboard"] }),
      ]);
      toast.success(`${response.message}`, {
        position: "top-center",
      });
      onClose();
      // router.refresh();
    } catch (err) {
      toast.error(err.message, {
        position: "top-center",
      });
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 right-0 md:left-64 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-lg font-bold text-gray-900">Self Assign</h2>
            <p className="text-sm text-gray-500">
              Please review the details below before proceeding
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Your Account Information
            </p>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">
                  {userName || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned Role</span>
                <span className="font-medium text-gray-900">
                  {assignedRole || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned Service</span>
                <span className="font-medium text-gray-900">
                  {assignedService || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Application Details
            </p>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">REF-NO</span>
                <span className="font-medium text-gray-900">
                  {refNo || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Name</span>
                <span className="font-medium text-gray-900">
                  {accountName || "—"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Account Email</span>
                <span className="break-all font-medium text-gray-900">
                  {email || "—"}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2 mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                CLICK "ASSIGN" TO PROCEED
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-400"
              >
                Cancel
              </button>

              <button className="rounded-lg bg-green-400 px-4 py-2 cursor-pointer text-black hover:bg-green-500  ">
                {isSubmitting ? (
                  <>
                    <Spinner data-icon />
                  </>
                ) : (
                  "Assign"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { X } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { createInspector } from "@/lib/api/super-admin/super-admin";

const createInspectorSchema = z.object({
  lastName: z.string().trim().min(1, "Last name is required"),
  firstName: z.string().trim().min(1, "First name is required"),
  middleName: z.string().trim().optional(),
  extensionName: z.string().trim().optional(),
  email: z.email("Invalid email"),
});

export default function AddInspector({ open, onClose }) {
  const router = useRouter();
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus: outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createInspectorSchema),
  });

  const onSubmit = async (data) => {
    try {
      await createInspector({
        data,
      });
      toast.success("Inspector created successfully", {
        position: "top-center",
      });
      onClose();
      router.refresh();
    } catch (error) {
      console.error("ERROR creating inspectors", error.message);
      toast.error(
        error.message || "Something went wrong while creating the inspector",
        {
          position: "top-center",
        },
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 left-0 right-0 md:left-64 z-50 flex items-center justify-center pt-10 bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-xl bg-white">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Add new inspector </h2>
          <button onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 overflow-y-auto p-4 "
        >
          <div className="grid  grid-cols-1 gap-2 md:grid-cols-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs text-gray-500">First Name</label>

              <input
                {...register("firstName")}
                placeholder="First Name"
                type="text"
                className={inputClass}
              />
              {errors.name && (
                <div className="text-red-600 text-xs font-medium">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs text-gray-500">Middle Name</label>

              <input
                {...register("middleName")}
                placeholder="Middle Name"
                type="text"
                className={inputClass}
              />
              {errors.name && (
                <div className="text-red-600 text-xs font-medium">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs text-gray-500">Last Name</label>

              <input
                {...register("lastName")}
                placeholder="Last Name"
                type="text"
                className={inputClass}
              />
              {errors.name && (
                <div className="text-red-600 text-xs font-medium">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs text-gray-500">Extension Name</label>

              <input
                {...register("extensionName")}
                placeholder="Extension Name"
                type="text"
                className={inputClass}
              />
              {errors.name && (
                <div className="text-red-600 text-xs font-medium">
                  {errors.name.message}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-left">
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className={inputClass}
            />
            {errors.email && (
              <div className="text-red-600 text-xs font-medium">
                {errors.email.message}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#1a5632] cursor-pointer text-white font-bold rounded-lg shadow hover:bg-[#124024] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Spinner data-icon />
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

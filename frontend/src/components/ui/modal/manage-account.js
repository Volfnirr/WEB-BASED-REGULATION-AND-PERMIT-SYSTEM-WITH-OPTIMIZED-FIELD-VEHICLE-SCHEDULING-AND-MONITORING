import { useUser } from "@/lib/context/account-info-context";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/logout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character",
    ),
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
});
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
export default function ManageProfileUI({ isOpen, onClose }) {
  const { user } = useUser();
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showRegPassword, setRegShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const inputDesign =
    "w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm bg-white outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20";

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });
  const onSubmit = async (data) => {
    try {
      const { newPassword, currentPassword } = data;
      await authClient.changePassword(
        {
          newPassword: newPassword, // required, The new password to set
          currentPassword: currentPassword, // required, The current user password
          revokeOtherSessions: true, // When set to true, all other active sessions for this user will be invalidated
        },
        {
          onSuccess: async (ctx) => {
            toast.success("Successfully changed password", {
              position: "top-center",
            });

            reset();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message, { position: "top-center" });
            setError("root", {
              message: ctx.error.message,
            });
          },
        },
      );
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
      });
    }
  };

  console.log("USER", user);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 right-0 md:left-64 z-50 flex items-center justify-center pt-10 bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-xl bg-white">
        {/* <div className="flex items-center justify-between border-b p-4 sm:p-6">
          <h2 className="text-xl font-bold sm:text-2xl">Manage Account</h2>
          <button onClick={onClose} className=" cursor-pointer">
            <X />
          </button>
        </div> */}

        {isFormOpen ? (
          <div className="flex flex-col px-4">
            <div className="text-center text-lg font-bold text-green-600 mt-4 ">
              Change Password
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 text-left mt-4"
            >
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs text-gray-500">New Password</label>
                <div className="relative">
                  <input
                    {...register("newPassword")}
                    type={showRegPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    placeholder="********"
                    className={inputDesign}
                  />
                  <button
                    type="button"
                    onClick={() => setRegShowPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {showRegPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>

                {errors.newPassword && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.newPassword.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs text-gray-500">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    {...register("currentPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    placeholder="********"
                    className={inputDesign}
                  />

                  <button
                    type="button"
                    onClick={() => setshowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.currentPassword.message}
                  </div>
                )}
              </div>
              <p className="text-sm text-red-600">
                Note: All other active sessions for this user will be
                invalidated
              </p>
              {errors.root && (
                <div className="text-red-600 text-sm font-medium text-center">
                  {errors.root.message}
                </div>
              )}
              <div className="flex h-fit justify-end gap-2">
                <div className="grid grid-cols-1 items-center justify-between w-full mb-2 md:grid-cols-2">
                  <div className="flex justify-start items-center w-full gap-2 min-h-10">
                    <Button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="justify-start rounded-lg w-40 whitespace-nowrap  text-black font-bold bg-green-300 px-4 py-2 cursor-pointer hover:bg-green-400"
                    >
                      Back
                    </Button>
                  </div>
                  <div className="flex justify-start items-center w-full gap-2 min-h-10 md:justify-end">
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      className="justify-center rounded-lg w-40 whitespace-nowrap  text-black font-bold bg-red-500 px-4 py-2 cursor-pointer hover:bg-red-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner />
                        </>
                      ) : (
                        "Change password"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="px-4">
            <div className="text-center text-lg font-bold text-green-600 mt-4">
              Manage Account
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Your Account Information
              </p>
              <div className="flex flex-col gap-1.5 text-sm ">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900 max-w-md truncate">
                    {user.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900 max-w-md truncate">
                    {user.email || "—"}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm font-semibold uppercase tracking-wide text-green-500 mt-4">
              Actions
            </p>
            <Button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="justify-start rounded-lg w-40 whitespace-nowrap  text-black font-bold bg-green-300 px-4 py-2 cursor-pointer hover:bg-green-400"
            >
              Change Password
            </Button>
          </div>
        )}
        {isFormOpen ? null : (
          <div className="w-full py-2">
            <div className="grid px-4 grid-cols-1 items-center justify-between w-full md:grid-cols-2">
              <div className="flex justify-start items-center w-full gap-2 min-h-10">
                <Button
                  type="button"
                  onClick={() => logout(router)}
                  className="cursor-pointer bg-red-700 hover:bg-red-800 text-md min-h-9 max-h-md"
                >
                  Logout
                </Button>
              </div>
              <div className="flex justify-end items-center w-full gap-2 min-h-10">
                <Button
                  onClick={onClose}
                  type="button"
                  className="cursor-pointer text-md min-h-9 max-h-md bg-green-700 hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

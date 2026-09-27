"use client";

import { useUser } from "@/lib/context/account-info-context";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { logout } from "@/lib/api/logout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Eye, EyeOff, Lock, LogOut as LogOutIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

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

const inputDesign =
  "w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm bg-white outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20";

function SectionHeader({ children }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
      {children}
    </p>
  );
}

function SettingRow({ icon: Icon, label, description, trailing, disabled }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 ${disabled ? "opacity-50" : ""}`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && (
          <p className="truncate text-xs text-gray-500">{description}</p>
        )}
      </div>
      {trailing}
    </div>
  );
}

export default function ManageProfileUI({ isOpen, onClose }) {
  const { user } = useUser();
  const router = useRouter();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (!isOpen) {
      setShowNewPassword(false);
      setShowCurrentPassword(false);
      reset();
    }
  }, [isOpen, reset]);

  if (!user) {
    return null;
  }

  const onSubmit = async (data) => {
    try {
      const { newPassword, currentPassword } = data;
      await authClient.changePassword(
        {
          newPassword,
          currentPassword,
          revokeOtherSessions: true, // invalidates every other active session
        },
        {
          onSuccess: async () => {
            toast.success("Successfully changed password", {
              position: "top-center",
            });
            reset();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message, { position: "top-center" });
            setError("root", { message: ctx.error.message });
          },
        },
      );
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      swipeDirection="right"
    >
      <DrawerContent className="flex w-full flex-col sm:w-[420px]">
        <DrawerHeader>
          <DrawerTitle className="text-green-600">Account</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-gray-200">
              <Image
                src="/homedenrlogo.png"
                alt="DENR logo"
                fill
                sizes="48px"
                className="object-contain p-1.5"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user.name || "—"}
              </p>
              <p className="truncate text-xs text-gray-500">
                {user.email || "—"}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <SectionHeader>Security</SectionHeader>
            <div className="flex flex-col divide-y divide-gray-100 rounded-lg border border-gray-200">
              <SettingRow
                icon={Lock}
                label="Password"
                description="Update your password"
              />

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3 px-3 py-3"
              >
                <div className="flex flex-col gap-1 text-left">
                  <label
                    htmlFor="newPassword"
                    className="text-xs text-gray-500"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("newPassword")}
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      autoComplete="new-password"
                      placeholder="********"
                      className={inputDesign}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-700/40"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <div className="text-xs font-medium text-red-600">
                      {errors.newPassword.message}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label
                    htmlFor="currentPassword"
                    className="text-xs text-gray-500"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("currentPassword")}
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      autoComplete="current-password"
                      placeholder="********"
                      className={inputDesign}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((v) => !v)}
                      aria-label={
                        showCurrentPassword
                          ? "Hide current password"
                          : "Show current password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-700/40"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <div className="text-xs font-medium text-red-600">
                      {errors.currentPassword.message}
                    </div>
                  )}
                </div>

                <p className="text-xs text-red-600">
                  Note: all other active sessions for this account will be
                  signed out.
                </p>

                {errors.root && (
                  <div className="text-center text-sm font-medium text-red-600">
                    {errors.root.message}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="cursor-pointer justify-center rounded-lg bg-green-600 font-bold text-white hover:bg-green-700"
                  >
                    {isSubmitting ? <Spinner /> : "Change password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <DrawerFooter className="flex-row items-center justify-between border-t border-gray-200 px-4 py-3">
          <Button
            type="button"
            onClick={() => logout(router)}
            className="min-h-9 cursor-pointer gap-1.5 bg-red-700 text-white hover:bg-red-800"
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-h-9 cursor-pointer border-green-700 text-green-700 hover:bg-green-50"
          >
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

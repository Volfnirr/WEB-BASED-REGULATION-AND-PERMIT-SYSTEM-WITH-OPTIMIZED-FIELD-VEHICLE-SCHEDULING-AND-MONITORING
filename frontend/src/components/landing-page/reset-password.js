"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import AuthUI from "@/components/landing-page/auth-ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputDesign =
  "w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm bg-white outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20";

const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character",
    ),
});

export default function ResetPasswordUI({ token }) {
  const router = useRouter();
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { newPassword } = data;

      const {} = await authClient.resetPassword(
        {
          newPassword: newPassword, // required, The new password to set
          token,
        },
        {
          onSuccess: (ctx) => {
            toast.success("Successfully changed password", {
              position: "top-center",
            });
            router.push("/login");
          },

          onError: (ctx) => {
            setError("root", {
              message: ctx.error.message,
            });
          },
        },
      );
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message, {
        position: "top-center",
      });
    }
  };

  return (
    <AuthUI>
      <div className="animate-in fade-in zoom-in duration-300">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 text-left"
        >
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-gray-500">
              Enter your new password
            </label>
            <div className="relative">
              <input
                {...register("newPassword")}
                className={inputDesign}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
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
            {errors.newPassword && (
              <div className="text-red-600 text-xs font-medium">
                {errors.newPassword.message}
              </div>
            )}
          </div>
          {errors.root && (
            <div className="text-red-600 text-sm font-medium text-center">
              {errors.root.message}
            </div>
          )}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full py-3 mt-2 cursor-pointer bg-green-700 text-white font-bold rounded text-sm transition-colors duration-300 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner data-icon />
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="text-[12px] text-gray-600 mt-3">
          <span>Don&apos;t have an account? </span>{" "}
          <Link
            href="/register"
            className="text-blue-600 font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
          >
            Sign up
          </Link>
        </div>
        <div className="text-[12px] text-gray-600 mt-3">
          <span>Back to the homepage? </span>{" "}
          <Link href="/" className="text-blue-600 font-bold hover:underline">
            Go back
          </Link>
        </div>
      </div>
    </AuthUI>
  );
}

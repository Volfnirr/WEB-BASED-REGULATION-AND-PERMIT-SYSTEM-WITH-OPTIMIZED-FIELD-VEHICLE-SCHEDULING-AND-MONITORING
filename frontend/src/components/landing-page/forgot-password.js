"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { getRoleRoute } from "@/lib/role-route";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import AuthUI from "@/components/landing-page/auth-ui";

const inputDesign =
  "w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm bg-white outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20";

const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export default function ForgotPasswordUI() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { email } = data;

      const {} = await authClient.requestPasswordReset(
        {
          email: email, // required, The email address of the user to send a password reset email to
          redirectTo: `${window.location.origin}/reset-password`,
        },
        {
          onSuccess: (ctx) => {
            toast.success("Please check your email for reset password", {
              position: "top-center",
            });
            reset();
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
            <label className="text-xs text-gray-500">Enter your email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Ex: example@gmail.com"
              className={inputDesign}
            />
            {errors.email && (
              <div className="text-red-600 text-xs font-medium">
                {errors.email.message}
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

        {/* <div className="text-[12px] text-gray-600 mt-3">
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
        </div> */}
      </div>
    </AuthUI>
  );
}

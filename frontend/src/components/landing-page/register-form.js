"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import CustomInput from "@/components/landing-page/CustomInput";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { getRoleRoute } from "@/lib/role-route";
import Loading from "@/components/ui/loading";
import AuthUI from "@/components/landing-page/auth-ui";

const modalH3 =
  "text-xs font-bold text-green-800 mt-4 mb-1.5 pb-1 border-b border-gray-200 uppercase tracking-[0.04em]";
const modalP = "text-[13px] leading-7 text-[#444] mb-3";
const modalStrong = "text-[#1a1a1a]";
const inputDesign =
  "w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm bg-white outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20";

const registerSchema = z
  .object({
    name: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least 1 special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const [showTerms, setShowTerms] = useState(false);
  const [showRegPassword, setRegShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const {
    register: registerSignUp,
    handleSubmit: handleRegisterSubmit,
    setError: setregisterError,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (!isPending && session) {
      router.replace(getRoleRoute(session.user.role));
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <Loading />;
  }

  const onSignUp = async (data) => {
    try {
      const { confirmPassword, ...signUpData } = data;
      const { error } = await authClient.signUp.email(
        {
          email: signUpData.email, // user email address
          password: signUpData.password, // user password -> min 8 characters by default
          name: signUpData.name, // user display name
        },

        {
          onSuccess: (ctx) => {
            if (!ctx.data.token) {
              toast.error("Registration failed. Try using different email.", {
                position: "top-center",
              });

              setregisterError("root", {
                message: "Registration failed. Try using different email.",
              });

              return;
            }
            console.log("SUCCESS FIRED:", ctx); // add this too

            toast.success("Registration Successful", {
              position: "top-center",
            });
            // router.push("/login");
          },
          onError: (ctx) => {
            console.log("FULL ERROR CONTEXT:", ctx);
            toast.error(ctx.error.message, { position: "top-center" });
            setregisterError("root", {
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

  return (
    <AuthUI>
      <div className="animate-in fade-in zoom-in duration-300">
        <form
          onSubmit={handleRegisterSubmit(onSignUp)}
          className="flex flex-col gap-4 text-left"
        >
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-gray-500">Full name</label>
            <input
              {...registerSignUp("name")}
              type="text"
              name="name"
              placeholder="Full Name"
              className={inputDesign}
            />
            {registerErrors.name && (
              <div className="text-red-600 text-xs font-medium">
                {registerErrors.name.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-gray-500">Email</label>
            <input
              {...registerSignUp("email")}
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className={inputDesign}
            />
            {registerErrors.email && (
              <div className="text-red-600 text-xs font-medium">
                {registerErrors.email.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-gray-500">Password</label>
            <div className="relative">
              <input
                {...registerSignUp("password")}
                type={showRegPassword ? "text" : "password"}
                id="password"
                name="password"
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

            {registerErrors.password && (
              <div className="text-red-600 text-xs font-medium">
                {registerErrors.password.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-gray-500">Confirm Password</label>
            <div className="relative">
              <input
                {...registerSignUp("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
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
            {registerErrors.confirmPassword && (
              <div className="text-red-600 text-xs font-medium">
                {registerErrors.confirmPassword.message}
              </div>
            )}
          </div>
          <div className="flex flex-row items-center gap-2">
            <CustomInput
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              required={true}
              className={inputDesign + "cursor-pointer"}
            />
            <label
              htmlFor="acceptTerms"
              className="text-xs text-gray-500 cursor-pointer"
            >
              I have read and accept{" "}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-blue-600 font-bold text-xs cursor-pointer hover:underline p-0 bg-transparent border-none inline"
              >
                terms and conditions
              </button>
            </label>
          </div>
          {registerErrors.root && (
            <div className="text-red-600 text-sm font-medium text-center">
              {registerErrors.root.message}
            </div>
          )}
          <button
            disabled={isRegisterSubmitting}
            type="submit"
            className="w-full py-3 mt-2 bg-green-700 text-white font-bold rounded text-sm transition-colors duration-300 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRegisterSubmitting ? (
              <>
                <Spinner />
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="text-[12px] text-gray-600 mt-6">
          <span>Already have an account? </span>{" "}
          <Link
            href="/login"
            className="text-blue-600 font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* === TERMS MODAL === */}
      <div
        className={`fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 transition-opacity duration-200 ${
          showTerms
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-lg w-full max-w-[580px] max-h-[85vh] flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-200 overflow-hidden ${
            showTerms ? "translate-y-0 scale-100" : "translate-y-5 scale-[0.97]"
          }`}
        >
          <div className="pt-5 px-6 pb-4 border-b border-gray-200 flex items-center gap-2.5 bg-green-700">
            <span className="text-[15px] font-bold text-white flex-1 text-left">
              Terms and Conditions
            </span>
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="bg-white/20 w-7 h-7 rounded-full cursor-pointer text-base text-white flex items-center justify-center transition-colors duration-150 hover:bg-white/35 border-none"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-5 px-6 text-left [scrollbar-width:thin] [scrollbar-color:#ccc_transparent]">
            <p className={modalP}>
              The following Terms and Conditions contain significant agreements
              involving all users of the{" "}
              <strong className={modalStrong}>
                Provincial Environment and Natural Resources Office (PENRO)
                Pampanga Online Application System.
              </strong>{" "}
              Please review them carefully.
            </p>

            <h3 className={modalH3}>1. Parties & Definitions</h3>
            <p className={modalP}>
              All terms{" "}
              <strong className={modalStrong}>You, Your, and Yours</strong>{" "}
              refer to the Online PMS user — the individual who has registered
              or is attempting to register an account.{" "}
              <strong className={modalStrong}>We, Us, and Our</strong> refer to
              PENRO Pampanga. <strong className={modalStrong}>System</strong>{" "}
              refers to the Online PMS.
            </p>

            <h3 className={modalH3}>2. Account & Credentials</h3>
            <p className={modalP}>
              Your <strong className={modalStrong}>Username</strong> is the
              email address you provide during registration.{" "}
              <strong className={modalStrong}>Your access</strong> or{" "}
              <strong className={modalStrong}>system account</strong> refers to
              the combination of your email address and password registered in
              the system. The terms username and email address are used
              interchangeably. You are solely responsible for maintaining the
              confidentiality of your credentials.
            </p>

            <h3 className={modalH3}>
              3. Confidential Business Information (CBI)
            </h3>
            <p className={modalP}>
              The term{" "}
              <strong className={modalStrong}>
                Confidential Business Information (CBI)
              </strong>{" "}
              refers to information considered a trade secret — any formula,
              pattern, compilation, program, device, method, technique, or
              process whose economic value depends on remaining secret. You
              agree not to disclose CBI to any unauthorized third party.
            </p>

            <h3 className={modalH3}>4. User Conduct & Compliance</h3>
            <p className={modalP}>
              By registering, you agree to use the system responsibly and in
              full compliance with applicable{" "}
              <strong className={modalStrong}>
                Philippine laws, DENR regulations
              </strong>
              , and the policies set by PENRO Pampanga. Prohibited activities
              include submitting false information, unauthorized access,
              uploading harmful content, and impersonating others.
            </p>

            <h3 className={modalH3}>5. Consequences of Violation</h3>
            <p className={modalP}>
              Unauthorized access, misrepresentation, or misuse of the system
              may result in{" "}
              <strong className={modalStrong}>
                suspension of your account
              </strong>{" "}
              and appropriate legal action under applicable laws, including the
              Cybercrime Prevention Act of 2012 (RA 10175).
            </p>

            <h3 className={modalH3}>6. Amendments</h3>
            <p className={modalP}>
              PENRO Pampanga reserves the right to update these Terms and
              Conditions at any time. Continued use of the system after changes
              are posted constitutes your acceptance of the revised terms.
            </p>

            <h3 className={modalH3}>7. Governing Law</h3>
            <p className={modalP}>
              These Terms and Conditions shall be governed by and construed in
              accordance with the laws of the Republic of the Philippines.
              Disputes shall be subject to the jurisdiction of the appropriate
              Philippine courts.
            </p>
          </div>

          <div className="py-3.5 px-6 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="py-2.5 px-6 rounded text-[13px] font-bold cursor-pointer border-none bg-green-700 text-white transition-colors duration-300 hover:bg-green-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </AuthUI>
  );
}

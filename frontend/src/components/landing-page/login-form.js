"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getRoleRoute } from "@/lib/role-route";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";
import AuthUI from "@/components/landing-page/auth-ui";

const inputDesign =
  "w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm bg-white outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    setError: setLoginError,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!isPending && session) {
      router.replace(getRoleRoute(session.user.role));
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <Loading />;
  }

  const onLogin = async (data) => {
    try {
      const { email, password } = data;

      const {} = await authClient.signIn.email(
        {
          email,
          password,
          rememberMe: true,
        },
        {
          onSuccess: (ctx) => {
            toast.success("Signed in successfully", {
              position: "top-center",
            });
            const role = ctx.data.user.role;
            const route = getRoleRoute(role);
            router.push(route);
          },
          onError: (ctx) => {
            setLoginError("root", {
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
          onSubmit={handleLoginSubmit(onLogin)}
          className="flex flex-col gap-4 text-left"
        >
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-gray-500">Email</label>
            <input
              {...registerLogin("email")}
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className={inputDesign}
            />
            {loginErrors.email && (
              <div className="text-red-600 text-xs font-medium">
                {loginErrors.email.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-gray-500">Password</label>
            <div className="relative">
              <input
                {...registerLogin("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="********"
                className={inputDesign}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
            {loginErrors.password && (
              <div className="text-red-600 text-xs font-medium">
                {loginErrors.password.message}
              </div>
            )}
          </div>
          {loginErrors.root && (
            <div className="text-red-600 text-sm font-medium text-center">
              {loginErrors.root.message}
            </div>
          )}
          <button
            disabled={isLoginSubmitting}
            type="submit"
            className="w-full py-3 mt-2 bg-green-700 text-white font-bold rounded text-sm transition-colors duration-300 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoginSubmitting ? (
              <>
                <Spinner data-icon />
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="text-[12px] text-gray-600 mt-6">
          <span>Don&apos;t have an account? </span>{" "}
          <Link
            href="/register"
            className="text-blue-600 font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </AuthUI>
  );
}

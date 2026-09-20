import "dotenv/config";
import { betterAuth } from "better-auth";
import {
  createAuthMiddleware,
  APIError,
  getSessionFromCtx,
} from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import {
  ac,
  USER,
  APPLICATION_ADMIN,
  VEHICLE_ADMIN,
  superAdmin,
} from "./permission.js";
import { sendEmail } from "../email/sendEmail.js";
import { resetPasswordEmail, verifyEmail } from "../email/templates.js";
import { prisma } from "./prisma.js";
import { createAuditLog } from "../services/audit.service.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    // TODO: Add this when the backend is deployed. -N.
    crossSubDomainCookies: {
      enabled: true,
      domain: "penropampanga.online",
    },
    ipAddress: {
      ipAddressHeaders: ["X-Real-IP"],
    },
  },
  rateLimit: {
    // 5 request per minute
    enabled: true,
    // windows time in sec
    window: 60,
    // maximum try
    max: 20,
    storage: "database",
    modelName: "rateLimit",
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    autoSignIn: false,
    resetPasswordTokenExpiresIn: 3600,
    // onExistingUserSignUp: async ({ user }, request) => {
    //   console.log(`Duplicate signup attempt for ${user.email}`);
    // },
    sendResetPassword: async ({ user, url, token }, request) => {
      const email = resetPasswordEmail({
        applicantName: user.name,
        resetUrl: url,
      });
      void sendEmail(user.email, email);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const email = verifyEmail({
        applicantName: user.name,
        verifyUrl: url,
      });
      void sendEmail(user.email, email);
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    expiresIn: 60 * 60,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const termsAccepted = ctx.body?.termsAndCondition;
        const password = ctx.body?.password;
        const email = ctx.body?.email?.toLowerCase();
        const existingUser = await ctx.context.adapter.findOne({
          model: "user",
          where: [{ field: "email", value: email }],
        });

        if (existingUser) {
          throw new APIError("BAD_REQUEST", {
            message: "An account with this email already exists.",
          });
        }
        if (!password || !/[A-Z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must contain at least 1 uppercase letter",
          });
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must contain at least 1 special character",
          });
        }

        if (termsAccepted !== true) {
          throw new APIError("BAD_REQUEST", {
            message: "You must accept the terms and conditions",
          });
        }
      }
      if (ctx.path === "/request-password-reset") {
        const email = ctx.body?.email?.toLowerCase();

        const user = await ctx.context.adapter.findOne({
          model: "user",
          where: [{ field: "email", value: email }],
        });

        if (!user) {
          throw new APIError("NOT_FOUND", {
            message: "No account found with that email.",
          });
        }
      }
      if (ctx.path === "/sign-in/email") {
        const email = ctx.body?.email?.toLowerCase();
        if (!email) return;

        const user = await ctx.context.adapter.findOne({
          model: "user",
          where: [{ field: "email", value: email }],
        });

        if (!user?.banned) return;

        if (user.banExpires && new Date(user.banExpires) < new Date()) return;

        const until = user.banExpires
          ? new Date(user.banExpires).toLocaleString("en-PH", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Manila",
            })
          : "Permanent";

        throw new APIError("FORBIDDEN", {
          message: `Your account is banned. Reason: ${user.banReason ?? "No reason provided"}. Until: ${until}.`,
          code: "BANNED_USER",
        });
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up/email")) {
        const user = ctx.context.returned?.user;
        if (!user) return;
        try {
          await createAuditLog({
            actorId: user.id,
            actorName: user.name,
            actorRole: user.role,
            action: "Create Account",
            target: "User",
            details: `Account created for ${user.name} (${user.email}), id: ${user.id}`,
          });
        } catch (err) {
          console.error("Failed to write audit log:", err);
        }
        return;
      }
      if (ctx.path.startsWith("/admin/create-user")) {
        const newUser = ctx.context.returned?.user;
        if (!newUser) {
          return;
        }

        const session = await getSessionFromCtx(ctx);
        const actor = session?.user;
        if (!actor) {
          return;
        }

        try {
          await createAuditLog({
            actorId: actor.id,
            actorName: actor.name,
            actorRole: actor.role,
            action: "Create new account",
            target: "Create Account",
            details: `Created a new account with ID: ${newUser.id} ROLE: ${newUser.role}`,
          });
        } catch (err) {
          console.error("Failed to write audit log:", err);
        }
      }
    }),
  },
  plugins: [
    admin({
      defaultRole: "USER",
      ac,
      roles: {
        USER: USER,
        APPLICATION_ADMIN: APPLICATION_ADMIN,
        VEHICLE_ADMIN: VEHICLE_ADMIN,
        SUPER_ADMIN: superAdmin,
      },
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
      termsAndCondition: {
        type: "boolean",
        required: true,
        defaultValue: false,
        input: true,
      },
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL],
});

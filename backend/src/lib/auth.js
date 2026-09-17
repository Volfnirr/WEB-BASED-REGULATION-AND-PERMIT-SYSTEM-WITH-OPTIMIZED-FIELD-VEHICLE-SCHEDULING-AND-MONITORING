import "dotenv/config";
import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import {
  ac,
  USER,
  APPLICATION_ADMIN,
  VEHICLE_ADMIN,
  superAdmin,
} from "./permission.js";

import { prisma } from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  // advanced: {
  //   // TODO: Add this when the backend is deployed. -N.
  //   crossSubDomainCookies: {
  //     enabled: true,
  //     domain: "penropampanga.online",
  //   },
  //   ipAddress: {
  //     ipAddressHeaders: ["X-Real-IP"],
  //   },
  // },
  // rateLimit: {
  //   // 5 request per minute
  //   enabled: true,
  //   // windows time in sec
  //   window: 60,
  //   // maximum try
  //   max: 20,
  //   storage: "database",
  //   modelName: "rateLimit",
  // },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // requireEmailVerification: false, // change to true when
    // autoSignIn: false,
    // onExistingUserSignUp: async ({ user }, request) => {
    //   console.log(`Duplicate signup attempt for ${user.email}`);
    // },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const termsAccepted = ctx.body?.termsAndCondition;
      const password = ctx.body?.password;

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

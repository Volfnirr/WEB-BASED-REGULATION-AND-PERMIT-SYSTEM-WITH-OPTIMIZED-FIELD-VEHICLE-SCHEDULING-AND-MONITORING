import z from "zod";

export const createUserSchema = z
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
    role: z.enum(
      ["USER", "APPLICATION_ADMIN", "VEHICLE_ADMIN", "SUPER_ADMIN"],
      "Please select a role",
    ),
    assignedServices: z.array(z.number()).default([]),
  })
  .refine(
    (data) =>
      data.role !== "APPLICATION_ADMIN" || data.assignedServices.length > 0,
    {
      message: "Please assign at least one service",
      path: ["assignedServices"],
    },
  );

export const banSchema = z
  .object({
    userId: z.string().min(1, "Id is required"),
    banReason: z
      .string()
      .trim()
      .min(1, "Reason is required")
      .max(500, "Reason is too long"),
    duration: z.string().min(1, "Pick a duration"),
    customAmount: z.string().optional(),
    customUnit: z.enum(["hours", "days", "weeks"]),
  })
  .superRefine((data, ctx) => {
    if (data.duration !== "custom") return;
    const n = Number(data.customAmount);
    if (!Number.isInteger(n) || n < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["customAmount"],
        message: "Enter a whole number of 1 or more",
      });
    }
  });

export const unBanSchema = z.object({
  userId: z.string().min(1, "Id is required"),
});

export const editUserNameSchema = z.object({
  userId: z.string().min(1, "Id is required"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
});

export const changePasswordSchema = z.object({
  userId: z.string().min(1, "Id is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character",
    ),
});
export const changeRoleSchema = z.object({
  userId: z.string().min(1, "Id is required"),
  role: z.enum(["USER", "APPLICATION_ADMIN", "VEHICLE_ADMIN", "SUPER_ADMIN"], {
    message: "Please select a role",
  }),
});

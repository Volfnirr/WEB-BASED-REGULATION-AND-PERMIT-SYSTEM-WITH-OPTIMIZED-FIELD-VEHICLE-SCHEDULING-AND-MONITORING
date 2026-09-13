import { useState } from "react";
import { X } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { Spinner } from "../../spinner";
import { EyeOff, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAppAdmin, createUser } from "@/lib/api/super-admin/super-admin";

const createUserSchema = z
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
    termsAndCondition: z.literal(true),
    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.role !== "APPLICATION_ADMIN" || data.assignedServices.length > 0,
    {
      message: "Please assign at least one service",
      path: ["assignedServices"],
    },
  )

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const roles = [
  { id: 1, value: "USER" },
  { id: 2, value: "APPLICATION_ADMIN" },
  { id: 3, value: "VEHICLE_ADMIN" },
  { id: 4, value: "SUPER_ADMIN" },
];

const services = [
  {
    id: 1,
    label: "Agricultural Free Patent",
  },
  {
    id: 2,
    label: "Residential Free Patent",
  },
  {
    id: 3,
    label: "Tree Cutting Permit",
  },
  {
    id: 4,
    label: "Chainsaw Registration",
  },
];

export default function AddUser({ open, onClose }) {
  const router = useRouter();
  const inputClass =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors";
  const [showRegPassword, setRegShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      termsAndCondition: true,
      assignedServices: [],
    },
  });
  const selectedRole = watch("role");
  const assignedServices = watch("assignedServices");
  const onSubmit = async (data) => {
    try {
      const { newUser, error } = await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (error) {
        toast.error(error.message ?? "Failed to create user", {
          position: "top-center",
        });
        return;
      }

      console.log("Role", data.role);
      console.log("Services", data.assignServices);
      if (
        data.role === "APPLICATION_ADMIN" &&
        data.assignedServices.length > 0
      ) {
        const assignServices = data.assignedServices.map((serviceId) => ({
          userId: newUser.user.id,
          serviceId,
        }));

        console.log("USER CHECK", assignServices);
        await createAppAdmin({
          assignServices,
        });
      }

      toast.success("User created successfully", {
        position: "top-center",
      });
      onClose();
      router.refresh();
    } catch (error) {
      console.error("ERROR creating user", error.message);
      toast.error(
        error.message || "Something went wrong while creating the user",
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
          <h2 className="text-lg font-bold">Add new user</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 overflow-y-auto p-4 "
        >
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-gray-500">Full Name</label>

            <input
              {...register("name")}
              placeholder="Full Name"
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
            <label className="text-xs text-gray-500">Email</label>

            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              className={inputClass}
            />
            {errors.email && (
              <div className="text-red-600 text-xs font-medium">
                {errors.email.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-gray-500">Password</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showRegPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="********"
                className={inputClass}
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

            {errors.password && (
              <div className="text-red-600 text-xs font-medium">
                {errors.password.message}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs text-gray-500">Confirm Password</label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="********"
                className={inputClass}
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
            {errors.confirmPassword && (
              <div className="text-red-600 text-xs font-medium">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 text-left">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value !== "APPLICATION_ADMIN") {
                      setValue("assignedServices", []);
                    }
                  }}
                >
                  <SelectTrigger
                    size="20"
                    className="w-full px-2 py-2 mb-0 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm transition-colors text-start"
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roles.map((c) => (
                        <SelectItem key={c.id} value={c.value}>
                          {c.value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <div className="text-red-600 text-xs font-medium">
                {errors.role.message}
              </div>
            )}
          </div>

          {selectedRole === "APPLICATION_ADMIN" && (
            <div className="flex flex-col gap-1 text-left border-2 border-gray-300 rounded-sm px-4 py-2">
              <span className="text-center text-sm font-semibold">
                Assign services
              </span>

              <FieldGroup className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <Field orientation="horizontal" key={service.id}>
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={assignedServices?.includes(service.id)}
                      onCheckedChange={(checked) => {
                        const currentServices = assignedServices ?? [];

                        if (checked) {
                          setValue("assignedServices", [
                            ...currentServices,
                            service.id,
                          ]);
                        } else {
                          setValue(
                            "assignedServices",
                            currentServices.filter((id) => id !== service.id),
                          );
                        }
                      }}
                      className="border border-black "
                    />

                    <FieldLabel htmlFor={`service-${service.id}`}>
                      {service.label}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
              {errors.assignedServices && (
                <div className="text-red-600 text-xs mt-2 font-medium text-center">
                  {errors.assignedServices.message}
                </div>
              )}
            </div>
          )}

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

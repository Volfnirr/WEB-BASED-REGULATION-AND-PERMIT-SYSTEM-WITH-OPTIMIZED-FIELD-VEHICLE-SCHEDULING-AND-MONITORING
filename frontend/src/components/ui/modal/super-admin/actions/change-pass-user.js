"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  changeUserPassword,
  setUserPassword,
} from "@/lib/api/super-admin/super-admin";

const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least 1 special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ChangeUserPassword({ isOpen, onClose, userData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { newPassword } = data;
      const { id } = userData;
      console.log("NEWPASS NOT NEW DATA", data);

      console.log("NEWPASS DATA", newPassword);
      await changeUserPassword({
        userId: id,
        password: newPassword,
      });

      toast.success("Password updated successfully", {
        position: "top-center",
      });

      reset();
      onClose();
    } catch (error) {
      console.error("ERROR setting password", error.message);
      toast.error(
        error.message || "Something went wrong while updating the password",
        { position: "top-center" },
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md  md:left-[calc(50%+8rem)]">
        <DialogHeader>
          <DialogTitle>Set User Password</DialogTitle>
          <DialogDescription>
            Set a new password for this user.
          </DialogDescription>
        </DialogHeader>
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Account Information</CardTitle>

            <CardDescription>Email: {userData.email}</CardDescription>
            <CardDescription>Name: {userData.name}</CardDescription>
            <CardDescription>Role: {userData.role}</CardDescription>
          </CardHeader>
          <CardContent className="justify-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1 text-left">
                  <Label>New password</Label>
                  <Input
                    {...register("newPassword")}
                    type="password"
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.newPassword.message}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <Label>Confirm password</Label>
                  <Input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="Re-enter new password"
                  />
                  {errors.confirmPassword && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-700 cursor-pointer hover:bg-green-800"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner data-icon />
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

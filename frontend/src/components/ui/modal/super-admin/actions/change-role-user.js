"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { changeUserRole } from "@/lib/api/super-admin/super-admin";

const ROLE_OPTIONS = [
  { value: "USER", label: "User" },
  { value: "APPLICATION_ADMIN", label: "Application Admin" },
  { value: "VEHICLE_ADMIN", label: "Vehicle Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const setRoleSchema = z.object({
  role: z.string().min(1, "Please select a role"),
});

export default function SetUserRole({ isOpen, onClose, userData }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(setRoleSchema),
    defaultValues: { role: userData?.role },
  });

  const onSubmit = async (data) => {
    try {
      if (data.role === userData.role) {
        toast.error("You can only submit if you changed something", {
          position: "top-center",
        });
        return;
      }

      const { id } = userData;
      await changeUserRole({
        userId: id,
        role: data.role,
      });

      toast.success("Role updated successfully", {
        position: "top-center",
      });

      reset();
      onClose();
    } catch (error) {
      console.error("ERROR setting role", error.message);
      toast.error(
        error.message || "Something went wrong while updating the role",
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
          <DialogTitle>Set User Role</DialogTitle>
          <DialogDescription>Change the role for this user.</DialogDescription>
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
                  <Label>Role</Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
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

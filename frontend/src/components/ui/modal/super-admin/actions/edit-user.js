import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateInspector } from "@/lib/api/super-admin/super-admin";
const editUser = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
});

export default function EditUser({ isOpen, onClose, userData }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editUser),
  });

  const onSubmit = async (data) => {
    console.log("Data", userData);
    const user = {};
    if (user) {
      if (data.name !== userData.name) user.name = data.name;
    }
    console.log("User name", user);
    try {
      if (Object.keys(user).length === 0) {
        toast.error("You can only submit if you changed something", {
          position: "top-center",
        });
        return;
      }
      const { id } = userData;
      //   await updateInspector({
      //     data: user,
      //     id,
      //   });
      toast.success("User updated successfully", {
        position: "top-center",
      });

      onClose();
      router.refresh();
    } catch (error) {
      console.error("ERROR updating user", error.message);
      toast.error(
        error.message || "Something went wrong while updating the user",
        {
          position: "top-center",
        },
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md  md:left-[calc(50%+8rem)]">
        <DialogHeader>
          <DialogTitle>Update User Name</DialogTitle>
          <DialogDescription>
            Change the display name for this user.
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
                  <Label>Name</Label>
                  <Input
                    {...register("name")}
                    placeholder="Enter new name"
                    type="text"
                  />
                  {errors.name && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.name.message}
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
            onClick={() => onClose()}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateInspector } from "@/lib/api/super-admin/super-admin";
const editInspectorSchema = z.object({
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name is too long"),
  middleName: z.string().trim().max(100, "Middle name is too long").optional(),
  extensionName: z
    .string()
    .trim()
    .max(100, "Extension name is too long")
    .optional(),
  email: z.email("Invalid email"),
});

export default function EditInspector({ isOpen, onClose, inspectorData }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editInspectorSchema),
    defaultValues: {
      email: inspectorData.email ?? "",
      firstName: inspectorData.firstName ?? "",
      middleName: inspectorData.middleName ?? "",
      lastName: inspectorData.lastName ?? "",
      extensionName: inspectorData.extensionName ?? "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Data", inspectorData);
    const editInspector = {};
    if (inspectorData) {
      if (data.email !== inspectorData.email) editInspector.email = data.email;
      if (data.firstName !== inspectorData.firstName)
        editInspector.firstName = data.firstName;
      if (data.middleName !== inspectorData.middleName)
        editInspector.middleName = data.middleName;
      if (data.lastName !== inspectorData.lastName)
        editInspector.lastName = data.lastName;
      if (data.extensionName !== inspectorData.extensionName)
        editInspector.extensionName = data.extensionName;
    }
    console.log("Inspector data", editInspector);
    try {
      if (Object.keys(editInspector).length === 0) {
        toast.error("You can only submit if you changed something", {
          position: "top-center",
        });
        return;
      }
      const { id } = inspectorData;
      await updateInspector({
        data: editInspector,
        id,
      });
      toast.success("Inspector created successfully", {
        position: "top-center",
      });

      onClose();
      router.refresh();
    } catch (error) {
      console.error("ERROR creating inspectors", error.message);
      toast.error(
        error.message || "Something went wrong while creating the inspector",
        {
          position: "top-center",
        },
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 right-0 z-50  flex items-center justify-center pt-10 bg-black/40 p-4 md:left-64">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Edit inspector</CardTitle>
          <CardDescription>
            Edit inspector {inspectorData.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 text-left">
                <Label>Email</Label>
                <Input {...register("email")} placeholder="Email" type="text" />
                {errors.email && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <Label>First name</Label>
                <Input {...register("firstName")} type="text" />
                {errors.firstName && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.firstName.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <Label>Middle Name</Label>
                <Input {...register("middleName")} type="text" />
                {errors.middleName && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.middleName.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <Label>Last name</Label>
                <Input {...register("lastName")} type="text" />
                {errors.lastName && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.lastName.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <Label>Extension name</Label>
                <Input {...register("extensionName")} type="text" />
                {errors.extensionName && (
                  <div className="text-red-600 text-xs font-medium">
                    {errors.extensionName.message}
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
        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            onClick={() => onClose()}
            variant="outline"
            className="w-full cursor-pointer "
          >
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

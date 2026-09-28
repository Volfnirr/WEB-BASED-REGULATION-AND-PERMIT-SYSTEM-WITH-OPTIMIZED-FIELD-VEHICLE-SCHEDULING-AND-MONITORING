"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { Spinner } from "@/components/ui/spinner";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { banUser } from "@/lib/api/super-admin/super-admin";

const DURATION_PRESETS = [
  { value: "1h", label: "1 hour", seconds: 60 * 60 },
  { value: "1d", label: "1 day", seconds: 60 * 60 * 24 },
  { value: "7d", label: "7 days", seconds: 60 * 60 * 24 * 7 },
  { value: "30d", label: "30 days", seconds: 60 * 60 * 24 * 30 },
  { value: "permanent", label: "Permanent", seconds: undefined },
];

const UNIT_SECONDS = {
  hours: 60 * 60,
  days: 60 * 60 * 24,
  weeks: 60 * 60 * 24 * 7,
};

const banSchema = z
  .object({
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

const defaultValues = {
  banReason: "",
  duration: "7d",
  customAmount: "",
  customUnit: "days",
};

function getBanExpiresIn(data) {
  if (data.duration === "custom") {
    return Number(data.customAmount) * UNIT_SECONDS[data.customUnit];
  }
  return DURATION_PRESETS.find((p) => p.value === data.duration)?.seconds;
}

export default function BanUser({ isOpen, onClose, userData }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(banSchema),
    defaultValues,
  });

  const duration = watch("duration");

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      const banExpiresIn = getBanExpiresIn(data);

      await banUser({
        userId: userData.id,
        banReason: data.banReason,
        ...(banExpiresIn !== undefined && { banExpiresIn }),
      });

      toast.success("User banned successfully", {
        position: "top-center",
      });

      handleClose();
      router.refresh();
    } catch (error) {
      console.error("ERROR banning user", error.message);
      toast.error(
        error.message || "Something went wrong while banning the user",
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
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md  md:left-[calc(50%+8rem)]">
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            This blocks the user from signing in and signs them out of all
            active sessions.
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
                  <Label htmlFor="banReason">Reason</Label>
                  <Textarea
                    id="banReason"
                    {...register("banReason")}
                    placeholder="e.g. Spamming"
                    rows={3}
                  />
                  {errors.banReason && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.banReason.message}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <Label>Duration</Label>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATION_PRESETS.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Custom...</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.duration && (
                    <div className="text-red-600 text-xs font-medium">
                      {errors.duration.message}
                    </div>
                  )}
                </div>

                {duration === "custom" && (
                  <div className="flex flex-col gap-1 text-left">
                    <Label htmlFor="customAmount">Custom duration</Label>
                    <div className="flex gap-2">
                      <Input
                        id="customAmount"
                        type="number"
                        min={1}
                        step={1}
                        placeholder="3"
                        className="flex-1"
                        {...register("customAmount")}
                      />
                      <Controller
                        name="customUnit"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                              <SelectItem value="weeks">Weeks</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    {errors.customAmount && (
                      <div className="text-red-600 text-xs font-medium">
                        {errors.customAmount.message}
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner data-icon />
                      Banning...
                    </>
                  ) : (
                    "Ban user"
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
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

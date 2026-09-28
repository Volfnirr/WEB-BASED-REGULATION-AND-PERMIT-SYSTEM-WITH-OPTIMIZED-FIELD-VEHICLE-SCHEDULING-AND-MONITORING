"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { unbanUser } from "@/lib/api/super-admin/super-admin";

function formatBanExpiry(banExpires) {
  if (!banExpires) return "Never (permanent)";
  const date = new Date(banExpires);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
}

export default function UnbanUser({ isOpen, onClose, userData }) {
  console.log("USER DATAAAAA", userData);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await unbanUser({ userId: userData.id });

      toast.success("User unbanned successfully", {
        position: "top-center",
      });

      onClose();
      router.refresh();
    } catch (error) {
      console.error("ERROR unbanning user", error.message);
      toast.error(
        error.message || "Something went wrong while unbanning the user",
        {
          position: "top-center",
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;

  if (!userData.banned) {
    const { id } = userData;

    toast.error(`User ${userData.email} is not banned`, {
      id,
      position: "top-center",
    });
    return null;
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md  md:left-[calc(50%+8rem)]">
        <DialogHeader>
          <DialogTitle>Unban User</DialogTitle>
          <DialogDescription>
            This lets the user sign in again. Their previous sessions stay
            revoked, so they will need to sign in again.
          </DialogDescription>
        </DialogHeader>
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Account Information</CardTitle>

            <CardDescription>Email: {userData.email}</CardDescription>
            <CardDescription>Name: {userData.name}</CardDescription>
            <CardDescription>Role: {userData.role}</CardDescription>
            <CardDescription>
              Ban reason: {userData.banReason || "No reason given"}
            </CardDescription>
            <CardDescription>
              Ban expires: {formatBanExpiry(userData.banExpires)}
            </CardDescription>
          </CardHeader>
          <CardContent className="justify-center">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full bg-green-700 cursor-pointer hover:bg-green-800"
            >
              {isSubmitting ? (
                <>
                  <Spinner data-icon />
                  Unbanning...
                </>
              ) : (
                "Unban user"
              )}
            </Button>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onClose()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

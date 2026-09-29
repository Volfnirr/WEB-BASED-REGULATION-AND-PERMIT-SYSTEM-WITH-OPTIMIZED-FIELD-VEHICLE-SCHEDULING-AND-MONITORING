"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LoginSuccessToast() {
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStorage.getItem("just-logged-in")) {
      sessionStorage.removeItem("just-logged-in");
      toast.success("Signed in successfully", { position: "top-center" });
    }
  }, [pathname]);

  return null;
}

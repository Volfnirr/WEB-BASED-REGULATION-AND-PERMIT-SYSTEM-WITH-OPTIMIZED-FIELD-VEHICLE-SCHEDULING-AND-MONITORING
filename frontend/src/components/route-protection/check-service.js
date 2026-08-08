"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../ui/loading";
import { useServices } from "@/lib/context/service-context";

export default function AssignedServices({ reqServices, children }) {
  // services are
  // 1 = Agricultural Free Patent,
  // 2 = Residential Free Patent,
  // 3 = Tree Cutting Permit,
  // 4 = Chainsaw Registration
  const router = useRouter();
  const { assignedServices, loading, error } = useServices();
  const grantAccess = reqServices?.some((service) =>
    assignedServices.services?.some((s) => s.serviceId === service),
  );

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (!grantAccess) {
      router.replace("/unauthorized");
    }
  }, [loading, error, grantAccess, router]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p className="px-3 text-sm text-red-300">Failed to load services</p>;
  }
  if (!grantAccess) {
    return null;
  }
  return children;
}

"use client";

import { useState, useEffect } from "react";
import DashboardSkeleton from "@/components/application-admin/dashboard/dashboard-loading";
import { StatusCardSkeleton } from "@/components/skeleton/status-card-skeleton";

export default function DashboardSkeletonSwitcher() {
  const [tab, setTab] = useState(null);

  useEffect(() => {
    const savedTab = localStorage.getItem("tabPreference");
    setTab(savedTab === "cards" ? "cards" : "chart");
  }, []);
  if (tab === null) return <DashboardSkeleton />;
  console.log("Loading", tab);

  return (
    <>{tab === "cards" ? <StatusCardSkeleton /> : <DashboardSkeleton />}</>
  );
}

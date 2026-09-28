"use client";

import { useState, useEffect } from "react";
import { StatusCardSkeleton } from "@/components/skeleton/status-card-skeleton";
import BarLoading from "../application-admin/services-dashboard/service-bar-loading";

export default function AssignSkeletonSwitcher() {
  const [tab, setTab] = useState(null);

  useEffect(() => {
    const savedTab = localStorage.getItem("tabPreference");
    setTab(savedTab === "cards" ? "cards" : "chart");
  }, []);
  if (tab === null) return <BarLoading />;
  console.log("Loading", tab);

  return <>{tab === "cards" ? <StatusCardSkeleton /> : <BarLoading />}</>;
}

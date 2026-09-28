"use client";

import { useEffect, useState } from "react";

import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import { BadgeCheck, CircleX, ClipboardCheck } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AssignedStatusOverview } from "./status-bar-chart";

export default function PendingInfo({ status }) {
  const [tab, setTab] = useState("chart");

  useEffect(() => {
    const savedTab = localStorage.getItem("tabPreference");

    if (savedTab === "cards" || savedTab === "chart") {
      setTab(savedTab);
    }
  }, []);

  const handleTabChange = (value) => {
    setTab(value);
    localStorage.setItem("tabPreference", value);
  };

  const info = [
    {
      label: "Approved",
      total: status?.approved ?? "-",
      icon: <BadgeCheck />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "All Approved applications assigned to you",
    },
    {
      label: "Rejected",
      total: status?.rejected ?? "-",
      icon: <CircleX />,
      bg: "bg-red-200 text-red-600 border-2",
      mainBg: "bg-red-100",
      tooltip: "All Rejected applications assigned to you",
    },
    {
      label: "Pending",
      total: status?.pending ?? "-",
      icon: <ClipboardCheck />,
      bg: "bg-orange-200 text-orange-600",
      mainBg: "bg-orange-100",
      tooltip: "All Pending applications assigned to you",
    },
  ];

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-green-700">
          Assigned Applications Status
        </h2>

        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="cards" className="mb-4">
        <InfoCardContainer>
          {info.map((d) => (
            <Tooltip key={d.label}>
              <TooltipTrigger
                render={
                  <InfoCard
                    mainBg={d.mainBg}
                    icon={d.icon}
                    label={d.label}
                    total={d.total}
                    bg={d.bg}
                  />
                }
              />

              <TooltipContent>
                <p>{d.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </InfoCardContainer>
      </TabsContent>

      <TabsContent value="chart" className="mb-4">
        <AssignedStatusOverview status={status ?? []} />
      </TabsContent>
    </Tabs>
  );
}

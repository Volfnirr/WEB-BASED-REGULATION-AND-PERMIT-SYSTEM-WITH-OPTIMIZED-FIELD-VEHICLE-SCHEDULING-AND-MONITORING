"use client";

import { useEffect, useState } from "react";

import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import {
  FilePlus2,
  UserX,
  ClipboardCheck,
  BadgeCheck,
  CircleX,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { WeeklyStatus } from "../services-dashboard/status-overview-pie-chart";
import { StatusOverview } from "../services-dashboard/status-overview-bar-chart";

export default function ResidentialInfo({ status }) {
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

  const infoCardStatusThisWeek = [
    {
      label: "Pending",
      total: status?.thisWeek?.pending ?? "-",
      icon: <ClipboardCheck />,
      bg: "bg-orange-200 text-orange-600",
      mainBg: "bg-orange-100",
      tooltip:
        "Pending applications, including unassigned, submitted in the past 7 days",
    },
    {
      label: "Approved",
      total: status?.thisWeek?.approved ?? "-",
      icon: <BadgeCheck />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Approved applications in the past 7 days",
    },
    {
      label: "Rejected",
      total: status?.thisWeek?.rejected ?? "-",
      icon: <CircleX />,
      bg: "bg-red-200 text-red-600 border-2",
      mainBg: "bg-red-100",
      tooltip: "Rejected applications in the past 7 days",
    },
  ];

  const infoCardStatusToday = [
    {
      label: "New Applications",
      total: status?.today?.newApplications ?? "-",
      icon: <FilePlus2 />,
      bg: "bg-blue-100 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "New applications today",
    },
    {
      label: "Unassigned",
      total: status?.today?.awaitingAssignment ?? "-",
      icon: <UserX />,
      bg: "bg-amber-100 text-amber-600",
      mainBg: "bg-amber-100",
      tooltip: "Applications awaiting assignment (all time)",
    },
    {
      label: "Pending Review",
      total: status?.today?.pendingReview ?? "-",
      icon: <ClipboardCheck />,
      bg: "bg-orange-100 text-orange-600",
      mainBg: "bg-orange-100",
      tooltip: "Assigned applications pending review (all time)",
    },
    {
      label: "Approved",
      total: status?.today?.approved ?? "-",
      icon: <BadgeCheck />,
      bg: "bg-green-100 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Approved applications today",
    },
    {
      label: "Rejected",
      total: status?.today?.rejected ?? "-",
      icon: <CircleX />,
      bg: "bg-red-100 text-red-600",
      mainBg: "bg-red-100",
      tooltip: "Rejected applications today",
    },
  ];

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-green-700">
          Residential Applications Status
        </h2>

        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="cards" className="mb-4">
        <InfoCardContainer title="Weekly Status (Past 7 Days)">
          {infoCardStatusThisWeek.map((s) => (
            <Tooltip key={s.label}>
              <TooltipTrigger
                render={
                  <InfoCard
                    mainBg={s.mainBg}
                    icon={s.icon}
                    label={s.label}
                    total={s.total}
                    bg={s.bg}
                  />
                }
              />
              <TooltipContent>
                <p>{s.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </InfoCardContainer>

        <InfoCardContainer title="Status Overview">
          {infoCardStatusToday.map((s) => (
            <Tooltip key={s.label}>
              <TooltipTrigger
                render={
                  <InfoCard
                    mainBg={s.mainBg}
                    icon={s.icon}
                    label={s.label}
                    total={s.total}
                    bg={s.bg}
                  />
                }
              />
              <TooltipContent>
                <p>{s.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </InfoCardContainer>
      </TabsContent>

      <TabsContent value="chart" className="mb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <div className="w-full lg:w-[35%]">
            <WeeklyStatus status={status ?? []} />
          </div>

          <div className="w-full lg:w-[65%]">
            <StatusOverview status={status ?? []} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

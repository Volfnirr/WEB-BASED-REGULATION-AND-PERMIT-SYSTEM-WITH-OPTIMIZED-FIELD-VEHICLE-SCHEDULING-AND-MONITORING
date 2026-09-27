"use client";

import { useEffect, useState } from "react";

import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";
import Title from "@/components/ui/title";

import {
  CircleCheck,
  CalendarCheck,
  CarFront,
  Wrench,
  Route,
  CirclePlus,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { VehiclePieChart } from "./vehicle-piechart";
import { TripBarChart } from "./vehicle-trip-barchart";

export default function VehicleDashboardStatus({ status }) {
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

  const trips = [
    {
      id: "1",
      total: status?.tripticketStatus?.totalTrips ?? "-",
      label: "All Trips",
      icon: <Route />,
      bg: "bg-blue-200 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "All existing trips",
    },
    {
      id: "2",
      total: status?.tripticketStatus?.monthlyTrips ?? "-",
      label: "New Trips (30 Days)",
      icon: <CirclePlus />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Trips added in the past 30 days",
    },
    {
      id: "3",
      total: status?.tripticketStatus?.newTrips ?? "-",
      label: "New Trips (7 Days)",
      icon: <CirclePlus />,
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Trips added in the past 7 days",
    },
  ];

  const vehicles = [
    {
      id: "1",
      icon: <CarFront />,
      label: "All Vehicles",
      total: status?.vehicleStatus?.allVehicles ?? "-",
      bg: "bg-blue-200 text-blue-600",
      mainBg: "bg-blue-100",
      tooltip: "All existing vehicles",
    },
    {
      id: "2",
      icon: <Wrench />,
      label: "Under Maintenance",
      total: status?.vehicleStatus?.underMaintenance ?? "-",
      bg: "bg-red-200 text-red-600",
      mainBg: "bg-red-100",
      tooltip: "Vehicles scheduled for maintenance",
    },
    {
      id: "3",
      icon: <CalendarCheck />,
      label: "Scheduled Vehicles",
      total: status?.vehicleStatus?.scheduled ?? "-",
      bg: "bg-purple-200 text-purple-600",
      mainBg: "bg-purple-100",
      tooltip: "Vehicles scheduled for trips today",
    },
    {
      id: "4",
      icon: <CircleCheck />,
      label: "Available Vehicles",
      total: status?.vehicleStatus?.available ?? "-",
      bg: "bg-green-200 text-green-600",
      mainBg: "bg-green-100",
      tooltip: "Vehicles available today",
    },
  ];

  return (
    <div>
      <Title
        title2="Dashboard"
        description="View an overview of applications and vehicles."
      />
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-green-700">
            Vehicle Dashboard Status
          </h2>

          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="cards" className="mb-4">
          <InfoCardContainer title="Applications">
            {trips.map((s) => {
              return (
                <Tooltip key={s.id}>
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
              );
            })}
          </InfoCardContainer>

          <InfoCardContainer title="Vehicles">
            {vehicles.map((s) => (
              <Tooltip key={s.id}>
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
              <VehiclePieChart status={status ?? []} />
            </div>

            <div className="w-full lg:w-[65%]">
              <TripBarChart status={status ?? []} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

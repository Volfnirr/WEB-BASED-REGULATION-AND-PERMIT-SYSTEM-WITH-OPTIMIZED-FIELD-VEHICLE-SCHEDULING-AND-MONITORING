"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive vehicle status pie chart";

const chartConfig = {
  vehicles: {
    label: "Vehicles",
  },

  Available: {
    title: "Available",
    legendLabel: "Available",
    label: "Vehicles available today",
    color: "#6EE7B7",
  },

  Scheduled: {
    title: "Scheduled",
    legendLabel: "Scheduled",
    label: "Vehicles scheduled for trips today",
    color: "#60A5FA",
  },

  Maintenance: {
    title: "Under Maintenance",
    legendLabel: "Maintenance",
    label: "Vehicles under maintenance",
    color: "#FCA5AB",
  },
};

export function VehiclePieChart({ status }) {
  const serviceData = [
    {
      service: "Available",
      data: status?.vehicleStatus?.available ?? 0,
      fill: "#6EE7B7",
    },
    {
      service: "Scheduled",
      data: status?.vehicleStatus?.scheduled ?? 0,
      fill: "#60A5FA",
    },
    {
      service: "Maintenance",
      data: status?.vehicleStatus?.underMaintenance ?? 0,
      fill: "#FCA5AB",
    },
  ];

  const id = "vehicle-pie-interactive";

  const [activeService, setActiveService] = React.useState(
    serviceData[0].service,
  );

  const activeIndex = React.useMemo(
    () => serviceData.findIndex((item) => item.service === activeService),
    [activeService],
  );

  const service = React.useMemo(
    () => serviceData.map((item) => item.service),
    [],
  );

  const renderPieShape = React.useCallback(
    ({ index, outerRadius = 0, ...props }) => {
      if (index === activeIndex) {
        return (
          <g>
            <Sector {...props} outerRadius={outerRadius + 10} />

            <Sector
              {...props}
              outerRadius={outerRadius + 25}
              innerRadius={outerRadius + 12}
            />
          </g>
        );
      }

      return <Sector {...props} outerRadius={outerRadius} />;
    },
    [activeIndex],
  );

  return (
    <Card
      data-chart={id}
      className="flex flex-col h-full border border-green-300"
    >
      <ChartStyle id={id} config={chartConfig} />

      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Vehicles</CardTitle>

          <CardDescription>Vehicle Status</CardDescription>
        </div>

        <Select value={activeService} onValueChange={setActiveService}>
          <SelectTrigger
            className="ml-auto h-7 w-[150px] rounded-lg pl-2.5"
            aria-label="Select a vehicle status"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent align="end" className="rounded-xl">
            {service.map((key) => {
              const config = chartConfig[key];

              if (!config) {
                return null;
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />

                    {config?.title}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <ChartLegend content={<ChartLegendContent nameKey="service" />} />

            <Pie
              data={serviceData}
              dataKey="data"
              nameKey="service"
              innerRadius={60}
              strokeWidth={5}
              shape={renderPieShape}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {serviceData[activeIndex]?.data ?? 0}
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Vehicles
                        </tspan>
                      </text>
                    );
                  }

                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

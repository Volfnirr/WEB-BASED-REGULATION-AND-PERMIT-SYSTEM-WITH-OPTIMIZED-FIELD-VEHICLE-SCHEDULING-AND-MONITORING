"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export const description = "An interactive pie chart";

// const serviceData = [
//   { month: "january", desktop: 186, fill: "var(--color-january)" },
//   { month: "february", desktop: 305, fill: "var(--color-february)" },
//   { month: "march", desktop: 237, fill: "var(--color-march)" },
//   { month: "april", desktop: 173, fill: "var(--color-april)" },
//   { month: "may", desktop: 209, fill: "var(--color-may)" },
// ];

// "status": {
//     "all": {
//       "newApplications": 6,
//       "pending": 10,
//       "approved": 9,
//       "rejected": 6
//     },
// color: "#BFDBFE",
//   },
//   pending: {
//     label: "All Pending applications, including unassigned.",
//     color: "#FFEDD5",
//   },
//   approved: {
//     label: "Approved applications in the past 30 days",
//     color: "#A7F3D0",
//   },
//   rejected: {
//     label: "Rejected applications in the past 30 days",
//     color: "#FECDD3",
const chartConfig = {
  applications: {
    label: "Applications",
  },
  data: {
    label: "Data",
  },
  New: {
    title: "New",
    legendLabel: "New",

    label: "New applications, submitted in the past 7 days",
    color: "#BFDBFE",
  },
  Pending: {
    title: "Pending",
    legendLabel: "Pending",

    label: "All Pending applications, including unassigned.",
    color: "#FFEDD5",
  },
  Approved: {
    title: "Approved",
    legendLabel: "Approved",

    label: "Approved applications in the past 30 days",
    color: "#A7F3D0",
  },
  Rejected: {
    title: "Rejected",
    legendLabel: "Rejected",

    label: "Rejected applications in the past 30 days",
    color: "#FECDD3",
  },
};

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   desktop: {
//     label: "Desktop",
//   },
//   mobile: {
//     label: "Mobile",
//   },
//   january: {
//     label: "January",
//     color: "var(--chart-1)",
//   },
//   february: {
//     label: "February",
//     color: "var(--chart-2)",
//   },
//   march: {
//     label: "March",
//     color: "var(--chart-3)",
//   },
//   april: {
//     label: "April",
//     color: "var(--chart-4)",
//   },
//   may: {
//     label: "May",
//     color: "var(--chart-5)",
//   },
// };

export function ChartPieInteractive({ status }) {
  const serviceData = [
    {
      service: "New",
      data: status?.newApplications,
      fill: "#60A5FA",
    },
    {
      service: "Pending",
      data: status?.pending,
      fill: "#FDBA74",
    },
    { service: "Approved", data: status?.approved, fill: "#6EE7B7" },
    { service: "Rejected", data: status?.rejected, fill: "#FCA5AB" },
  ];

  const id = "pie-interactive";
  const [activeService, setActiveService] = React.useState(
    serviceData[1].service,
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
          <CardTitle>Applications</CardTitle>
          <CardDescription>Application Status</CardDescription>
        </div>
        <Select value={activeService} onValueChange={setActiveService}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
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
                          {serviceData[activeIndex].data}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Applications
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

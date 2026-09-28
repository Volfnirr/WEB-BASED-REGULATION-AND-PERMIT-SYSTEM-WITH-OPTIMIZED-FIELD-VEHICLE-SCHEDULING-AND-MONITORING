"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

// const chartData = [
//   { date: "2024-04-01", approved: 222, rejected: 150 },
//   { date: "2024-04-02", approved: 97, rejected: 180 },
//   { date: "2024-04-03", approved: 167, rejected: 120 },
//   { date: "2024-04-04", approved: 242, rejected: 260 },
//   { date: "2024-04-05", approved: 373, rejected: 290 },
//   { date: "2024-04-06", approved: 301, rejected: 340 },
//   { date: "2024-04-07", approved: 245, rejected: 180 },
//   { date: "2024-04-08", approved: 409, rejected: 320 },
//   { date: "2024-04-09", approved: 59, rejected: 110 },
//   { date: "2024-04-10", approved: 261, rejected: 190 },
//   { date: "2024-04-11", approved: 327, rejected: 350 },
//   { date: "2024-04-12", approved: 292, rejected: 210 },
//   { date: "2024-04-13", approved: 342, rejected: 380 },
//   { date: "2024-04-14", approved: 137, rejected: 220 },
//   { date: "2024-04-15", approved: 120, rejected: 170 },
//   { date: "2024-04-16", approved: 138, rejected: 190 },
//   { date: "2024-04-17", approved: 446, rejected: 360 },
//   { date: "2024-04-18", approved: 364, rejected: 410 },
//   { date: "2024-04-19", approved: 243, rejected: 180 },
//   { date: "2024-04-20", approved: 89, rejected: 150 },
//   { date: "2024-04-21", approved: 137, rejected: 200 },
//   { date: "2024-04-22", approved: 224, rejected: 170 },
//   { date: "2024-04-23", approved: 138, rejected: 230 },
//   { date: "2024-04-24", approved: 387, rejected: 290 },
//   { date: "2024-04-25", approved: 215, rejected: 250 },
//   { date: "2024-04-26", approved: 75, rejected: 130 },
//   { date: "2024-04-27", approved: 383, rejected: 420 },
//   { date: "2024-04-28", approved: 122, rejected: 180 },
//   { date: "2024-04-29", approved: 315, rejected: 240 },
//   { date: "2024-04-30", approved: 454, rejected: 380 },
//   { date: "2024-05-01", approved: 165, rejected: 220 },
//   { date: "2024-05-02", approved: 293, rejected: 310 },
//   { date: "2024-05-03", approved: 247, rejected: 190 },
//   { date: "2024-05-04", approved: 385, rejected: 420 },
//   { date: "2024-05-05", approved: 481, rejected: 390 },
//   { date: "2024-05-06", approved: 498, rejected: 520 },
//   { date: "2024-05-07", approved: 388, rejected: 300 },
//   { date: "2024-05-08", approved: 149, rejected: 210 },
//   { date: "2024-05-09", approved: 227, rejected: 180 },
//   { date: "2024-05-10", approved: 293, rejected: 330 },
//   { date: "2024-05-11", approved: 335, rejected: 270 },
//   { date: "2024-05-12", approved: 197, rejected: 240 },
//   { date: "2024-05-13", approved: 197, rejected: 160 },
//   { date: "2024-05-14", approved: 448, rejected: 490 },
//   { date: "2024-05-15", approved: 473, rejected: 380 },
//   { date: "2024-05-16", approved: 338, rejected: 400 },
//   { date: "2024-05-17", approved: 499, rejected: 420 },
//   { date: "2024-05-18", approved: 315, rejected: 350 },
//   { date: "2024-05-19", approved: 235, rejected: 180 },
//   { date: "2024-05-20", approved: 177, rejected: 230 },
//   { date: "2024-05-21", approved: 82, rejected: 140 },
//   { date: "2024-05-22", approved: 81, rejected: 120 },
//   { date: "2024-05-23", approved: 252, rejected: 290 },
//   { date: "2024-05-24", approved: 294, rejected: 220 },
//   { date: "2024-05-25", approved: 201, rejected: 250 },
//   { date: "2024-05-26", approved: 213, rejected: 170 },
//   { date: "2024-05-27", approved: 420, rejected: 460 },
//   { date: "2024-05-28", approved: 233, rejected: 190 },
//   { date: "2024-05-29", approved: 78, rejected: 130 },
//   { date: "2024-05-30", approved: 340, rejected: 280 },
//   { date: "2024-05-31", approved: 178, rejected: 230 },
//   { date: "2024-06-01", approved: 178, rejected: 200 },
//   { date: "2024-06-02", approved: 470, rejected: 410 },
//   { date: "2024-06-03", approved: 103, rejected: 160 },
//   { date: "2024-06-04", approved: 439, rejected: 380 },
//   { date: "2024-06-05", approved: 88, rejected: 140 },
//   { date: "2024-06-06", approved: 294, rejected: 250 },
//   { date: "2024-06-07", approved: 323, rejected: 370 },
//   { date: "2024-06-08", approved: 385, rejected: 320 },
//   { date: "2024-06-09", approved: 438, rejected: 480 },
//   { date: "2024-06-10", approved: 155, rejected: 200 },
//   { date: "2024-06-11", approved: 92, rejected: 150 },
//   { date: "2024-06-12", approved: 492, rejected: 420 },
//   { date: "2024-06-13", approved: 81, rejected: 130 },
//   { date: "2024-06-14", approved: 426, rejected: 380 },
//   { date: "2024-06-15", approved: 307, rejected: 350 },
//   { date: "2024-06-16", approved: 371, rejected: 310 },
//   { date: "2024-06-17", approved: 475, rejected: 520 },
//   { date: "2024-06-18", approved: 107, rejected: 170 },
//   { date: "2024-06-19", approved: 341, rejected: 290 },
//   { date: "2024-06-20", approved: 408, rejected: 450 },
//   { date: "2024-06-21", approved: 169, rejected: 210 },
//   { date: "2024-06-22", approved: 317, rejected: 270 },
//   { date: "2024-06-23", approved: 480, rejected: 530 },
//   { date: "2024-06-24", approved: 132, rejected: 180 },
//   { date: "2024-06-25", approved: 141, rejected: 190 },
//   { date: "2024-06-26", approved: 434, rejected: 380 },
//   { date: "2024-06-27", approved: 448, rejected: 490 },
//   { date: "2024-06-28", approved: 149, rejected: 200 },
//   { date: "2024-06-29", approved: 103, rejected: 160 },
//   { date: "2024-06-30", approved: 446, rejected: 400 },
// ]

const chartConfig = {
  newApplications: {
    label: "NewApplications",
    color: "#2563EB",
  },
  pending: {
    label: "Pending",
    color: "#7C3AED",
  },
  approved: {
    label: "Approved",
    color: "#16A34A",
  },
  rejected: {
    label: "Rejected",
    color: "#DC2626",
  },
};

export function ChartAreaInteractive({ data }) {
  const [timeRange, setTimeRange] = React.useState("90d");
  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing application activity for the selected period
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient
                id="fillNewApplications"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-newApplications)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-newApplications)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-approved)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-approved)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillRejected" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="newApplications"
              type="natural"
              fill="url(#fillNewApplications)"
              stroke="var(--color-newApplications)"
              stackId="a"
            />

            <Area
              dataKey="pending"
              type="natural"
              fill="url(#fillPending)"
              stroke="var(--color-pending)"
              stackId="a"
            />

            <Area
              dataKey="approved"
              type="natural"
              fill="url(#fillApproved)"
              stroke="var(--color-approved)"
              stackId="a"
            />

            <Area
              dataKey="rejected"
              type="natural"
              fill="url(#fillRejected)"
              stroke="var(--color-rejected)"
              stackId="a"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

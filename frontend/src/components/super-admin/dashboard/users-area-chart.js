"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
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

export const description = "New users per day";

const chartConfig = {
  newUsers: {
    label: "New users",
    color: "#60A5FA",
  },
};

const RANGES = {
  "90d": { days: 90, label: "Last 90 days" },
  "30d": { days: 30, label: "Last 30 days" },
  "7d": { days: 7, label: "Last 7 days" },
};

const formatDay = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export function NewUsersChart({ data = [] }) {
  const [range, setRange] = React.useState("30d");

  const { days, label } = RANGES[range];
  const filteredData = React.useMemo(() => data.slice(-days), [data, days]);
  const total = React.useMemo(
    () => filteredData.reduce((sum, item) => sum + item.newUsers, 0),
    [filteredData],
  );

  return (
    <Card className="pt-0 border border-green-300">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>New Users</CardTitle>
          <CardDescription>
            {total} new {total === 1 ? "user" : "users"} · {label.toLowerCase()}
          </CardDescription>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a time range"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl" align="end">
            {Object.entries(RANGES).map(([key, item]) => (
              <SelectItem key={key} value={key} className="rounded-lg">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillNewUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-newUsers)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-newUsers)"
                  stopOpacity={0.05}
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
              tickFormatter={formatDay}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={formatDay}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="newUsers"
              type="monotone"
              fill="url(#fillNewUsers)"
              stroke="var(--color-newUsers)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

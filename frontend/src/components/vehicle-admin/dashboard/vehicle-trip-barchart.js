"use client";

import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartConfig = {
  totalTrips: {
    label: "All Trips",
    legendLabel: "All Trips",
    color: "#60A5FA",
  },
  monthlyTrips: {
    label: "New Trips (30 Days)",
    legendLabel: "30 Days",
    color: "#6EE7B7",
  },
  newTrips: {
    label: "New Trips (7 Days)",
    legendLabel: "7 Days",
    color: "#FBBF24",
  },
};

export function TripBarChart({ status }) {
  const tripStatus = status?.tripticketStatus ?? {};

  const chartData = [
    {
      category: "Trips",
      totalTrips: tripStatus.totalTrips ?? 0,
      monthlyTrips: tripStatus.monthlyTrips ?? 0,
      newTrips: tripStatus.newTrips ?? 0,
    },
  ];

  return (
    <Card className="h-full border border-green-300">
      <CardHeader>
        <CardTitle>Trip Overview</CardTitle>

        <CardDescription>Overview of current trip activity</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <ChartContainer
            className="h-75 min-w-[500px] w-full"
            config={chartConfig}
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, left: 3, right: 3, bottom: 5 }}
              barCategoryGap={5}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={2}
                axisLine={false}
                interval={0}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />

              <ChartLegend content={<ChartLegendContent />} />

              <Bar
                dataKey="totalTrips"
                fill="var(--color-totalTrips)"
                radius={2}
                barSize={60}
              >
                <LabelList
                  dataKey="totalTrips"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>

              <Bar
                dataKey="monthlyTrips"
                fill="var(--color-monthlyTrips)"
                radius={2}
                barSize={60}
              >
                <LabelList
                  dataKey="monthlyTrips"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>

              <Bar
                dataKey="newTrips"
                fill="var(--color-newTrips)"
                radius={2}
                barSize={60}
              >
                <LabelList
                  dataKey="newTrips"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

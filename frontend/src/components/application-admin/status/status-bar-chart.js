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
} from "@/components/ui/chart";

const chartConfig = {
  approved: {
    label: "Approved",
    color: "#6EE7B7",
  },
  rejected: {
    label: "Rejected",
    color: "#FCA5AB",
  },
  pending: {
    label: "Pending",
    color: "#FDBA74",
  },
};

export function AssignedStatusOverview({ status }) {
  const chartData = [
    {
      status: "Approved",
      approved: status?.approved ?? 0,
    },
    {
      status: "Rejected",
      rejected: status?.rejected ?? 0,
    },
    {
      status: "Pending",
      pending: status?.pending ?? 0,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Applications by Status</CardTitle>

        <CardDescription>
          Applications currently assigned to you
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 25,
              right: 10,
              left: 10,
              bottom: 5,
            }}
            barCategoryGap={35}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar
              dataKey="approved"
              fill="var(--color-approved)"
              radius={[5, 5, 0, 0]}
              barSize={55}
            >
              <LabelList
                dataKey="approved"
                position="top"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>

            <Bar
              dataKey="rejected"
              fill="var(--color-rejected)"
              radius={[5, 5, 0, 0]}
              barSize={55}
            >
              <LabelList
                dataKey="rejected"
                position="top"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>

            <Bar
              dataKey="pending"
              fill="var(--color-pending)"
              radius={[5, 5, 0, 0]}
              barSize={55}
            >
              <LabelList
                dataKey="pending"
                position="top"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

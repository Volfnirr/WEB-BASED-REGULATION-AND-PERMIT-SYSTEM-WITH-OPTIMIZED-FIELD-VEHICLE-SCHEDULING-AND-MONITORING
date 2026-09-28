"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export const description = "A multiple bar chart";

const chartConfig = {
  newApplications: {
    label: "New applications, submitted in the past 7 days",
    legendLabel: "New Applications",
    color: "#60A5FA",
  },
  pending: {
    label: "All Pending applications, including unassigned.",
    legendLabel: "Pending",
    color: "#FDBA74",
  },
  approved: {
    label: "Approved applications in the past 30 days",
    legendLabel: "Approved",
    color: "#6EE7B7",
  },
  rejected: {
    label: "Rejected applications in the past 30 days",
    legendLabel: "Rejected",
    color: "#FCA5AB",
  },
  //   desktop: {
  //     label: "Desktop",
  //     color: "var(--chart-1)",
  //   },
  //   mobile: {
  //     label: "Mobile",
  //     color: "var(--chart-2)",
  //   },
};
const serviceLabels = {
  "Agricultural Free Patent": "Agricultural",
  "Residential Free Patent": "Residential",
  "Tree Cutting Permit": "Tree Cutting",
  "Chainsaw Registration": "Chainsaw",
};

export function DashboardChartBarMultiple({ status }) {
  const chartData = [
    {
      service: "Agricultural Free Patent",
      newApplications: status?.agri?.newApplications ?? 0,
      pending: status?.agri?.pending ?? 0,
      approved: status?.agri?.approved ?? 0,
      rejected: status?.agri?.rejected ?? 0,
    },
    {
      service: "Residential Free Patent",
      newApplications: status?.resi?.newApplications ?? 0,
      pending: status?.resi?.pending ?? 0,
      approved: status?.resi?.approved ?? 0,
      rejected: status?.resi?.rejected ?? 0,
    },
    {
      service: "Tree Cutting Permit",
      newApplications: status?.tree?.newApplications ?? 0,
      pending: status?.tree?.pending ?? 0,
      approved: status?.tree?.approved ?? 0,
      rejected: status?.tree?.rejected ?? 0,
    },
    {
      service: "Chainsaw Registration",
      newApplications: status?.chainsaw?.newApplications ?? 0,
      pending: status?.chainsaw?.pending ?? 0,
      approved: status?.chainsaw?.approved ?? 0,
      rejected: status?.chainsaw?.rejected ?? 0,
    },
  ];

  return (
    <Card className="h-full border border-green-300">
      <CardHeader>
        <CardTitle>Applications by Service</CardTitle>
        <CardDescription>Applications across all services</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <ChartContainer
            className="h-75 min-w-[600px] w-full"
            config={chartConfig}
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 8, right: 8 }}
              barCategoryGap={20}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="service"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tickFormatter={(value) => serviceLabels[value] || value}
                interval={0}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <ChartLegend content={<ChartLegendContent />} />

              <Bar
                dataKey="newApplications"
                fill="var(--color-newApplications)"
                radius={4}
              >
                <LabelList
                  dataKey="newApplications"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>

              <Bar dataKey="pending" fill="var(--color-pending)" radius={4}>
                <LabelList
                  dataKey="pending"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>

              <Bar dataKey="approved" fill="var(--color-approved)" radius={4}>
                <LabelList
                  dataKey="approved"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>

              <Bar dataKey="rejected" fill="var(--color-rejected)" radius={4}>
                <LabelList
                  dataKey="rejected"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">New</span> · Past 7 days
        </span>

        <span>
          <span className="font-medium text-foreground">Pending</span> · All
          pending
        </span>

        <span>
          <span className="font-medium text-foreground">Approved</span> · Past
          30 days
        </span>

        <span>
          <span className="font-medium text-foreground">Rejected</span> · Past
          30 days
        </span>
      </CardFooter>
    </Card>
  );
}

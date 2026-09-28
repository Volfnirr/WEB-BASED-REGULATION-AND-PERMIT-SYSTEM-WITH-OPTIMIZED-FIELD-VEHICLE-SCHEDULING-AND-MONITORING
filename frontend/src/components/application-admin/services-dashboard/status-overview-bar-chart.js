"use client";

import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";

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

export const description = "Today's applications by status";

const chartConfig = {
  newApplications: {
    label: "New applications today",
    legendLabel: "New Applications",
    color: "#60A5FA",
  },
  awaitingAssignment: {
    label: "Applications awaiting assignment (all time)",
    legendLabel: "Unassigned",
    color: "#FBBF24",
  },
  pendingReview: {
    label: "Assigned applications pending review (all time)",
    legendLabel: "Pending Review",
    color: "#FDBA74",
  },
  approved: {
    label: "Approved applications today",
    legendLabel: "Approved",
    color: "#6EE7B7",
  },
  rejected: {
    label: "Rejected applications today",
    legendLabel: "Rejected",
    color: "#FCA5AB",
  },
};

export function StatusOverview({ status }) {
  const chartData = [
    {
      category: "Today",
      newApplications: status?.today?.newApplications ?? 0,
      approved: status?.today?.approved ?? 0,
      rejected: status?.today?.rejected ?? 0,
    },
    {
      category: "All Time",
      awaitingAssignment: status?.today?.awaitingAssignment ?? 0,
      pendingReview: status?.today?.pendingReview ?? 0,
    },
  ];

  return (
    <Card className="h-full border border-green-300">
      <CardHeader>
        <CardTitle>Applications Overview</CardTitle>
        <CardDescription>
          Snapshot of today's activity and all-time application status
        </CardDescription>
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
                dataKey="newApplications"
                fill="var(--color-newApplications)"
                radius={2}
                barSize={60}
              >
                <LabelList
                  dataKey="newApplications"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>

              <Bar
                dataKey="awaitingAssignment"
                fill="var(--color-awaitingAssignment)"
                radius={2}
                barSize={60}
              >
                <LabelList
                  dataKey="awaitingAssignment"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>

              <Bar
                dataKey="pendingReview"
                fill="var(--color-pendingReview)"
                radius={2}
                barSize={60}
              >
                <LabelList
                  dataKey="pendingReview"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>

              <Bar
                dataKey="approved"
                fill="var(--color-approved)"
                radius={2}
                barSize={60}
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
                radius={2}
                barSize={60}
              >
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
          <span className="font-medium text-foreground">New</span> · Today
        </span>
        <span>
          <span className="font-medium text-foreground">Approved</span> · Today
        </span>
        <span>
          <span className="font-medium text-foreground">Rejected</span> · Today
        </span>
        <span>
          <span className="font-medium text-foreground">Unassigned</span> · All
          time
        </span>
        <span>
          <span className="font-medium text-foreground">Pending Review</span> ·
          All time
        </span>
      </CardFooter>
    </Card>
  );
}

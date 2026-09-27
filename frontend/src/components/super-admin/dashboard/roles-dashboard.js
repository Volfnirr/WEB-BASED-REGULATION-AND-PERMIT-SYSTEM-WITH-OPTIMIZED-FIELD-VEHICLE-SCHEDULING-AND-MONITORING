"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
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
} from "@/components/ui/chart";

export const description = "User accounts by role";

const chartConfig = {
  count: {
    label: "Accounts",
  },
  applicant: {
    label: "Applicant",
    color: "#6EE7B7",
  },
  applicationAdmin: {
    label: "Application Admin",
    color: "#C4B5FD",
  },
  vehicleAdmin: {
    label: "Vehicle Admin",
    color: "#FDBA74",
  },
  superAdmin: {
    label: "Super Admin",
    color: "#FCA5AB",
  },
};

export function RolesOverview({ users }) {
  const roles = [
    { role: "applicant", count: users?.applicant ?? 0 },
    { role: "applicationAdmin", count: users?.applicationAdmin ?? 0 },
    { role: "vehicleAdmin", count: users?.vehicleAdmin ?? 0 },
    { role: "superAdmin", count: users?.superAdmin ?? 0 },
  ];

  const total = roles.reduce((sum, item) => sum + item.count, 0);

  const chartData = roles
    .map((item) => ({
      ...item,
      fill: `var(--color-${item.role})`,
      display: `${item.count} (${
        total > 0 ? Math.round((item.count / total) * 100) : 0
      }%)`,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="h-full border border-green-300">
      <CardHeader>
        <CardTitle>Accounts by Role</CardTitle>
        <CardDescription>How accounts are split across roles</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-64 w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ top: 5, left: 0, right: 70, bottom: 5 }}
            barCategoryGap={12}
          >
            <CartesianGrid horizontal={false} />

            <XAxis type="number" dataKey="count" hide />
            <YAxis
              type="category"
              dataKey="role"
              width={130}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => chartConfig[value]?.label ?? value}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="role" />}
            />

            <Bar dataKey="count" radius={4} barSize={32}>
              <LabelList
                dataKey="display"
                position="right"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">Total accounts</span> ·{" "}
          {total}
        </span>
      </CardFooter>
    </Card>
  );
}

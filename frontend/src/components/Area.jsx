"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { useState } from "react";
import { Select, SelectItem } from "./Select";
const criteria = ["أسبوعيًا", "شهريًا", "سنويًا"];
const WeeklyData = [
  { day: "Saturday", desktop: 186 },
  { day: "Sunday", desktop: 305 },
  { day: "Monday", desktop: 237 },
  { day: "Tuesday", desktop: 73 },
  { day: "Wednesday", desktop: 209 },
  { day: "Thursday", desktop: 214 },
  { day: "Friday", desktop: 500 },
];
const MonthlyData = [
  { week: "Week 1", desktop: 284 },
  { week: "Week 2", desktop: 421 },
  { week: "Week 3", desktop: 376 },
  { week: "Week 4", desktop: 512 },
];
const YearlyData = [
  { month: "January", desktop: 872 },
  { month: "February", desktop: 765 },
  { month: "March", desktop: 921 },
  { month: "April", desktop: 543 },
  { month: "May", desktop: 678 },
  { month: "June", desktop: 1234 },
  { month: "July", desktop: 1234 },
  { month: "August", desktop: 1234 },
  { month: "September", desktop: 1234 },
  { month: "October", desktop: 1234 },
  { month: "November", desktop: 1234 },
  { month: "December", desktop: 1234 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#f25f3a",
  },
  mobile: {
    label: "Mobile",
    color: "#f25f3a",
  },
};

export function Chart() {
  const [barCriteria, setBarCriteria] = useState("أسبوعيًا");
  const [timeRange, setTimeRange] = useState("90d");
  const filteredData = YearlyData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
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
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
        <Select
          className="w-1/3"
          onValueChange={setBarCriteria}
          value={barCriteria}
        >
          {criteria.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={
              barCriteria === "أسبوعيًا"
                ? WeeklyData
                : barCriteria === "شهريًا"
                ? MonthlyData
                : YearlyData
            }
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={
                barCriteria === "أسبوعيًا"
                  ? "day"
                  : barCriteria === "شهريًا"
                  ? "week"
                  : "month"
              }
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12,
                fontWeight: 500,
              }}
              tickFormatter={(value) =>
                barCriteria === "سنويًا"
                  ? ` ${value.split(" ")[0]}`
                  : barCriteria === "أسبوعيًا"
                  ? ` ${value.split(" ")[0]}`
                  : ` Week ${value.split(" ")[1]}`
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

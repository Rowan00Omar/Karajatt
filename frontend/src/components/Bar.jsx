"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Select, SelectItem } from "./Select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
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
    color: "#4a60e9",
  },
};
export function Chart() {
  const [barCriteria, setBarCriteria] = useState("أسبوعيًا");
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
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
          <BarChart
            accessibilityLayer
            data={
              barCriteria === "أسبوعيًا"
                ? WeeklyData
                : barCriteria === "شهريًا"
                ? MonthlyData
                : YearlyData
            }
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="desktop"
              fill="var(--color-desktop)"
              radius={[8, 8, 0, 0]} // Rounded top corners only
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

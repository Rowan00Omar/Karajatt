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
  ChartConfig,
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
import { Item } from "@radix-ui/react-select";
const chartData = [
  { date: "2024-04-01", مبيعات: 222 },
  { date: "2024-04-02", مبيعات: 97 },
  { date: "2024-04-03", مبيعات: 167 },
  { date: "2024-04-04", مبيعات: 242 },
  { date: "2024-04-05", مبيعات: 373 },
  { date: "2024-04-06", مبيعات: 301 },
  { date: "2024-04-07", مبيعات: 245 },
  { date: "2024-04-08", مبيعات: 409 },
  { date: "2024-04-09", مبيعات: 59 },
  { date: "2024-04-10", مبيعات: 261 },
  { date: "2024-04-11", مبيعات: 327 },
  { date: "2024-04-12", مبيعات: 292 },
  { date: "2024-04-13", مبيعات: 342 },
  { date: "2024-04-14", مبيعات: 137 },
  { date: "2024-04-15", مبيعات: 120 },
  { date: "2024-04-16", مبيعات: 138 },
  { date: "2024-04-17", مبيعات: 446 },
  { date: "2024-04-18", مبيعات: 364 },
  { date: "2024-04-19", مبيعات: 243 },
  { date: "2024-04-20", مبيعات: 89 },
  { date: "2024-04-21", مبيعات: 137 },
  { date: "2024-04-22", مبيعات: 224 },
  { date: "2024-04-23", مبيعات: 138 },
  { date: "2024-04-24", مبيعات: 387 },
  { date: "2024-04-25", مبيعات: 215 },
  { date: "2024-04-26", مبيعات: 75 },
  { date: "2024-04-27", مبيعات: 383 },
  { date: "2024-04-28", مبيعات: 122 },
  { date: "2024-04-29", مبيعات: 315 },
  { date: "2024-04-30", مبيعات: 454 },
  { date: "2024-05-01", مبيعات: 165 },
  { date: "2024-05-02", مبيعات: 293 },
  { date: "2024-05-03", مبيعات: 247 },
  { date: "2024-05-04", مبيعات: 385 },
  { date: "2024-05-05", مبيعات: 481 },
  { date: "2024-05-06", مبيعات: 498 },
  { date: "2024-05-07", مبيعات: 388 },
  { date: "2024-05-08", مبيعات: 149 },
  { date: "2024-05-09", مبيعات: 227 },
  { date: "2024-05-10", مبيعات: 293 },
  { date: "2024-05-11", مبيعات: 335 },
  { date: "2024-05-12", مبيعات: 197 },
  { date: "2024-05-13", مبيعات: 197 },
  { date: "2024-05-14", مبيعات: 448 },
  { date: "2024-05-15", مبيعات: 473 },
  { date: "2024-05-16", مبيعات: 338 },
  { date: "2024-05-17", مبيعات: 499 },
  { date: "2024-05-18", مبيعات: 315 },
  { date: "2024-05-19", مبيعات: 235 },
  { date: "2024-05-20", مبيعات: 177 },
  { date: "2024-05-21", مبيعات: 82 },
  { date: "2024-05-22", مبيعات: 81 },
  { date: "2024-05-23", مبيعات: 252 },
  { date: "2024-05-24", مبيعات: 294 },
  { date: "2024-05-25", مبيعات: 201 },
  { date: "2024-05-26", مبيعات: 213 },
  { date: "2024-05-27", مبيعات: 420 },
  { date: "2024-05-28", مبيعات: 233 },
  { date: "2024-05-29", مبيعات: 78 },
  { date: "2024-05-30", مبيعات: 340 },
  { date: "2024-05-31", مبيعات: 178 },
  { date: "2024-06-01", مبيعات: 178 },
  { date: "2024-06-02", مبيعات: 470 },
  { date: "2024-06-03", مبيعات: 103 },
  { date: "2024-06-04", مبيعات: 439 },
  { date: "2024-06-05", مبيعات: 88 },
  { date: "2024-06-06", مبيعات: 294 },
  { date: "2024-06-07", مبيعات: 323 },
  { date: "2024-06-08", مبيعات: 385 },
  { date: "2024-06-09", مبيعات: 438 },
  { date: "2024-06-10", مبيعات: 155 },
  { date: "2024-06-11", مبيعات: 92 },
  { date: "2024-06-12", مبيعات: 492 },
  { date: "2024-06-13", مبيعات: 81 },
  { date: "2024-06-14", مبيعات: 426 },
  { date: "2024-06-15", مبيعات: 307 },
  { date: "2024-06-16", مبيعات: 371 },
  { date: "2024-06-17", مبيعات: 475 },
  { date: "2024-06-18", مبيعات: 107 },
  { date: "2024-06-19", مبيعات: 341 },
  { date: "2024-06-20", مبيعات: 408 },
  { date: "2024-06-21", مبيعات: 169 },
  { date: "2024-06-22", مبيعات: 317 },
  { date: "2024-06-23", مبيعات: 480 },
  { date: "2024-06-24", مبيعات: 132 },
  { date: "2024-06-25", مبيعات: 141 },
  { date: "2024-06-26", مبيعات: 434 },
  { date: "2024-06-27", مبيعات: 448 },
  { date: "2024-06-28", مبيعات: 149 },
  { date: "2024-06-29", مبيعات: 103 },
  { date: "2024-06-30", مبيعات: 446 },
];
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

export function Chart() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const getFilteredData = (range) => {
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;

    if (range === "30d") {
      daysToSubtract = 30;
    } else if (range === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  };

  const filteredData = getFilteredData(timeRange);

  const totalSales = filteredData.reduce(
    (sum, item) => sum + (item?.مبيعات || 0),
    0
  );

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>اجمالي المبيعات</CardTitle>
          <CardDescription>{totalSales} ريال</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="اخر ثلاث شهور" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              اخر ثلاث شهور
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              اخر ثلاثون يوما
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              اخر سبعة ايام
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
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
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
              cursor={false}
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
              dataKey="مبيعات"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
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

const registrationsData = {
  weekly: [
    { day: "السبت", value: 25 },
    { day: "الأحد", value: 32 },
    { day: "الإثنين", value: 28 },
    { day: "الثلاثاء", value: 35 },
    { day: "الأربعاء", value: 30 },
    { day: "الخميس", value: 40 },
    { day: "الجمعة", value: 45 },
  ],
  monthly: [
    { week: "الأسبوع 1", value: 120 },
    { week: "الأسبوع 2", value: 145 },
    { week: "الأسبوع 3", value: 160 },
    { week: "الأسبوع 4", value: 180 },
  ],
  yearly: [
    { month: "يناير", value: 520 },
    { month: "فبراير", value: 480 },
    { month: "مارس", value: 550 },
    { month: "أبريل", value: 600 },
    { month: "مايو", value: 580 },
    { month: "يونيو", value: 620 },
    { month: "يوليو", value: 670 },
    { month: "أغسطس", value: 700 },
    { month: "سبتمبر", value: 750 },
    { month: "أكتوبر", value: 780 },
    { month: "نوفمبر", value: 820 },
    { month: "ديسمبر", value: 850 },
  ],
};

const visitsData = {
  weekly: [
    { day: "السبت", value: 1200 },
    { day: "الأحد", value: 1500 },
    { day: "الإثنين", value: 1350 },
    { day: "الثلاثاء", value: 1400 },
    { day: "الأربعاء", value: 1600 },
    { day: "الخميس", value: 1800 },
    { day: "الجمعة", value: 2000 },
  ],
  monthly: [
    { week: "الأسبوع 1", value: 5500 },
    { week: "الأسبوع 2", value: 6000 },
    { week: "الأسبوع 3", value: 6500 },
    { week: "الأسبوع 4", value: 7000 },
  ],
  yearly: [
    { month: "يناير", value: 22000 },
    { month: "فبراير", value: 24000 },
    { month: "مارس", value: 25000 },
    { month: "أبريل", value: 26000 },
    { month: "مايو", value: 27000 },
    { month: "يونيو", value: 28000 },
    { month: "يوليو", value: 29000 },
    { month: "أغسطس", value: 30000 },
    { month: "سبتمبر", value: 31000 },
    { month: "أكتوبر", value: 32000 },
    { month: "نوفمبر", value: 33000 },
    { month: "ديسمبر", value: 34000 },
  ],
};

const chartConfig = {
  value: {
    label: "القيمة",
    color: "#4a60e9",
  },
};

export function Chart({ type = "registrations", data = [] }) {
  const [timeRange, setTimeRange] = useState("أسبوعيًا");
  const title = type === "registrations" ? "التسجيلات الجديدة" : "عدد الزيارات";

  const getCurrentData = () => {
    // Filter data based on time range
    const now = new Date();
    const filtered = data.filter((item) => {
      const date = new Date(item.name);
      if (timeRange === "أسبوعيًا") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
      } else if (timeRange === "شهريًا") {
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        return date >= monthAgo;
      } else if (timeRange === "سنويًا") {
        const yearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        return date >= yearAgo;
      }
      return true;
    });

    // Group data based on time range
    const grouped = filtered.reduce((acc, item) => {
      const date = new Date(item.name);
      let key;

      if (timeRange === "أسبوعيًا") {
        key = date.toLocaleDateString("ar-SA", { weekday: "long" });
      } else if (timeRange === "شهريًا") {
        key = `الأسبوع ${Math.ceil(date.getDate() / 7)}`;
      } else {
        key = date.toLocaleDateString("ar-SA", { month: "long" });
      }

      if (!acc[key]) {
        acc[key] = { name: key, value: 0 };
      }
      acc[key].value += item.value;
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const getGrowthRate = () => {
    if (!data || data.length < 2) return "0%";

    const currentPeriod = data.slice(-1)[0]?.value || 0;
    const previousPeriod = data.slice(-2)[0]?.value || 0;

    if (previousPeriod === 0) return "0%";

    const growth = ((currentPeriod - previousPeriod) / previousPeriod) * 100;
    return `${growth.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-right">{title}</CardTitle>
        <Select className="w-32" onValueChange={setTimeRange} value={timeRange}>
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
            data={getCurrentData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg bg-white p-2 shadow-md">
                      <p className="text-sm font-medium">
                        {payload[0].payload.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="value"
              fill="var(--color-desktop)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-right w-full">
          <TrendingUp className="h-4 w-4" />
          زيادة بنسبة {getGrowthRate()} عن{" "}
          {timeRange === "أسبوعيًا"
            ? "الأسبوع"
            : timeRange === "شهريًا"
            ? "الشهر"
            : "العام"}{" "}
          السابق
        </div>
      </CardFooter>
    </Card>
  );
}

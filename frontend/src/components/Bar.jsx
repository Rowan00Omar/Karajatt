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
    { day: "الجمعة", value: 45 }
  ],
  monthly: [
    { week: "الأسبوع 1", value: 120 },
    { week: "الأسبوع 2", value: 145 },
    { week: "الأسبوع 3", value: 160 },
    { week: "الأسبوع 4", value: 180 }
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
    { month: "ديسمبر", value: 850 }
  ]
};

const visitsData = {
  weekly: [
    { day: "السبت", value: 1200 },
    { day: "الأحد", value: 1500 },
    { day: "الإثنين", value: 1350 },
    { day: "الثلاثاء", value: 1400 },
    { day: "الأربعاء", value: 1600 },
    { day: "الخميس", value: 1800 },
    { day: "الجمعة", value: 2000 }
  ],
  monthly: [
    { week: "الأسبوع 1", value: 5500 },
    { week: "الأسبوع 2", value: 6000 },
    { week: "الأسبوع 3", value: 6500 },
    { week: "الأسبوع 4", value: 7000 }
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
    { month: "ديسمبر", value: 34000 }
  ]
};

const chartConfig = {
  value: {
    label: "القيمة",
    color: "#4a60e9"
  }
};

export function Chart({ type = "registrations" }) {
  const [timeRange, setTimeRange] = useState("أسبوعيًا");
  const data = type === "registrations" ? registrationsData : visitsData;
  const title = type === "registrations" ? "التسجيلات الجديدة" : "عدد الزيارات";
  
  const getCurrentData = () => {
    switch(timeRange) {
      case "أسبوعيًا":
        return data.weekly;
      case "شهريًا":
        return data.monthly;
      case "سنويًا":
        return data.yearly;
      default:
        return data.weekly;
    }
  };

  const getXAxisKey = () => {
    switch(timeRange) {
      case "أسبوعيًا":
        return "day";
      case "شهريًا":
        return "week";
      case "سنويًا":
        return "month";
      default:
        return "day";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-right">{title}</CardTitle>
        <Select
          className="w-32"
          onValueChange={setTimeRange}
          value={timeRange}
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
            data={getCurrentData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={getXAxisKey()}
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
                      <p className="text-sm font-medium">{payload[0].payload[getXAxisKey()]}</p>
                      <p className="text-xs text-muted-foreground">{payload[0].value}</p>
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
          زيادة بنسبة {type === "registrations" ? "15.2" : "8.5"}% عن {
            timeRange === "أسبوعيًا" ? "الأسبوع" :
            timeRange === "شهريًا" ? "الشهر" : "العام"
          } السابق
        </div>
      </CardFooter>
    </Card>
  );
}

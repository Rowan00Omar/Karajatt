"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

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

const salesData = {
  weekly: [
    { date: "2024-04-21", مبيعات: 12500 },
    { date: "2024-04-22", مبيعات: 13200 },
    { date: "2024-04-23", مبيعات: 14800 },
    { date: "2024-04-24", مبيعات: 15500 },
    { date: "2024-04-25", مبيعات: 16200 },
    { date: "2024-04-26", مبيعات: 17800 },
    { date: "2024-04-27", مبيعات: 18500 }
  ],
  monthly: [
    { date: "2024-01-01", مبيعات: 45000 },
    { date: "2024-02-01", مبيعات: 48000 },
    { date: "2024-03-01", مبيعات: 52000 },
    { date: "2024-04-01", مبيعات: 55000 }
  ],
  yearly: [
    { date: "2023-01-01", مبيعات: 520000 },
    { date: "2023-04-01", مبيعات: 580000 },
    { date: "2023-07-01", مبيعات: 620000 },
    { date: "2023-10-01", مبيعات: 680000 },
    { date: "2024-01-01", مبيعات: 720000 },
    { date: "2024-04-01", مبيعات: 780000 }
  ]
};

const chartConfig = {
  مبيعات: {
    label: "المبيعات",
    color: "#4a60e9"
  }
};

export function Chart() {
  const [timeRange, setTimeRange] = React.useState("7d");

  const getCurrentData = () => {
    switch(timeRange) {
      case "7d":
        return salesData.weekly;
      case "30d":
        return salesData.monthly;
      case "90d":
        return salesData.yearly;
      default:
        return salesData.weekly;
    }
  };

  const totalSales = React.useMemo(() => {
    const data = getCurrentData();
    return data[data.length - 1].مبيعات.toLocaleString('ar-SA');
  }, [timeRange]);

  const formatDate = (date) => {
    const d = new Date(date);
    if (timeRange === "90d") {
      return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short' });
    } else if (timeRange === "30d") {
      return d.toLocaleDateString('ar-SA', { month: 'short' });
    }
    return d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-right">
          <CardTitle>إجمالي المبيعات</CardTitle>
          <CardDescription>{totalSales} ريال</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="اختر الفترة الزمنية"
          >
            <SelectValue placeholder="اختر الفترة" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d" className="rounded-lg">
              آخر 7 أيام
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              آخر 30 يوم
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              آخر 3 أشهر
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={getCurrentData()}>
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4a60e9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4a60e9" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatDate}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString('ar-SA')}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg bg-white p-2 shadow-md text-right">
                      <p className="text-sm font-medium">
                        {formatDate(payload[0].payload.date)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payload[0].value.toLocaleString('ar-SA')} ريال
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="مبيعات"
              stroke="#4a60e9"
              fill="url(#fillSales)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

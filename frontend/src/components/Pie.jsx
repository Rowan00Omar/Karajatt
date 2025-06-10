"use client";

import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

const CustomTooltipContent = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white p-2 shadow-md">
        <p className="text-sm font-medium text-right">{payload[0].name}</p>
        <p className="text-xs text-muted-foreground text-right">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const chartConfig = {
  value: {
    label: "القيمة",
    color: "#4a60e9",
  },
};

const colors = ["#4a60e9", "#6577ed", "#8089f1", "#9ba4f5", "#b6bcf9"];

export function Chart({ type = "mostSold", data = [] }) {
  const title = type === "mostSold" ? "أكثر القطع مبيعًا" : "أكثر القطع بحثًا";

  // Add fill colors to the data
  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-right w-full">{title}</CardTitle>
        <CardDescription className="text-right w-full">
          آخر 30 يوم
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] px-0"
        >
          <PieChart>
            <ChartTooltip content={<CustomTooltipContent />} />
            <Pie
              data={dataWithColors}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
            >
              {dataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 space-y-1">
          {dataWithColors.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span>{item.name}</span>
              </div>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-right w-full">
          <TrendingUp className="h-4 w-4" />
          زيادة بنسبة 5.2% عن الشهر السابق
        </div>
      </CardFooter>
    </Card>
  );
}

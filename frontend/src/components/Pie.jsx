"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "#fdece7" },
  { browser: "safari", visitors: 200, fill: "#e1e5fc" },
  { browser: "firefox", visitors: 187, fill: "#3f53d3" },
  { browser: "edge", visitors: 173, fill: "#f25f3a" },
  { browser: "other", visitors: 90, fill: "#4a60e9" },
];

const chartConfig = {
  chrome: "كرونة",
  safari: "كبوت",
  firefox: "بيضة التعليق",
  edge: "تمارين البواصي",
  other: "قير مانيوال",
};

const CustomTooltipContent = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-sm">
        <p className="font-medium">{chartConfig[data.browser]}</p>
      </div>
    );
  }
  return null;
};

export function Chart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>توزيع المتصفحات</CardTitle>
        <CardDescription>يناير - يونيو ٢٠٢٤</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] px-0"
        >
          <PieChart>
            <ChartTooltip content={<CustomTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                    fontSize={12}
                  >
                    {payload.visitors}
                  </text>
                );
              }}
              nameKey="browser"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          زيادة بنسبة 5.2% هذا الشهر <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          إجمالي الزوار خلال آخر 6 أشهر
        </div>
      </CardFooter>
    </Card>
  );
}

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
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

const mostSoldData = [
  { name: "قميص رجالي", value: 540, fill: "#4a60e9" },
  { name: "فستان نسائي", value: 420, fill: "#6577ed" },
  { name: "حذاء رياضي", value: 380, fill: "#8089f1" },
  { name: "بنطلون جينز", value: 320, fill: "#9ba4f5" },
  { name: "حقيبة يد", value: 280, fill: "#b6bcf9" }
];

const mostSearchedData = [
  { name: "فساتين", value: 890, fill: "#4a60e9" },
  { name: "أحذية رياضية", value: 750, fill: "#6577ed" },
  { name: "جينز", value: 620, fill: "#8089f1" },
  { name: "قمصان", value: 580, fill: "#9ba4f5" },
  { name: "حقائب", value: 450, fill: "#b6bcf9" }
];

const CustomTooltipContent = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white p-2 shadow-md">
        <p className="text-sm font-medium text-right">{payload[0].name}</p>
        <p className="text-xs text-muted-foreground text-right">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const chartConfig = {
  value: {
    label: "القيمة",
    color: "#4a60e9"
  }
};

export function Chart({ type = "mostSold" }) {
  const data = type === "mostSold" ? mostSoldData : mostSearchedData;
  const title = type === "mostSold" ? "أكثر القطع مبيعًا" : "أكثر القطع بحثًا";
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-right w-full">{title}</CardTitle>
        <CardDescription className="text-right w-full">آخر 30 يوم</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] px-0">
          <PieChart>
            <ChartTooltip content={<CustomTooltipContent />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 space-y-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
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

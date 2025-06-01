import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminSectionCard({ title, value, trend, description }) {
  const isPositive = trend?.startsWith('+');
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground text-right">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 justify-end">
          <span className="flex items-center text-sm font-medium text-right">
            {isPositive ? (
              <span className="text-green-500 flex items-center">
                <TrendingUp className="mr-1 h-4 w-4" />
                {trend}
              </span>
            ) : (
              <span className="text-red-500 flex items-center">
                <TrendingDown className="mr-1 h-4 w-4" />
                {trend}
              </span>
            )}
          </span>
          <span className="text-2xl font-bold">{value}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-right">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

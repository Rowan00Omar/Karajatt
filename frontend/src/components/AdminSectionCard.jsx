import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminSectionCard() {
  return (
    <Card className="w-1/2 items-center max-w-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">$1,250.00</span>
          <span className="flex items-center text-sm font-medium text-green-500">
            <TrendingUp className="mr-1 h-4 w-4" />
            +12.5%
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingDown className="h-3 w-3" />
          <span>Trending up this month</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Visitors for the last 6 months
        </p>
      </CardContent>
    </Card>
  );
}

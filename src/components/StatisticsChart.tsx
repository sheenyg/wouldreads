import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const chartData = [
  { category: "Unspecified", count: 292057, percentage: 73.2836 },
  { category: "file-diff", count: 62613, percentage: 15.711 },
  { category: "repository", count: 19330, percentage: 4.8503 },
  { category: "snippet", count: 12976, percentage: 3.256 },
  { category: "file", count: 6280, percentage: 1.5758 },
  { category: "text", count: 2890, percentage: 0.7252 },
  { category: "symbol", count: 749, percentage: 0.1879 },
  { category: "pull-request", count: 657, percentage: 0.1649 },
  { category: "thread-scoped-file", count: 454, percentage: 0.1139 },
  { category: "job", count: 268, percentage: 0.0672 },
  { category: "issue", count: 254, percentage: 0.0637 },
  { category: "discussion", count: 2, percentage: 0.0005 },
]

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
}

export function StatisticsChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Content Type Statistics</CardTitle>
        <CardDescription>Distribution of content types by count and percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45}
              textAnchor="end"
              height={120}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value, name, item) => (
                    <>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">{item.payload.category}</span>
                        <span>Count: {value.toLocaleString()}</span>
                        <span>Percentage: {item.payload.percentage}%</span>
                      </div>
                    </>
                  )}
                />
              }
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

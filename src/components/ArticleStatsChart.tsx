import { Article } from "@/lib/types"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Label } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart"

interface ArticleStatsChartProps {
  articles: Article[]
}

// Chart color constants for consistency across charts
const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted-foreground))",
} as const

export function ArticleStatsChart({ articles }: ArticleStatsChartProps) {
  if (articles.length === 0) {
    return null
  }

  // Calculate read vs unread stats
  const readCount = articles.filter(a => a.isRead).length
  const unreadCount = articles.filter(a => !a.isRead).length
  
  const readStats = [
    { status: 'read', value: readCount, fill: 'var(--color-read)' },
    { status: 'unread', value: unreadCount, fill: 'var(--color-unread)' }
  ]

  const readChartConfig = {
    value: {
      label: "Articles",
    },
    read: {
      label: "Read",
      color: CHART_COLORS.primary,
    },
    unread: {
      label: "Unread",
      color: CHART_COLORS.muted,
    },
  } satisfies ChartConfig

  // Calculate articles by source
  const sourceStatsMap = articles.reduce((acc, article) => {
    if (!acc[article.source]) {
      acc[article.source] = { source: article.source, total: 0, read: 0 }
    }
    acc[article.source].total++
    if (article.isRead) {
      acc[article.source].read++
    }
    return acc
  }, {} as Record<string, { source: string; total: number; read: number }>)
  
  const sourceStats = Object.values(sourceStatsMap)

  const sourceChartConfig = {
    total: {
      label: "Total Articles",
      color: CHART_COLORS.primary,
    },
    read: {
      label: "Read",
      color: CHART_COLORS.accent,
    },
  } satisfies ChartConfig

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      {/* Read vs Unread Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Reading Progress</CardTitle>
          <CardDescription>Track your reading completion</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={readChartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={readStats}
                dataKey="value"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {readCount}/{articles.length}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Read
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Articles by Source Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Articles by Source</CardTitle>
          <CardDescription>Distribution across news sources</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={sourceChartConfig} className="min-h-[250px] w-full">
            <BarChart data={sourceStats}>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="source" 
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              <Bar dataKey="read" fill="var(--color-read)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart"

export const description = "A line chart"

const chartData = [
  { month: "July", usage: 186 },
  { month: "August", usage: 305 },
  { month: "September", usage: 237 },
  { month: "October", usage: 73 },
  { month: "November", usage: 209 },
  { month: "December", usage: 214 },
  { month: "Jan", usage: 214 },
]

const chartConfig = {
  usage: {
    label: "Water Usage",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartLineDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumption</CardTitle>
        <CardDescription>July - January 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-40 w-full">
          {/* Make sure to add `ResponsiveContainer` to your imports: `import { ResponsiveContainer } from 'recharts'` */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
          left: 12,
          right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
              />
              <Line
          dataKey="usage"
          type="natural"
          stroke="var(--color-usage)"
          strokeWidth={2}
          dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total water usage for the last 7 months
        </div>
      </CardFooter>
    </Card>
  )
}

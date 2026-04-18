"use client"

import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell
} from "recharts"
import { formatCurrency } from "@/lib/utils"

interface SalesChartProps {
  data: any[]
}

export const SalesChart = ({ data }: SalesChartProps) => {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            cursor={{ fill: 'var(--primary)', fillOpacity: 0.05 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card p-3 border border-primary/20 shadow-xl rounded-lg backdrop-blur-md">
                    <p className="text-sm font-bold text-foreground">{payload[0].payload.name}</p>
                    <p className="text-sm text-primary font-bold">
                      {formatCurrency(payload[0].value as number)}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar 
            dataKey="total" 
            radius={[4, 4, 0, 0]} 
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === data.length - 1 ? "var(--primary)" : "var(--primary)"}
                fillOpacity={index === data.length - 1 ? 1 : 0.25}
                className="transition-all duration-300 hover:fill-opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

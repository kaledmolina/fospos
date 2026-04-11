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
            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card p-3 border border-emerald-500/20 shadow-xl rounded-lg">
                    <p className="text-sm font-bold text-foreground">{payload[0].payload.name}</p>
                    <p className="text-sm text-emerald-500 font-bold">
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
                fill={index === data.length - 1 ? "#10B981" : "#10B98140"} 
                className="transition-all duration-300 hover:fill-emerald-500"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

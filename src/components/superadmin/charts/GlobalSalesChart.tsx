"use client"

import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts"
import { formatCurrency } from "@/lib/utils"

interface GlobalSalesChartProps {
  data: any[]
}

export const GlobalSalesChart = ({ data }: GlobalSalesChartProps) => {
  return (
    <div className="h-[350px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGlobal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke="#4B5563" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#4B5563" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value/1000}k`}
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#0f172a] p-4 border border-white/10 shadow-2xl rounded-2xl">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                    <p className="text-lg font-black text-emerald-400">
                      {formatCurrency(payload[0].value as number)}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">Ventas Consolidadas</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#10B981" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorGlobal)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

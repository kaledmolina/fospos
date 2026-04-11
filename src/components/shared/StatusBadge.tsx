"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface StatusBadgeProps {
  status: string
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "PENDING":
    case "PENDING_PAYMENT":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1 w-fit">
          <Clock className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase tracking-widest">Pendiente</span>
        </Badge>
      )
    case "ACTIVE":
    case "PAID":
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1 w-fit">
          <CheckCircle className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase tracking-widest">Activo</span>
        </Badge>
      )
    case "SUSPENDED":
    case "OVERDUE":
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 px-2 py-0.5 rounded-lg flex items-center gap-1 w-fit">
          <XCircle className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase tracking-widest">{status === "SUSPENDED" ? "Suspendido" : "Vencido"}</span>
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
          {status}
        </Badge>
      )
  }
}

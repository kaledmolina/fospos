"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, User, Calendar, Activity, Info, Tag, DollarSign, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { fadeInUp } from "@/lib/animations"

interface LogsTabProps {
  logs: any[]
  fetchLogs: () => Promise<void>
}

export const LogsTab = ({ logs, fetchLogs }: LogsTabProps) => {
  useEffect(() => {
    fetchLogs()
  }, [])

  const getActionIcon = (action: string) => {
    switch (action) {
      case "PRICE_CHANGE": return <DollarSign className="w-4 h-4 text-emerald-500" />
      case "STOCK_ADJUSTMENT": return <Package className="w-4 h-4 text-blue-500" />
      case "PRODUCT_DELETE": return <ShieldCheck className="w-4 h-4 text-red-500" />
      case "PRODUCT_UPDATE": return <Tag className="w-4 h-4 text-amber-500" />
      default: return <Activity className="w-4 h-4 text-slate-500" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "PRICE_CHANGE": return "bg-emerald-500/10 text-emerald-600 border-emerald-200"
      case "STOCK_ADJUSTMENT": return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "PRODUCT_DELETE": return "bg-red-500/10 text-red-600 border-red-200"
      case "PRODUCT_UPDATE": return "bg-amber-500/10 text-amber-600 border-amber-200"
      default: return "bg-slate-500/10 text-slate-600 border-slate-200"
    }
  }

  return (
    <motion.div 
      variants={fadeInUp} 
      initial="initial" 
      animate="animate" 
      className="space-y-6 max-w-5xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Registro de Auditoría</h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Historial detallado de acciones administrativas y de seguridad.</p>
        </div>
        <Badge variant="outline" className="h-8 px-4 bg-emerald-50 text-emerald-700 border-emerald-100 font-bold">
          {logs.length} Eventos registrados
        </Badge>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-320px)]">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-slate-300">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                  <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Sin registros aún</p>
                  <p className="text-slate-400 text-sm italic">Las acciones críticas aparecerán aquí automáticamente.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 md:p-6 hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors group">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-2xl border transition-transform group-hover:scale-110 duration-300 ${getActionColor(log.action)}`}>
                          {getActionIcon(log.action)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                             <Badge variant="outline" className={`font-black text-[10px] uppercase tracking-tighter ${getActionColor(log.action)}`}>
                               {log.action}
                             </Badge>
                             <span className="text-xs text-slate-400 font-medium">en</span>
                             <Badge variant="secondary" className="font-bold text-[10px] uppercase bg-slate-100 dark:bg-zinc-800">
                               {log.entity}
                             </Badge>
                          </div>
                          <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                            {log.notes || `Acción realizada en ${log.entity}`}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                             {log.oldValue && (
                               <div className="p-3 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100/50 dark:border-red-900/20">
                                 <p className="text-[10px] font-black uppercase text-red-500 mb-1 tracking-widest">Valor Anterior</p>
                                 <code className="text-[11px] text-red-700 dark:text-red-400 break-all">{log.oldValue}</code>
                               </div>
                             )}
                             {log.newValue && (
                               <div className="p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-900/20">
                                 <p className="text-[10px] font-black uppercase text-emerald-500 mb-1 tracking-widest">Valor Nuevo</p>
                                 <code className="text-[11px] text-emerald-700 dark:text-emerald-400 break-all">{log.newValue}</code>
                               </div>
                             )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col items-end justify-between md:justify-start gap-2 text-right shrink-0">
                         <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-800 rounded-full border border-slate-200 dark:border-zinc-700">
                           <User className="w-3 h-3 text-slate-400" />
                           <span className="text-[10px] font-black uppercase text-slate-600 dark:text-zinc-400">
                             {log.user?.name || "Sistema"}
                           </span>
                         </div>
                         <div className="flex items-center gap-2 text-slate-400">
                           <Calendar className="w-3 h-3" />
                           <span className="text-[10px] font-bold">
                             {format(new Date(log.createdAt), "dd MMM, hh:mm a", { locale: es })}
                           </span>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-3xl flex gap-3 items-center">
        <Info className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-[10px] uppercase font-black tracking-widest text-amber-700 dark:text-amber-500 opacity-70">
          Nota: Los registros de auditoría son inmutables y no pueden ser borrados ni modificados por ningún usuario.
        </p>
      </div>
    </motion.div>
  )
}

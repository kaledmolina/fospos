"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Ticket, Search, Filter, Calendar, 
  User, CheckCircle2, Clock, XCircle,
  MoreVertical, ArrowRightLeft, Eye
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency } from "@/lib/utils"

interface GiftCardsTabProps {
  giftCards: any[]
  onPrintCard: (card: any) => void
}

export const GiftCardsTab = ({ giftCards, onPrintCard }: GiftCardsTabProps) => {
  const [search, setSearch] = useState("")

  const filteredCards = giftCards.filter(card => 
    card.code.toLowerCase().includes(search.toLowerCase()) ||
    card.customer?.name.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1"><CheckCircle2 className="w-3 h-3" /> ACTIVA</Badge>
      case "USED_UP":
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> AGOTADA</Badge>
      case "EXPIRED":
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> VENCIDA</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950/50">
      <div className="p-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Gestión de Gift Cards</h1>
            <p className="text-sm text-muted-foreground mt-1">Administra y rastrea todas las tarjetas de regalo emitidas por tu negocio.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por código o cliente..." 
                className="pl-9 h-10 border-blue-500/20 bg-white dark:bg-zinc-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 border-blue-500/20 hover:bg-blue-500/10">
              <Filter className="w-4 h-4 text-blue-600" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-sm overflow-hidden group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70">Emitidas Hoy</p>
                <p className="text-2xl font-black text-emerald-700">{giftCards.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-500/20 bg-blue-500/5 shadow-sm overflow-hidden group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600/70">Saldo Circulante</p>
                <p className="text-2xl font-black text-blue-700">
                  {formatCurrency(giftCards.reduce((sum, c) => sum + (c.status === "ACTIVE" ? c.balance : 0), 0))}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-amber-500/5 shadow-sm overflow-hidden group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600/70">Por Vencer</p>
                <p className="text-2xl font-black text-amber-700">0</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 pb-6 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              <Card className="border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-zinc-900 border-l-4 border-l-blue-500">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black tracking-widest text-blue-600">{card.code}</span>
                        {getStatusBadge(card.status)}
                      </div>
                      <div className="flex items-center text-muted-foreground gap-1.5 pt-1">
                        <User className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{card.customer?.name || "Cliente General"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-50"
                        onClick={() => onPrintCard(card)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-slate-100 dark:border-zinc-800/50">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Saldo Disponible</p>
                      <p className={`text-xl font-black tabular-nums tracking-tighter ${card.balance > 0 ? "text-slate-900 dark:text-white" : "text-muted-foreground"}`}>
                        {formatCurrency(card.balance)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">Monto Inicial</p>
                      <p className="text-xs font-bold text-slate-400 tabular-nums">
                        {formatCurrency(card.initialAmount)}
                      </p>
                    </div>
                  </div>

                  {card.expiresAt && (
                    <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-zinc-800/50 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 transition-colors">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-[9px] font-bold text-slate-500 group-hover:text-blue-600">
                        VENCE: {new Date(card.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filteredCards.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-200 dark:border-zinc-700">
                <Ticket className="w-10 h-10 text-slate-300 dark:text-zinc-600" />
              </div>
              <div className="max-w-xs mx-auto">
                <h3 className="text-lg font-black tracking-tight uppercase">No se encontraron tarjetas</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Busca por código o emite una nueva desde la pestaña de ventas en el POS.
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

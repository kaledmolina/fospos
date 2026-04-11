"use client"

import { motion } from "framer-motion"
import { Search, Receipt, Calendar, User, ShoppingBag, CreditCard, Wallet, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { fadeInUp, staggerContainer } from "@/lib/animations"

interface TransactionsTabProps {
  sales: any[]
  onSetLastSale: (sale: any) => void
  onSetReceiptDialog: (open: boolean) => void
}

export const TransactionsTab = ({ sales, onSetLastSale, onSetReceiptDialog }: TransactionsTabProps) => {
  return (
    <motion.div 
      key="transactions" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historial de Transacciones</h1>
          <p className="text-sm text-muted-foreground">Consulta y gestiona todas las ventas y movimientos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por factura o cliente..." className="pl-9 w-64 bg-card" />
          </div>
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Filtrar Fecha
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden border-border bg-card">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-500" />
                Ventas Recientes
              </CardTitle>
              <Badge variant="outline" className="bg-background">{sales.length} Transacciones</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b bg-muted/10">
                  <tr>
                    <th className="px-6 py-4">Factura #</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Método</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sales.map((sale, i) => (
                    <motion.tr 
                      key={sale.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-foreground">{sale.invoiceNumber || `FAC-${sale.id.slice(-6).toUpperCase()}`}</td>
                      <td className="px-6 py-4 text-muted-foreground">{formatDate(sale.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-emerald-500/10 rounded-full flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                          <span className="font-medium">{sale.customer?.name || "Cliente General"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {sale.paymentMethod === "CASH" ? <Wallet className="w-3.5 h-3.5 text-emerald-500" /> : 
                           sale.paymentMethod === "CREDIT" ? <CreditCard className="w-3.5 h-3.5 text-orange-500" /> : 
                           <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />}
                          <span className="text-[10px] font-bold uppercase">{sale.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline" 
                          className={`
                            text-[9px] font-black uppercase tracking-tighter
                            ${sale.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                              sale.paymentStatus === "PENDING" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : 
                              "bg-red-500/10 text-red-500 border-red-500/20"}
                          `}
                        >
                          {sale.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-foreground">
                        {formatCurrency(sale.total)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            onSetLastSale(sale)
                            onSetReceiptDialog(true)
                          }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-20">
                          <Receipt className="w-12 h-12" />
                          <p className="font-black uppercase tracking-widest text-xs">No se encontraron transacciones</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

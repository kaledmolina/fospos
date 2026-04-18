"use client"

import { motion } from "framer-motion"
import { Search, Receipt, Calendar, User, ShoppingBag, CreditCard, Wallet, ArrowRight, Printer } from "lucide-react"
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
  onOpenHistory: (items: any[], title: string, description?: string) => void
  saleSearch: string
  onSetSaleSearch: (search: string) => void
}

export const TransactionsTab = ({ 
  sales, onSetLastSale, onSetReceiptDialog, onOpenHistory,
  saleSearch, onSetSaleSearch
}: TransactionsTabProps) => {
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
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Historial de Transacciones</h1>
          <p className="text-sm text-muted-foreground">Consulta y gestiona todas las ventas y movimientos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Factura o cliente..." 
              className="pl-9 w-64 bg-card border-primary/20 focus:border-primary transition-all shadow-sm"
              value={saleSearch}
              onChange={(e) => onSetSaleSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 border-border/50 hover:bg-primary hover:text-white transition-all">
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
                <Receipt className="w-5 h-5 text-primary" />
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
                          <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="font-medium">{sale.customer?.name || "Cliente General"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {sale.paymentMethod === "CASH" ? <Wallet className="w-3.5 h-3.5 text-primary" /> : 
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
                            ${sale.paymentStatus === "PAID" ? "bg-primary/10 text-primary border-primary/20" : 
                              sale.paymentStatus === "PENDING" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : 
                              "bg-red-500/10 text-red-500 border-red-500/20"}
                          `}
                        >
                          {sale.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-foreground">
                        <div className="flex flex-col items-end">
                          <span>{formatCurrency(sale.total)}</span>
                          {sale.paymentMethod === "CREDIT" && sale.credit && (
                            <span className="text-[9px] text-orange-500 font-medium">
                              Saldo: {formatCurrency(sale.credit.balance)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-right">
                          {sale.paymentMethod === "CREDIT" && sale.credit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 rounded-lg text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
                              title="Ver historial de abonos"
                              onClick={() => onOpenHistory(
                                sale.credit.payments,
                                `Abonos - Factura ${sale.invoiceNumber}`,
                                `Historial de pagos del crédito para el cliente ${sale.customer?.name || 'General'}. Total: ${formatCurrency(sale.total)}`
                              )}
                            >
                              <Calendar className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer shadow-sm shadow-primary/5 group/btn"
                            onClick={() => {
                              onSetLastSale(sale)
                              onSetReceiptDialog(true)
                            }}
                          >
                            <Printer className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-tight">Imprimir</span>
                          </Button>
                        </div>
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

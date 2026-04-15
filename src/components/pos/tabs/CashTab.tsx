"use client"

import { motion } from "framer-motion"
import { Wallet, Receipt, CheckCircle, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { fadeInUp } from "@/lib/animations"
import { formatCurrency, formatDate } from "@/lib/utils"

interface CashTabProps {
  cashRegister: any
  onSetCashDialog: (open: boolean) => void
  todayExpenses: number
  onSetExpenseDialog: (open: boolean) => void
  onPrintSummary: () => void
  cashHistory: any[]
}

export const CashTab = ({
  cashRegister,
  onSetCashDialog,
  todayExpenses,
  onSetExpenseDialog,
  onPrintSummary,
  cashHistory
}: CashTabProps) => {
  return (
    <motion.div key="cash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h1 className="text-2xl font-bold text-foreground mb-6">Control de Caja</h1>

      {cashRegister ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  Caja Abierta
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" className="cursor-pointer border-emerald-500 text-emerald-600 hover:bg-emerald-50" onClick={onPrintSummary}>
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir Resumen
                  </Button>
                  <Button variant="destructive" className="cursor-pointer" onClick={() => onSetCashDialog(true)}>Cerrar Caja</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Apertura</p>
                    <p className="text-lg font-bold">{formatDate(cashRegister.openedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Efectivo Inicial</p>
                    <p className="text-2xl font-bold">{formatCurrency(cashRegister.initialCash)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ventas Totales</p>
                    <p className="text-2xl font-bold text-emerald-500">{formatCurrency(cashRegister.totalSales)}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg"><span>Efectivo</span><span className="font-bold">{formatCurrency(cashRegister.totalCash)}</span></div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg"><span>Tarjeta</span><span className="font-bold">{formatCurrency(cashRegister.totalCard)}</span></div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg"><span>Transferencia</span><span className="font-bold">{formatCurrency(cashRegister.totalTransfer)}</span></div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg"><span>Créditos</span><span className="font-bold">{formatCurrency(cashRegister.totalCredit)}</span></div>
                  <Separator />
                  <div className="flex justify-between p-3 bg-emerald-500/10 rounded-lg">
                    <span className="font-medium">Efectivo Esperado</span>
                    <span className="font-bold text-emerald-500">{formatCurrency(cashRegister.initialCash + cashRegister.totalCash - todayExpenses)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Registrar Gasto desde Caja</CardTitle></CardHeader>
            <CardContent>
              <Button className="bg-red-500 hover:bg-red-600 cursor-pointer" onClick={() => onSetExpenseDialog(true)}>
                <Receipt className="w-4 h-4 mr-2" />Nuevo Gasto
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-xl font-medium mb-2">Caja Cerrada</p>
            <p className="text-muted-foreground mb-6">Abre caja para comenzar a registrar ventas</p>
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer" onClick={() => onSetCashDialog(true)}>Abrir Caja</Button>
          </CardContent>
        </Card>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Historial de Arqueos</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Apertura</th>
                    <th className="px-6 py-4">Cierre</th>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Inicial</th>
                    <th className="px-6 py-4">Ventas</th>
                    <th className="px-6 py-4">Final</th>
                    <th className="px-6 py-4">Diferencia</th>
                    <th className="px-6 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cashHistory.map((item) => (
                    <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.openedAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.closedAt ? formatDate(item.closedAt) : "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">{item.openedByUser?.name}</span>
                        {item.closedByUser && item.closedByUser.name !== item.openedByUser.name && (
                          <span className="block text-[10px] text-muted-foreground">Cerró: {item.closedByUser.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(item.initialCash)}</td>
                      <td className="px-6 py-4 text-emerald-600 font-bold">{formatCurrency(item.totalSales)}</td>
                      <td className="px-6 py-4 font-bold">{item.finalCash ? formatCurrency(item.finalCash) : "-"}</td>
                      <td className="px-6 py-4">
                        {item.status === "CLOSED" ? (
                          <span className={`${item.difference === 0 ? "text-emerald-500" : item.difference > 0 ? "text-blue-500" : "text-red-500"} font-bold`}>
                            {formatCurrency(item.difference || 0)}
                          </span>
                        ) : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={item.status === "OPEN" ? "success" : "secondary"}>
                          {item.status === "OPEN" ? "Abierta" : "Cerrada"}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                  {cashHistory.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                        No hay registros históricos para esta sucursal.
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

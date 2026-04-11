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
}

export const CashTab = ({
  cashRegister,
  onSetCashDialog,
  todayExpenses,
  onSetExpenseDialog,
  onPrintSummary
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
    </motion.div>
  )
}

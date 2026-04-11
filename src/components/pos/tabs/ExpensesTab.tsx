"use client"

import { motion } from "framer-motion"
import { Plus, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fadeInUp } from "@/lib/animations"
import { formatCurrency, formatDateShort } from "@/lib/utils"

interface ExpensesTabProps {
  expenses: any[]
  totalExpenses: number
  todayExpenses: number
  onSetExpenseDialog: (open: boolean) => void
}

export const ExpensesTab = ({
  expenses,
  totalExpenses,
  todayExpenses,
  onSetExpenseDialog
}: ExpensesTabProps) => {
  return (
    <motion.div key="expenses" variants={fadeInUp} initial="initial" animate="animate" exit="exit">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Gastos</h1>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="bg-red-500 hover:bg-red-600 cursor-pointer transition-all duration-200 shadow-md shadow-red-500/25" onClick={() => onSetExpenseDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />Nuevo Gasto
          </Button>
        </motion.div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Gastos</p>
            <p className="text-xl font-bold text-red-500">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Hoy</p>
            <p className="text-xl font-bold">{formatCurrency(todayExpenses)}</p>
          </CardContent>
        </Card>
        {["Servicios", "Nómina", "Alquiler", "Insumos", "Otros"].map(cat => {
          const catTotal = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
          return (
            <Card key={cat}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{cat}</p>
                <p className="text-lg font-bold">{formatCurrency(catTotal)}</p>
              </CardContent>
            </Card>
          )
        }).slice(0, 2)}
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historial de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {expenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{expense.category}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDateShort(expense.date)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-red-500">{formatCurrency(expense.amount)}</p>
                </div>
              ))}
              {expenses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay gastos registrados</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

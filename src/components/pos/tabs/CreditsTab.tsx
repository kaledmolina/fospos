"use client"

import { motion } from "framer-motion"
import { AlertCircle, Clock, CreditCard, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { formatCurrency, formatDate } from "@/lib/utils"

interface CreditsTabProps {
  credits: any[]
  filteredCredits: any[]
  overdueCredits: any[]
  dueSoonCredits: any[]
  creditFilter: string
  onSetCreditFilter: (filter: string) => void
  onSetSelectedCredit: (credit: any) => void
  onSetPaymentAmount: (amount: number) => void
  onSetPaymentDialog: (open: boolean) => void
  onOpenHistory: (items: any[], title: string, description: string) => void
  getDaysOverdue: (date: string) => number
}

export const CreditsTab = ({
  credits,
  filteredCredits,
  overdueCredits,
  dueSoonCredits,
  creditFilter,
  onSetCreditFilter,
  onSetSelectedCredit,
  onSetPaymentAmount,
  onSetPaymentDialog,
  onOpenHistory,
  getDaysOverdue
}: CreditsTabProps) => {
  return (
    <motion.div key="credits" variants={fadeInUp} initial="initial" animate="animate" exit="exit">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Libreta de Créditos</h1>
        <div className="flex gap-2">
          <Select value={creditFilter} onValueChange={onSetCreditFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Pendientes</SelectItem>
              <SelectItem value="overdue">Vencidos</SelectItem>
              <SelectItem value="dueSoon">Próximos a vencer</SelectItem>
              <SelectItem value="paid">Pagados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-red-500/20 bg-red-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-red-500">Vencidos</p>
                <p className="text-xl font-bold text-red-500">{overdueCredits.length}</p>
                <p className="text-xs text-red-500/80">{formatCurrency(overdueCredits.reduce((sum, c) => sum + c.balance, 0))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-500/20 bg-orange-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-orange-500">Próximos a vencer</p>
                <p className="text-xl font-bold text-orange-500">{dueSoonCredits.length}</p>
                <p className="text-xs text-orange-500/80">en 7 días</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total en Créditos</p>
                <p className="text-xl font-bold text-red-500">
                  {formatCurrency(credits.filter(c => c.status !== "PAID").reduce((sum, c) => sum + c.balance, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {filteredCredits.map(credit => {
          const isOverdue = credit.status === "OVERDUE"
          const daysOverdue = credit.dueDate ? getDaysOverdue(credit.dueDate) : 0
          return (
            <Card key={credit.id} className={`${isOverdue ? "border-red-500/20 bg-red-500/10" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{credit.customer.name}</p>
                        {credit.sale?.invoiceNumber && (
                           <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-bold">
                             {credit.sale.invoiceNumber}
                           </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(credit.createdAt)}</p>
                      {isOverdue && (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 mt-1">
                          <AlertCircle className="w-3 h-3 mr-1" />Vencido hace {daysOverdue} días
                        </Badge>
                      )}
                      {credit.dueDate && !isOverdue && daysOverdue >= -7 && daysOverdue < 0 && (
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 mt-1">
                          <Clock className="w-3 h-3 mr-1" />Vence en {Math.abs(daysOverdue)} días
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(credit.balance)}</p>
                    <p className="text-xs text-muted-foreground">de {formatCurrency(credit.totalAmount)}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {credit.status !== "PAID" && (
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                      onClick={() => {
                        onSetSelectedCredit(credit)
                        onSetPaymentAmount(credit.balance)
                        onSetPaymentDialog(true)
                      }}
                    >
                      Registrar Abono
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      onOpenHistory(
                        credit.payments || [], 
                        `Historial - ${credit.customer.name}`,
                        `Pagos registrados para el crédito del ${formatDate(credit.createdAt)}`
                      )
                    }}
                  >
                    Ver Historial
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {filteredCredits.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay créditos pendientes</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

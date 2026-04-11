"use client"

import { motion } from "framer-motion"
import { Plus, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { formatCurrency } from "@/lib/utils"

interface CustomersTabProps {
  customers: any[]
  credits: any[]
  onSetCustomerDialog: (open: boolean) => void
  onSetSelectedCredit: (credit: any) => void
  onSetPaymentAmount: (amount: number) => void
  onSetPaymentDialog: (open: boolean) => void
}

export const CustomersTab = ({
  customers,
  credits,
  onSetCustomerDialog,
  onSetSelectedCredit,
  onSetPaymentAmount,
  onSetPaymentDialog
}: CustomersTabProps) => {
  return (
    <motion.div key="customers" variants={fadeInUp} initial="initial" animate="animate" exit="exit">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200 shadow-md shadow-emerald-500/25" onClick={() => onSetCustomerDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />Nuevo Cliente
          </Button>
        </motion.div>
      </div>
      <motion.div
        className="grid gap-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {customers.map((customer) => (
          <motion.div
            key={customer.id}
            variants={fadeInUp}
            whileHover={{ scale: 1.01, x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {customer.document && `Doc: ${customer.document}`}
                          {customer.phone && ` • Tel: ${customer.phone}`}
                        </p>
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-none h-4 px-1 text-[10px] flex items-center gap-1">
                          <Star className="w-2 h-2 fill-amber-500" />
                          {customer.points || 0} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Historial de Compras</p>
                    <p className="font-bold text-sm text-emerald-600">{formatCurrency(customer.totalPurchases || 0)}</p>
                    
                    <div className="flex flex-col items-end gap-1 mt-2">
                       {customer.creditLimit > 0 && (
                         <div className="text-[10px] space-y-0.5 mb-1">
                           <p className="text-muted-foreground">Límite: {formatCurrency(customer.creditLimit)}</p>
                           <p className="font-bold text-emerald-500">Disponible: {formatCurrency(Math.max(0, customer.creditLimit - (customer.pendingBalance || 0)))}</p>
                         </div>
                       )}
                       {customer.pendingBalance > 0 && (
                         <div className="mt-2 flex flex-col items-end gap-2">
                           <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] px-1 h-5">
                             Deuda: {formatCurrency(customer.pendingBalance)}
                           </Badge>
                           <Button
                             size="sm"
                             variant="outline"
                             className="h-7 text-[11px] border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white cursor-pointer"
                             onClick={(e) => {
                               e.stopPropagation()
                               const customerCredit = credits.find(c => c.customerId === customer.id && c.status !== "PAID")
                               if (customerCredit) {
                                 onSetSelectedCredit(customerCredit)
                                 onSetPaymentAmount(customerCredit.balance)
                                 onSetPaymentDialog(true)
                               }
                             }}
                           >
                             Registrar Abono
                           </Button>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {customers.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <Users className="w-20 h-20 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground mb-2">No hay clientes registrados</p>
            <p className="text-sm text-muted-foreground mb-6">Agrega clientes para llevar un registro de sus compras</p>
            <Button className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer" onClick={() => onSetCustomerDialog(true)}>Agregar primer cliente</Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

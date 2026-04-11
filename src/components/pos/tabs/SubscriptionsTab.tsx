"use client"

import { motion } from "framer-motion"
import { 
  Crown, CheckCircle, AlertCircle, DollarSign, 
  Plus, Pause, Play, RefreshCw, Edit, Trash2, XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fadeInUp } from "@/lib/animations"
import { formatCurrency, formatDateShort } from "@/lib/utils"

interface SubscriptionsTabProps {
  subscriptionStats: any
  subscriptionServices: any[]
  subscriptions: any[]
  subscriptionTab: string
  onSetSubscriptionTab: (tab: string) => void
  onSetEditingSubscriptionService: (service: any) => void
  onSetSubscriptionServiceForm: (form: any) => void
  onSetShowSubscriptionServiceDialog: (open: boolean) => void
  onSetNewSubscription: (sub: any) => void
  onSetShowNewSubscriptionDialog: (open: boolean) => void
  onSetSelectedSubscription: (sub: any) => void
  onSetSubscriptionPaymentAmount: (amount: string) => void
  onSetShowSubscriptionPaymentDialog: (open: boolean) => void
  onDeleteSubscriptionService: (id: string) => void
  onFreezeSubscription: (id: string, days: number) => void
  onUnfreezeSubscription: (id: string) => void
  onCancelSubscription: (id: string) => void
  onOpenHistory: (items: any[], title: string, description: string) => void
}

export const SubscriptionsTab = ({
  subscriptionStats,
  subscriptionServices,
  subscriptions,
  subscriptionTab,
  onSetSubscriptionTab,
  onSetEditingSubscriptionService,
  onSetSubscriptionServiceForm,
  onSetShowSubscriptionServiceDialog,
  onSetNewSubscription,
  onSetShowNewSubscriptionDialog,
  onSetSelectedSubscription,
  onSetSubscriptionPaymentAmount,
  onSetShowSubscriptionPaymentDialog,
  onDeleteSubscriptionService,
  onFreezeSubscription,
  onUnfreezeSubscription,
  onCancelSubscription,
  onOpenHistory
}: SubscriptionsTabProps) => {
  return (
    <motion.div key="subscriptions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Servicios de Suscripción</h1>
        <Button 
          className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95" 
          onClick={() => {
            onSetEditingSubscriptionService(null)
            onSetSubscriptionServiceForm({
              name: "", code: "", description: "", price: "", setupFee: "0",
              billingCycle: "MONTHLY", durationMonths: "", isActive: true,
              maxFreezes: "0", freezeDaysMax: "0", categoryId: ""
            })
            onSetShowSubscriptionServiceDialog(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" />Nuevo Servicio
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{subscriptionStats?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activas</p>
                <p className="text-2xl font-bold text-green-500">{subscriptionStats?.active || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={subscriptionTab} onValueChange={onSetSubscriptionTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="subscriptions">Suscripciones</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <Card>
            <CardHeader><CardTitle className="text-lg">Servicios de Suscripción</CardTitle></CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {subscriptionServices.map(service => (
                    <div key={service.id} className={`flex items-center justify-between p-4 rounded-lg ${!service.isActive ? "bg-muted/50 opacity-60" : "bg-muted/30"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                          <Crown className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{service.name}</p>
                            {service.code && <Badge variant="outline" className="text-xs">{service.code}</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(service.price)} • {service.billingCycle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{service._count?.subscriptions || 0} suscriptores</Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            onSetEditingSubscriptionService(service)
                            onSetSubscriptionServiceForm({
                              name: service.name, code: service.code || "", description: service.description || "",
                              price: service.price.toString(), setupFee: service.setupFee.toString(),
                              billingCycle: service.billingCycle, durationMonths: service.durationMonths?.toString() || "",
                              isActive: service.isActive, maxFreezes: service.maxFreezes.toString(),
                              freezeDaysMax: service.freezeDaysMax.toString(), categoryId: service.category?.id || ""
                            })
                            onSetShowSubscriptionServiceDialog(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600" onClick={() => onDeleteSubscriptionService(service.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {subscriptionServices.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Crown className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay servicios registrados</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{subscriptions.length} suscripciones activas</p>
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={() => {
                onSetNewSubscription({
                  customerId: "", serviceId: "", startDate: new Date().toISOString().split('T')[0],
                  agreedPrice: "", discountPercent: "0", discountReason: "", notes: "", initialPayment: "0", paymentMethod: "CASH"
                })
                onSetShowNewSubscriptionDialog(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />Nueva Suscripción
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="divide-y">
                  {subscriptions.map(sub => (
                    <div key={sub.id} className="p-4 hover:bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            sub.status === "ACTIVE" ? "bg-green-500/10" : sub.status === "FROZEN" ? "bg-blue-500/10" : "bg-red-500/10"
                          }`}>
                            {sub.status === "FROZEN" ? <Pause className="w-5 h-5 text-blue-500" /> : <Play className="w-5 h-5 text-green-500" />}
                          </div>
                          <div>
                            <p className="font-medium">{sub.customer.name}</p>
                            <p className="text-sm text-muted-foreground">{sub.service.name} • {formatCurrency(sub.agreedPrice)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={sub.status === "ACTIVE" ? "border-green-500/20 text-green-500 bg-green-500/10" : "border-blue-500/20 text-blue-500 bg-blue-500/10"}>
                            {sub.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => { onSetSelectedSubscription(sub); onSetSubscriptionPaymentAmount(sub.agreedPrice.toString()); onSetShowSubscriptionPaymentDialog(true) }}>
                              <DollarSign className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                              onOpenHistory(
                                sub.payments || [],
                                `Pagos - ${sub.customer.name}`,
                                `Historial de mensualidades para ${sub.service.name}`
                              )
                            }}>
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            {sub.status === "ACTIVE" && <Button variant="outline" size="sm" onClick={() => { const days = prompt("¿Días?", "30"); if (days) onFreezeSubscription(sub.id, parseInt(days)) }}><Pause className="w-4 h-4" /></Button>}
                            {sub.status === "FROZEN" && <Button variant="outline" size="sm" onClick={() => onUnfreezeSubscription(sub.id)}><Play className="w-4 h-4" /></Button>}
                            <Button variant="outline" size="sm" className="text-red-600" onClick={() => onCancelSubscription(sub.id)}><XCircle className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

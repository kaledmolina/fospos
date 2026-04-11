"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Star, Ticket, Plus, Save, Trash2, 
  Settings2, Percent, DollarSign, Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

interface LoyaltyConfigTabProps {
  config: any
  onSaveConfig: (config: any) => void
  coupons: any[]
  fetchCoupons: () => void
}

export const LoyaltyConfigTab = ({
  config: initialConfig,
  onSaveConfig,
  coupons,
  fetchCoupons
}: LoyaltyConfigTabProps) => {
  const [activeTab, setActiveTab] = useState("points")
  const [config, setConfig] = useState(initialConfig || {
    isActive: false,
    pointsPerAmount: 1,
    amountStep: 1000,
    redemptionValue: 10,
    minPointsToRedeem: 100
  })

  // Coupon form state
  const [couponForm, setCouponForm] = useState({
    code: "",
    description: "",
    type: "FIXED",
    value: 0,
    minPurchase: 0,
    maxUses: 0,
    expiresAt: ""
  })

  useEffect(() => {
    if (initialConfig) setConfig(initialConfig)
  }, [initialConfig])

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/loyalty/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponForm)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Cupón creado exitosamente")
        setCouponForm({
          code: "", description: "", type: "FIXED",
          value: 0, minPurchase: 0, maxUses: 0, expiresAt: ""
        })
        fetchCoupons()
      } else {
        toast.error(data.error || "Error al crear cupón")
      }
    } catch (error) {
      toast.error("Error de conexión")
    }
  }

  return (
    <motion.div key="marketing" variants={fadeInUp} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Marketing y Fidelización</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="points" className="gap-2">
            <Star className="w-4 h-4" /> Puntos de Lealtad
          </TabsTrigger>
          <TabsTrigger value="coupons" className="gap-2">
            <Ticket className="w-4 h-4" /> Cupones y Bonos
          </TabsTrigger>
        </TabsList>

        {/* Configuration de Puntos */}
        <TabsContent value="points" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Configuración de Puntos</CardTitle>
                  <CardDescription>Define cómo tus clientes acumulan y redimen puntos.</CardDescription>
                </div>
                <Switch 
                  checked={config.isActive} 
                  onCheckedChange={(checked) => setConfig({ ...config, isActive: checked })} 
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Acumulación
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Puntos a dar</Label>
                      <Input 
                        type="number" 
                        value={config.pointsPerAmount} 
                        onChange={(e) => setConfig({ ...config, pointsPerAmount: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Por cada ($)</Label>
                      <Input 
                        type="number" 
                        value={config.amountStep} 
                        onChange={(e) => setConfig({ ...config, amountStep: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    Ejemplo: Si das 1 punto por cada $1,000, una compra de $50,000 otorgará 50 puntos.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Redención
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor de 1 punto</Label>
                      <Input 
                        type="number" 
                        value={config.redemptionValue} 
                        onChange={(e) => setConfig({ ...config, redemptionValue: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mínimo para redimir</Label>
                      <Input 
                        type="number" 
                        value={config.minPointsToRedeem} 
                        onChange={(e) => setConfig({ ...config, minPointsToRedeem: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    Ejemplo: Si 1 punto vale $10, 100 puntos equivalen a $1,000 de descuento.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 gap-2"
                  onClick={() => onSaveConfig(config)}
                >
                  <Save className="w-4 h-4" /> Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestión de Cupones */}
        <TabsContent value="coupons" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle>Nuevo Cupón</CardTitle>
                <CardDescription>Crea promociones temporales.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCoupon} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Código</Label>
                    <Input 
                      placeholder="Ej: PROMO10" 
                      className="uppercase"
                      required
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input 
                      placeholder="Ej: Descuento de bienvenida"
                      value={couponForm.description}
                      onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select 
                        value={couponForm.type} 
                        onValueChange={(v) => setCouponForm({ ...couponForm, type: v })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIXED">Valor Fijo</SelectItem>
                          <SelectItem value="PERCENTAGE">Porcentaje</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Valor</Label>
                      <Input 
                        type="number"
                        value={couponForm.value}
                        onChange={(e) => setCouponForm({ ...couponForm, value: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Compra Mínima ($)</Label>
                    <Input 
                      type="number"
                      value={couponForm.minPurchase}
                      onChange={(e) => setCouponForm({ ...couponForm, minPurchase: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Crear Cupón</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Cupones Activos</CardTitle>
                <CardDescription>Listado de promociones vigentes.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {coupons.map((coupon) => (
                      <div 
                        key={coupon.id} 
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <Ticket className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">{coupon.code}</span>
                              <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                                {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : formatCurrency(coupon.value)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{coupon.description}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Min. compra: {formatCurrency(coupon.minPurchase)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-emerald-600">Usos: {coupon.currentUses || 0}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/5 mt-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {coupons.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Ticket className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No hay cupones activos</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

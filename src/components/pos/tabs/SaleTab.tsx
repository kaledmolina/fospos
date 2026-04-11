"use client"

import { useEffect } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, ShoppingBag, Wallet, CreditCard, 
  FileText, Package, AlertTriangle, RefreshCw,
  Ticket, Star, CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { formatCurrency } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SaleTabProps {
  cashRegister: any
  onOpenCashDialog: () => void
  products: any[]
  cart: any[]
  onAddToCart: (product: any) => void
  onUpdateCartQuantity: (id: string, qty: number) => void
  onClearCart: () => void
  customers: any[]
  cartCustomer: any
  onSetCartCustomer: (customer: any) => void
  cartPaymentMethod: string
  onSetCartPaymentMethod: (method: string) => void
  subtotal: number
  tax: number
  total: number
  onHandleSale: () => void
  subscriptionServices: any[]
  onAddServiceToCart: (service: any) => void
  // Loyalty & Coupons
  loyaltyConfig: any
  redeemPoints: number
  onSetRedeemPoints: (points: number) => void
  couponCode: string
  onSetCouponCode: (code: string) => void
  appliedCoupon: any
  onValidateCoupon: () => void
  loyaltyDiscount: number
  couponDiscount: number
  cashReceived: number
  onCashReceivedChange: (amount: number) => void
  change: number
  onSetChange: (amount: number) => void
}

export const SaleTab = ({
  cashRegister,
  onOpenCashDialog,
  products,
  cart,
  onAddToCart,
  onUpdateCartQuantity,
  onClearCart,
  customers,
  cartCustomer,
  onSetCartCustomer,
  cartPaymentMethod,
  onSetCartPaymentMethod,
  subtotal,
  tax,
  total,
  onHandleSale,
  subscriptionServices,
  onAddServiceToCart,
  loyaltyConfig,
  redeemPoints,
  onSetRedeemPoints,
  couponCode,
  onSetCouponCode,
  appliedCoupon,
  onValidateCoupon,
  loyaltyDiscount,
  couponDiscount,
  cashReceived,
  onCashReceivedChange,
  change,
  onSetChange
}: SaleTabProps) => {
  useEffect(() => {
    if (cartPaymentMethod === "CASH" && cashReceived > 0) {
      onSetChange(Math.max(0, cashReceived - total))
    } else {
      onSetChange(0)
    }
  }, [cashReceived, total, cartPaymentMethod])
  return (
    <motion.div key="sale" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-[calc(100vh-120px)]">
      {!cashRegister && (
        <Card className="mb-4 border-yellow-500/20 bg-yellow-500/10 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <p className="text-yellow-500 font-medium">Debes abrir caja para registrar ventas</p>
            <Button size="sm" className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold cursor-pointer" onClick={onOpenCashDialog}>Abrir Caja</Button>
          </CardContent>
        </Card>
      )}
      <div className="grid lg:grid-cols-3 gap-4 h-full">
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar producto..." className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <Tabs defaultValue="products" className="h-full flex flex-col">
                <div className="px-4 pt-2">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="products" className="gap-2">
                      <Package className="w-4 h-4" /> Productos
                    </TabsTrigger>
                    <TabsTrigger value="services" className="gap-2">
                      <RefreshCw className="w-4 h-4" /> Servicios
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="products" className="flex-1 overflow-hidden mt-0">
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    <motion.div
                      className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4"
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      {products.filter(p => p.isActive).map((product) => (
                        <motion.div key={product.id} variants={fadeInUp} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            variant="outline"
                            disabled={product.stock <= 0}
                            className={`h-auto p-3 w-full flex flex-col items-start cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-emerald-300 ${product.stock <= 0 ? 'opacity-60 grayscale' : ''}`}
                            onClick={() => onAddToCart(product)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <p className="font-medium text-left truncate flex-1">{product.name}</p>
                              {product.stock <= 0 && <Badge variant="destructive" className="ml-2 text-[8px] uppercase font-black">Agotado</Badge>}
                            </div>
                            <div className="flex items-center justify-between w-full mt-1">
                              <p className={`font-bold ${product.stock <= 0 ? 'text-muted-foreground' : 'text-emerald-500'}`}>{formatCurrency(product.salePrice)}</p>
                              <Badge variant="outline" className={`text-xs ${product.stock < 10 ? 'border-red-500/50 text-red-500 bg-red-500/5' : 'text-muted-foreground'}`}>{product.stock} {product.unit}</Badge>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                      {products.filter(p => p.isActive).length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium mb-2">No hay productos</p>
                          <p className="text-sm">Agrega productos para comenzar a vender</p>
                        </div>
                      )}
                    </motion.div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="services" className="flex-1 overflow-hidden mt-0">
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    <motion.div
                      className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4"
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      {subscriptionServices.filter(s => s.isActive).map((service) => (
                        <motion.div key={service.id} variants={fadeInUp} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            variant="outline"
                            className="h-auto p-3 w-full flex flex-col items-start cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-emerald-300"
                            onClick={() => onAddServiceToCart(service)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <p className="font-medium text-left truncate flex-1">{service.name}</p>
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] uppercase">{service.billingCycle}</Badge>
                            </div>
                            <div className="flex items-center justify-between w-full mt-1">
                              <p className="font-bold text-emerald-500">{formatCurrency(service.price)}</p>
                              <p className="text-[10px] text-muted-foreground">Única vez: {formatCurrency(service.setupFee)}</p>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                      {subscriptionServices.filter(s => s.isActive).length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                          <RefreshCw className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium mb-2">No hay servicios</p>
                          <p className="text-sm">Agrega servicios de suscripción para comenzar</p>
                        </div>
                      )}
                    </motion.div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Carrito</span>
                {cart.length > 0 && <Button variant="ghost" size="sm" onClick={onClearCart}>Limpiar</Button>}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="mb-4">
                <Select value={cartCustomer?.id || "none"} onValueChange={(v) => onSetCartCustomer(v === "none" ? null : customers.find(c => c.id === v) || null)}>
                  <SelectTrigger><SelectValue placeholder="Cliente (opcional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Cliente general</SelectItem>
                    {customers.map(customer => (<SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                
                {cartCustomer && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 p-2 bg-emerald-500/5 rounded-md border border-emerald-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                       <span className="text-sm font-medium">Puntos: {cartCustomer.points || 0}</span>
                    </div>
                    {loyaltyConfig?.isActive && (cartCustomer.points >= loyaltyConfig.minPointsToRedeem) && (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] cursor-pointer" onClick={() => onSetRedeemPoints(cartCustomer.points)}>Redimir todo</Badge>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Loyalty Redemption */}
              {loyaltyConfig?.isActive && cartCustomer && (
                <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Redimir Puntos</Label>
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="Puntos..." 
                      className="h-8 text-sm"
                      value={redeemPoints || ""}
                      onChange={(e) => onSetRedeemPoints(parseInt(e.target.value) || 0)}
                    />
                    <div className="flex-1 flex items-center justify-end px-2 bg-background rounded border text-xs font-bold text-amber-600">
                      -{formatCurrency(loyaltyDiscount)}
                    </div>
                  </div>
                </div>
              )}

              {/* Coupons */}
              <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Ticket className="w-4 h-4 text-blue-500" />
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cupón / Bono</Label>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Escribe código..." 
                    className="h-8 text-sm uppercase"
                    value={couponCode}
                    onChange={(e) => onSetCouponCode(e.target.value)}
                  />
                  <Button size="sm" variant="outline" className="h-8" onClick={onValidateCoupon}>
                    {appliedCoupon ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : "Validar"}
                  </Button>
                </div>
                {appliedCoupon && (
                  <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 
                    Aplicado: {appliedCoupon.description || appliedCoupon.code} (-{formatCurrency(couponDiscount)})
                  </p>
                )}
              </div>
              
              <ScrollArea className="flex-1 mb-4">
                <AnimatePresence mode="popLayout">
                  <div className="space-y-3">
                    {cart.map((item, index) => (
                      <motion.div
                        key={`${item.type}-${item.id}`}
                        layout
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.8 }}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border shadow-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} c/u</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" className="w-7 h-7" onClick={() => onUpdateCartQuantity(item.id, item.quantity - 1)}>-</Button>
                          <span className="w-8 text-center text-sm font-bold text-emerald-600">{item.quantity}</span>
                          <Button size="icon" variant="outline" className="w-7 h-7" onClick={() => onUpdateCartQuantity(item.id, item.quantity + 1)}>+</Button>
                        </div>
                      </motion.div>
                    ))}
                    {cart.length === 0 && (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                        <p className="text-muted-foreground font-medium">Carrito vacío</p>
                        <p className="text-sm text-muted-foreground mt-1">Selecciona productos para agregar</p>
                      </div>
                    )}
                  </div>
                </AnimatePresence>
              </ScrollArea>
              
              <div className="mb-4">
                <Label className="text-sm">Método de Pago</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { id: "CASH", label: "Efectivo", icon: Wallet },
                    { id: "CARD", label: "Tarjeta", icon: CreditCard },
                    { id: "CREDIT", label: "Crédito", icon: FileText }
                  ].map(method => (
                    <motion.div key={method.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant={cartPaymentMethod === method.id ? "default" : "outline"}
                        className={`w-full cursor-pointer transition-all duration-200 ${cartPaymentMethod === method.id ? "bg-emerald-500 hover:bg-emerald-600 shadow-md" : "hover:border-emerald-300"}`}
                        onClick={() => onSetCartPaymentMethod(method.id)}
                      >
                        <method.icon className="w-4 h-4 mr-1" />{method.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span>IVA (19%)</span><span>{formatCurrency(tax)}</span></div>
                {loyaltyDiscount > 0 && <div className="flex justify-between text-sm text-amber-600"><span>Dcto. Puntos</span><span>-{formatCurrency(loyaltyDiscount)}</span></div>}
                {couponDiscount > 0 && <div className="flex justify-between text-sm text-blue-600"><span>Dcto. Cupón</span><span>-{formatCurrency(couponDiscount)}</span></div>}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-xl font-black text-emerald-500">{formatCurrency(total)}</span>
                </div>

                {cartPaymentMethod === "CASH" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20 space-y-3 mb-4"
                  >
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-emerald-600">Dinero entregado</Label>
                      <div className="relative">
                        <Wallet className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-emerald-500" />
                        <Input 
                          type="number" 
                          placeholder="0"
                          value={cashReceived || ""}
                          onChange={(e) => onCashReceivedChange(parseFloat(e.target.value) || 0)}
                          className="h-8 pl-7 bg-white border-emerald-500/30 font-bold text-emerald-600" 
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Devuelta/Cambio</span>
                      <span className={`font-black ${change > 0 ? "text-emerald-500" : "text-muted-foreground"}`}>
                        {formatCurrency(change)}
                      </span>
                    </div>
                  </motion.div>
                )}

              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200 shadow-lg shadow-emerald-500/25" 
                  size="lg" 
                  disabled={cart.length === 0 || !cashRegister} 
                  onClick={onHandleSale}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />Procesar Venta
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

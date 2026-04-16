"use client"

import { useEffect } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, ShoppingBag, Wallet, CreditCard, 
  FileText, Package, AlertTriangle, RefreshCw,
  Ticket, Star, CheckCircle2, UserPlus, Plus, Trash2, Users
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
  onSetCustomerDialog: (open: boolean) => void
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
  onSetChange,
  onSetCustomerDialog
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

                <TabsContent value="services" className="flex-1 overflow-hidden mt-0 relative">
                  <ScrollArea className="h-[calc(100vh-350px)]">
                    {!cartCustomer ? (
                      <div className="flex flex-col items-center justify-center h-[300px] text-center p-8 bg-background/50 backdrop-blur-sm rounded-xl border border-dashed border-border m-4">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                          <Users className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tighter text-foreground">Cliente Requerido</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
                          Para gestionar suscripciones y servicios, es obligatorio vincular un cliente registrado primero.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4 border-blue-500/30 text-blue-500 hover:bg-blue-500 hover:text-white transition-all font-bold gap-2"
                          onClick={() => onSetCustomerDialog(true)}
                        >
                          <UserPlus className="w-4 h-4" /> Registrar Cliente
                        </Button>
                      </div>
                    ) : (
                      <motion.div
                        className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4 pb-20"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                      >
                        {subscriptionServices.filter(s => s.isActive).map((service) => (
                          <motion.div key={service.id} variants={fadeInUp} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              variant="outline"
                              className="h-auto p-0 w-full flex flex-col items-stretch overflow-hidden group cursor-pointer border-blue-500/10 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300"
                              onClick={() => onAddServiceToCart(service)}
                            >
                              <div className="bg-gradient-to-br from-blue-600/90 to-indigo-600/90 p-3 text-white">
                                <div className="flex items-center justify-between mb-1">
                                  <Badge className="bg-white/20 text-white border-none text-[8px] font-black uppercase tracking-tighter">
                                    {service.billingCycle}
                                  </Badge>
                                  <RefreshCw className="w-3 h-3 text-white/50 group-hover:rotate-180 transition-transform duration-500" />
                                </div>
                                <p className="font-black text-sm text-left truncate tracking-tight">{service.name}</p>
                              </div>
                              <div className="p-3 bg-card space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Mensualidad</span>
                                  <p className="font-black text-blue-600 dark:text-blue-400">{formatCurrency(service.price)}</p>
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                                  <div className="flex items-center gap-1">
                                    <Plus className="w-2.5 h-2.5 text-indigo-500" />
                                    <span className="text-[9px] font-bold text-muted-foreground">Inscripción</span>
                                  </div>
                                  <p className="text-[10px] font-black text-indigo-500">{formatCurrency(service.setupFee)}</p>
                                </div>
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                        {subscriptionServices.filter(s => s.isActive).length === 0 && (
                          <div className="col-span-full text-center py-12 text-muted-foreground flex flex-col items-center">
                            <RefreshCw className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-spin-slow" />
                            <p className="text-lg font-medium mb-2">No hay servicios activos</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </ScrollArea>
                  {cartCustomer && (
                    <div className="absolute bottom-2 left-4 right-4 p-2 bg-blue-500/10 backdrop-blur-md rounded-lg border border-blue-500/20 flex items-center justify-center gap-2">
                       <CheckCircle2 className="w-3 h-3 text-blue-500" />
                       <span className="text-[9px] font-black uppercase text-blue-600/70 tracking-widest">Suscripción Segura Certificada</span>
                    </div>
                  )}
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
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select value={cartCustomer?.id || "none"} onValueChange={(v) => onSetCartCustomer(v === "none" ? null : customers.find(c => c.id === v) || null)}>
                      <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Cliente (opcional)" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Cliente general</SelectItem>
                        {customers.map(customer => (<SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="shrink-0 text-emerald-600 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                    title="Nuevo Cliente"
                    onClick={() => onSetCustomerDialog(true)}
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
                
                {cartCustomer && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="mt-3 overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent shadow-sm shadow-emerald-500/10"
                  >
                    <div className="p-3 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/20">
                          <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600/60 leading-none mb-1">Cliente Seleccionado</p>
                          <p className="text-sm font-black text-emerald-700 dark:text-emerald-400 truncate">{cartCustomer.name}</p>
                        </div>
                      </div>
                      
                      {cartPaymentMethod === "CREDIT" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: "auto" }}
                          className="pt-2 border-t border-emerald-500/10 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                             <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-500/10">
                                <Wallet className="w-3 h-3 text-blue-500" />
                             </div>
                             <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Crédito Disponible</span>
                          </div>
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${ (cartCustomer.creditLimit - (cartCustomer.pendingBalance || 0)) > 0 ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-red-500/10 text-red-500" }`}>
                            {formatCurrency(cartCustomer.creditLimit - (cartCustomer.pendingBalance || 0))}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Descuentos y Beneficios - Consolidado en Tabs para ahorrar espacio */}
              {(loyaltyConfig?.isActive && cartCustomer) || true ? (
                <div className="mb-4">
                  <Tabs defaultValue="loyalty" className="w-full">
                    <TabsList className="grid grid-cols-2 h-8 p-0.5 bg-muted/50">
                      <TabsTrigger value="loyalty" className="text-[10px] uppercase font-bold gap-1.5 h-7">
                        <Star className="w-3 h-3 text-amber-500" /> Puntos
                      </TabsTrigger>
                      <TabsTrigger value="coupon" className="text-[10px] uppercase font-bold gap-1.5 h-7">
                        <Ticket className="w-3 h-3 text-blue-500" /> Cupón
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="loyalty" className="mt-2 space-y-2 p-3 bg-muted/20 rounded-lg border border-dashed border-border/60">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">Disponibles: <span className="text-amber-600 dark:text-amber-500">{cartCustomer?.points || 0} pts</span></span>
                        </div>
                        {loyaltyConfig?.isActive && (cartCustomer?.points >= loyaltyConfig.minPointsToRedeem) && (
                          <Button size="sm" variant="ghost" className="h-5 text-[9px] text-emerald-600 hover:bg-emerald-500/10 px-1 font-black" onClick={() => onSetRedeemPoints(cartCustomer?.points || 0)}>
                            USAR TODOS
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="number" 
                          placeholder="Puntos a redimir..." 
                          className="h-8 text-xs bg-background/50 border-amber-500/20 focus-visible:ring-amber-500/30"
                          value={redeemPoints || ""}
                          max={cartCustomer?.points || 0}
                          onChange={(e) => onSetRedeemPoints(Math.min(parseInt(e.target.value) || 0, cartCustomer?.points || 0))}
                        />
                        <div className="shrink-0 px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded text-[10px] font-black border border-amber-500/20">
                          -{formatCurrency(loyaltyDiscount)}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="coupon" className="mt-2 space-y-2 p-2 bg-muted/20 rounded-lg border border-dashed border-border/60">
                      <div className="flex gap-1.5">
                        <Input 
                          placeholder="CÓDIGO DE CUPÓN..." 
                          className="h-8 text-xs uppercase bg-background/50 border-blue-500/20 focus-visible:ring-blue-500/30"
                          value={couponCode}
                          onChange={(e) => onSetCouponCode(e.target.value)}
                        />
                        <Button size="sm" variant="outline" className="h-8 px-2 text-[10px] font-bold border-blue-500/30 text-blue-600 hover:bg-blue-50" onClick={onValidateCoupon}>
                          {appliedCoupon ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : "APLICAR"}
                        </Button>
                      </div>
                      {appliedCoupon && (
                        <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold px-1 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> {appliedCoupon.description || appliedCoupon.code} (-{formatCurrency(couponDiscount)})
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : null}
              
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
                        className="group flex items-center gap-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-xl border border-transparent hover:border-border transition-all shadow-sm"
                      >
                        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border text-muted-foreground group-hover:text-emerald-500 transition-colors">
                          {item.type === "PRODUCT" ? <Package className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">{formatCurrency(item.price)} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center bg-background rounded-lg border p-0.5 shadow-sm">
                          <Button size="icon" variant="ghost" className="w-6 h-6 h-auto" onClick={() => onUpdateCartQuantity(item.id, item.quantity - 1)}>-</Button>
                          <span className="w-8 text-center text-xs font-black text-emerald-600">{item.quantity}</span>
                          <Button size="icon" variant="ghost" className="w-6 h-6 h-auto" onClick={() => onUpdateCartQuantity(item.id, item.quantity + 1)}>+</Button>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="w-8 h-8 text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100" 
                          onClick={() => onUpdateCartQuantity(item.id, 0)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
              
              <div className="border-t pt-4 space-y-2.5">
                <div className="flex justify-between text-xs font-medium text-muted-foreground px-1"><span>Subtotal bruto</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-xs font-medium text-muted-foreground px-1"><span>IVA (19%)</span><span>{formatCurrency(tax)}</span></div>
                
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-amber-600 px-3 py-1 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200/50 dark:border-amber-900/30">
                    <span className="flex items-center gap-1.5"><Star className="w-3 h-3 fill-amber-500" /> Descuento Puntos</span>
                    <span>-{formatCurrency(loyaltyDiscount)}</span>
                  </div>
                )}
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-blue-600 px-3 py-1 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200/50 dark:border-blue-900/30">
                    <span className="flex items-center gap-1.5"><Ticket className="w-3 h-3 fill-blue-500 border-none" /> Cupón Aplicado</span>
                    <span>-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                
                <div className="my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                
                <div className="flex justify-between items-end p-4 bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-500/20 dark:to-emerald-500/5 rounded-2xl shadow-lg shadow-emerald-500/20 dark:shadow-none group transition-all duration-300">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-100 dark:text-emerald-500/70">Total a Pagar</p>
                    <p className="text-3xl font-black text-white dark:text-emerald-400 tabular-nums leading-none drop-shadow-sm">
                      {formatCurrency(total)}
                    </p>
                  </div>
                  <div className="text-right pb-1">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 dark:bg-emerald-500/10 backdrop-blur-sm border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      <p className="text-[9px] font-black text-emerald-50 border-none uppercase tracking-tighter">Balance Final</p>
                    </div>
                  </div>
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
                          className="h-8 pl-7 bg-background dark:bg-slate-900 border-emerald-500/30 font-bold text-emerald-600 dark:text-emerald-400" 
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

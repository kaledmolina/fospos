"use client"

import { useState, useEffect, useRef } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { 
  Ticket, Star, CheckCircle2, UserPlus, Plus, Trash2, Users, Zap, Eye, AlertCircle,
  LayoutGrid, ArrowRightLeft, Minus, Search, Package, RefreshCw, ShoppingBag, 
  AlertTriangle, Wallet, CreditCard, FileText, DollarSign, Wand2, Clock
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  onAddServiceToCart: (service: any, isSubscription: boolean) => void
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
  // Gift Cards
  giftCardForm: any
  onSetGiftCardForm: (form: any) => void
  onAddGiftCardToCart: () => void
  giftCardCode: string
  onSetGiftCardCode: (code: string) => void
  onValidateGiftCard: () => void
  appliedGiftCard: any
  onPrintGiftCard: (card: any) => void
  userRole?: string
  businessSettings?: any
  currentBranch?: any;
  // Held Carts
  heldCarts?: any[];
  onHoldCart?: () => void;
  onResumeCart?: (id: string) => void;
  onDeleteHeldCart?: (id: string) => void;
}

export const SaleTab = ({
  cashRegister,
  onOpenCashDialog,
  products = [],
  cart = [],
  onAddToCart,
  onUpdateCartQuantity,
  onClearCart,
  customers = [],
  cartCustomer,
  onSetCartCustomer,
  cartPaymentMethod,
  onSetCartPaymentMethod,
  subtotal,
  tax,
  total,
  onHandleSale,
  subscriptionServices = [],
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
  onSetCustomerDialog,
  giftCardForm,
  onSetGiftCardForm,
  onAddGiftCardToCart,
  giftCardCode,
  onSetGiftCardCode,
  onValidateGiftCard,
  appliedGiftCard,
  onPrintGiftCard,
  cartPayments = [],
  onAddPayment,
  onRemovePayment,
  onUpdatePayment,
  userRole,
  businessSettings,
  currentBranch,
  heldCarts = [],
  onHoldCart,
  onResumeCart,
  onDeleteHeldCart
}: SaleTabProps) => {
  const [showDiscounts, setShowDiscounts] = useState(false)
  const isAdmin = userRole === "TENANT_ADMIN"
  const giftCardInputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (cartPaymentMethod === "GIFT_CARD") {
      giftCardInputRef.current?.focus()
    }
  }, [cartPaymentMethod])

  useEffect(() => {
    if (cartPaymentMethod === "CASH" && cashReceived > 0) {
      onSetChange(Math.max(0, cashReceived - total))
    } else {
      onSetChange(0)
    }
  }, [cashReceived, total, cartPaymentMethod])

  // Play Beep sound locally
  const playBeep = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio Context not supported or blocked by browser policy");
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering shortcuts when typing in inputs (unless F keys)
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      // F2: Focus Search
      if (e.key === "F2") {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // F8: Complete Sale / Pay
      if (e.key === "F8") {
        e.preventDefault();
        onHandleSale();
        return;
      }

      // ESC: Clear Cart (only if not focused on an input or if it's the search input)
      if (e.key === "Escape" && (!isInput || e.target === searchInputRef.current)) {
        if (cart.length > 0) {
          e.preventDefault();
          // Implementacion de la confirmación rápida
          if (window.confirm("¿Seguro que deseas vaciar el carrito?")) {
            onClearCart();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, onHandleSale, onClearCart]);

  // Barcode Scanner Logic (on Enter in search)
  const handleProductSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cleanSearch = searchTerm.trim();
      if (!cleanSearch) return;

      // Search for exact match in barcode (code) or SKU
      const foundProduct = products.find(p => 
        p.isActive && (
          p.code === cleanSearch || 
          p.sku === cleanSearch || 
          p.name.toLowerCase() === cleanSearch.toLowerCase()
        )
      );

      if (foundProduct) {
        if (foundProduct.stock > 0) {
          onAddToCart(foundProduct);
          setSearchTerm("");
          playBeep();
        } else {
          toast.error("Producto agotado");
        }
        e.preventDefault();
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.isActive && (
      searchTerm === "" || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  return (
    <motion.div key="sale" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-[calc(100vh-5rem)] flex flex-col">
      {!cashRegister && (
        <Card className="mb-4 border-yellow-500/20 bg-yellow-500/10 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <p className="text-yellow-500 font-medium">Debes abrir caja para registrar ventas</p>
            <Button size="sm" className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold cursor-pointer" onClick={onOpenCashDialog}>Abrir Caja</Button>
          </CardContent>
        </Card>
      )}
      <div className="grid lg:grid-cols-3 gap-3 flex-1 min-h-0">
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="p-2 pb-1 bg-white dark:bg-zinc-900/50">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  ref={searchInputRef}
                  placeholder="Buscar producto o escanear [F2]..." 
                  className="pl-9 h-8 rounded-xl border-slate-200 dark:border-zinc-800 focus:ring-primary text-xs" 
                  value={searchTerm}
                  onChange={(e) => handleProductSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-[9px] font-black opacity-40 cursor-help">ENTER PARA AGREGAR</Badge>
                      </TooltipTrigger>
                      <TooltipContent>Presiona Enter para agregar el producto buscado directamente al carrito</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="flex items-center gap-4 px-1 text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                 <div className="flex items-center gap-1"><span className="bg-slate-200 dark:bg-zinc-800 px-1 rounded text-slate-600 dark:text-zinc-400">F2</span> Buscar</div>
                 <div className="flex items-center gap-1"><span className="bg-slate-200 dark:bg-zinc-800 px-1 rounded text-slate-600 dark:text-zinc-400">F8</span> Cobrar</div>
                 <div className="flex items-center gap-1"><span className="bg-slate-200 dark:bg-zinc-800 px-1 rounded text-slate-600 dark:text-zinc-400 text-red-500">ESC</span> Limpiar Carrito</div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <Tabs defaultValue="products" className="h-full flex flex-col">
                <div className="px-4 pt-1">
                  <TabsList className="grid grid-cols-3 w-full h-8">
                    <TabsTrigger value="products" className="gap-1.5 text-[10px]">
                      <Package className="w-3.5 h-3.5" /> Productos
                    </TabsTrigger>
                    <TabsTrigger value="services" className="gap-1.5 text-[10px]">
                      <RefreshCw className="w-3.5 h-3.5" /> Servicios
                    </TabsTrigger>
                    <TabsTrigger value="giftcards" className="gap-1.5 text-[10px]">
                      <Ticket className="w-3.5 h-3.5" /> Gift Cards
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="products" className="flex-1 overflow-hidden mt-0">
                  <ScrollArea className="h-full">
                    <motion.div
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 p-2"
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      {filteredProducts.map((product) => (
                        <motion.div key={product.id} variants={fadeInUp} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            variant="outline"
                            disabled={product.stock <= 0}
                            className={`h-auto p-0 w-full flex flex-col items-start cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-primary overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 ${product.stock <= 0 ? 'opacity-60 grayscale' : ''}`}
                            onClick={() => onAddToCart(product)}
                          >
                            <div className="relative w-full aspect-video bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                              {product.imageUrl ? (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-zinc-700">
                                  <Package className="w-8 h-8 opacity-20" />
                                </div>
                              )}
                              {product.stock <= 0 && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                  <Badge variant="destructive" className="text-[10px] font-black uppercase tracking-widest shadow-lg">Agotado</Badge>
                                </div>
                              )}
                              {product.presentations && product.presentations.length > 0 && (
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-indigo-500/90 text-white border-none shadow-sm text-[8px] font-black uppercase tracking-tighter">
                                    Múltiples Unidades
                                  </Badge>
                                </div>
                              )}
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-[10px] font-black text-primary border-none shadow-sm">
                                  {formatCurrency(product.salePrice)}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="p-1 w-full space-y-0.5 bg-white dark:bg-zinc-900 border-t border-slate-50 dark:border-zinc-800/50">
                              <p className="font-black text-[11px] text-left truncate w-full text-foreground uppercase tracking-tight">{product.name}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-60 truncate mr-2">{product.category?.name || "Sin cat."}</span>
                                <span className={`text-[8px] font-black shrink-0 ${product.stock < 10 ? 'text-red-500' : 'text-primary'}`}>{product.stock} {product.unit}</span>
                              </div>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                      {filteredProducts.length === 0 && (
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
                          <motion.div 
                            key={service.id} 
                            variants={fadeInUp} 
                            whileHover={{ y: -4 }} 
                            className="bg-card rounded-xl border border-blue-500/10 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                          >
                            <div className="bg-gradient-to-br from-blue-600/90 to-indigo-600/90 p-3 text-white">
                              <div className="flex items-center justify-between mb-1">
                                <Badge className="bg-white/20 text-white border-none text-[8px] font-black uppercase tracking-tighter">
                                  {service.billingCycle}
                                </Badge>
                                <Zap className="w-3 h-3 text-white/50" />
                              </div>
                              <p className="font-black text-sm text-left truncate tracking-tight">{service.name}</p>
                            </div>
                            
                            <div className="p-3 space-y-2 flex-1">
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

                            <div className="p-2 bg-muted/30 grid grid-cols-2 gap-2 border-t border-border/50">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-[9px] font-black uppercase tracking-tighter border-primary/20 text-primary hover:bg-primary hover:text-white transition-all bg-white dark:bg-zinc-900 shadow-sm"
                                onClick={() => onAddServiceToCart(service, false)}
                              >
                                <Zap className="w-3 h-3 mr-1" /> Único
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                className="h-8 text-[9px] font-black uppercase tracking-tighter bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                                onClick={() => onAddServiceToCart(service, true)}
                              >
                                <RefreshCw className="w-3 h-3 mr-1" /> Suscribir
                              </Button>
                            </div>
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

                <TabsContent value="giftcards" className="flex-1 overflow-hidden mt-0 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="mx-auto max-w-sm">
                    <Card className="border-blue-500/20 shadow-xl overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-500/10 p-4">
                        <CardTitle className="flex items-center text-blue-600 text-sm font-black uppercase tracking-tighter">
                          <Ticket className="mr-2 h-4 w-4" />
                          Emitir Tarjeta Regalo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Monto de la Tarjeta</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-7 h-12 text-lg font-black border-blue-500/20 focus:border-blue-500 transition-all"
                              value={giftCardForm.amount}
                              onChange={(e) => onSetGiftCardForm({ ...giftCardForm, amount: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Código Personalizado (Opcional)</Label>
                          <Input
                            placeholder="Dejar vacío para autogenerar"
                            className="h-10 text-xs font-bold border-blue-500/10 focus:border-blue-500 transition-all uppercase"
                            value={giftCardForm.code}
                            onChange={(e) => onSetGiftCardForm({ ...giftCardForm, code: e.target.value })}
                          />
                        </div>

                        <Button 
                          className="w-full h-12 text-xs font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                          onClick={onAddGiftCardToCart}
                        >
                          <Plus className="mr-2 h-4 w-4 shrink-0" />
                          Añadir al Carrito
                        </Button>

                        <div className="rounded-xl bg-blue-500/5 p-4 border border-blue-500/10">
                          <div className="flex items-start gap-3">
                            <Star className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                            <div>
                               <p className="text-[9px] font-black uppercase text-blue-600/70 tracking-widest">Estrategia POS</p>
                               <p className="text-[10px] text-muted-foreground italic leading-relaxed mt-1">
                                Las tarjetas de regalo aumentan la recurrencia un 40%. ¡Ideal para captar nuevos clientes!
                               </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="p-2 pb-1 px-3 mb-0.5">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black uppercase tracking-tight">Carrito</span>
                  {heldCarts.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-6 px-2 text-[9px] font-black bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-full animate-pulse">
                          {heldCarts.length} EN COLA
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0 shadow-2xl rounded-2xl border-border bg-card/95 backdrop-blur-md overflow-hidden" align="start">
                        <div className="p-3 bg-amber-500/10 border-b border-amber-500/10 flex items-center justify-between">
                          <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-600">Ventas en Espera</h3>
                          <Badge variant="outline" className="text-[9px] bg-white/50">{heldCarts.length}</Badge>
                        </div>
                        <ScrollArea className="h-64">
                          <div className="p-2 space-y-2">
                            {heldCarts.map(held => (
                              <div key={held.id} className="p-3 rounded-xl border border-border bg-background/50 hover:bg-accent/30 transition-colors group">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-[10px] font-black uppercase tracking-tighter truncate max-w-[150px]">
                                    {held.customer?.name || "Cliente General"}
                                  </p>
                                  <p className="text-[9px] font-bold text-muted-foreground">
                                    {new Date(held.heldAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-black text-primary">{formatCurrency(held.total)}</p>
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-7 w-7 p-0 text-red-500 hover:bg-red-50" 
                                      onClick={() => onDeleteHeldCart?.(held.id)}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="h-7 text-[10px] font-black uppercase px-3 bg-primary hover:bg-primary/90" 
                                      onClick={() => onResumeCart?.(held.id)}
                                    >
                                      Reanudar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {cart.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-[10px] font-black border-amber-500/30 text-amber-600 hover:bg-amber-50" 
                            onClick={onHoldCart}
                          >
                            <Clock className="w-3.5 h-3.5 mr-1" /> PAUSAR
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Poner esta venta en espera para atender a otro cliente</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {cart.length > 0 && <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold" onClick={onClearCart}>Limpiar</Button>}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-2">
              <div className="mb-2">
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="shrink-0 text-primary border-primary/20 bg-primary/5 hover:bg-primary hover:text-white transition-all cursor-pointer"
                          onClick={() => onSetCustomerDialog(true)}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">Registrar nuevo cliente</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {cartCustomer && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="mt-2 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-sm shadow-primary/10"
                  >
                    <div className="p-2 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase font-black tracking-widest text-primary/60 leading-none mb-1">Cliente</p>
                          <p className="text-xs font-black text-primary dark:text-primary truncate">{cartCustomer.name}</p>
                        </div>
                      </div>
                      
                      {cartPaymentMethod === "CREDIT" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: "auto" }}
                          className="pt-1.5 border-t border-primary/10 flex items-center justify-between"
                        >
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Crédito libre</span>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${ (cartCustomer.creditLimit - (cartCustomer.pendingBalance || 0)) > 0 ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-red-500/10 text-red-500" }`}>
                            {formatCurrency(cartCustomer.creditLimit - (cartCustomer.pendingBalance || 0))}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Descuentos y Beneficios - Colapsable para simplificar el carrito */}
              {((loyaltyConfig?.isActive && cartCustomer) || true) && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-7 px-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 gap-2 ${showDiscounts ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-primary"}`}
                      onClick={() => setShowDiscounts(!showDiscounts)}
                    >
                      <Plus className={`w-3 h-3 transition-transform duration-300 ${showDiscounts ? "rotate-45" : ""}`} />
                      {appliedCoupon || redeemPoints > 0 ? "Beneficios Aplicados" : "Aplicar Cupón / Puntos"}
                    </Button>
                    
                    {(appliedCoupon || redeemPoints > 0) && (
                      <Badge variant="outline" className="h-5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-black uppercase px-2 animate-pulse">
                        Activo
                      </Badge>
                    )}
                  </div>

                  <AnimatePresence>
                    {(showDiscounts || appliedCoupon || redeemPoints > 0) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                        className="overflow-hidden"
                      >
                        {isAdmin ? (
                          <Tabs defaultValue="loyalty" className="w-full">
                            <TabsList className="grid grid-cols-2 h-8 p-0.5 bg-muted/50">
                              <TabsTrigger value="loyalty" className="text-[10px] uppercase font-bold gap-1.5 h-7">
                                <Star className="w-3 h-3 text-amber-500" /> Puntos
                              </TabsTrigger>
                              <TabsTrigger value="coupon" className="text-[10px] uppercase font-bold gap-1.5 h-7">
                                <Ticket className="w-3 h-3 text-blue-500" /> Cupón
                              </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="loyalty" className="mt-2 space-y-2 p-2 bg-muted/20 rounded-lg border border-dashed border-border/60">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Disponibles: <span className="text-amber-600 dark:text-amber-500">{cartCustomer?.points || 0} pts</span></span>
                                </div>
                                {loyaltyConfig?.isActive && (cartCustomer?.points >= loyaltyConfig.minPointsToRedeem) && (
                                  <Button size="sm" variant="ghost" className="h-5 text-[9px] text-primary hover:bg-primary/10 px-1 font-black" onClick={() => onSetRedeemPoints(cartCustomer?.points || 0)}>
                                    USAR TODOS
                                  </Button>
                                )}
                              </div>
                              <div className="flex gap-2 items-center">
                                <Input 
                                  type="number" 
                                  placeholder="Pts..." 
                                  className="h-7 text-xs bg-background/50 border-amber-500/20 focus-visible:ring-amber-500/30"
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
                                  {appliedCoupon ? <CheckCircle2 className="w-3 h-3 text-primary" /> : "APLICAR"}
                                </Button>
                              </div>
                              {appliedCoupon && (
                                <p className="text-[9px] text-primary dark:text-primary font-bold px-1 flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> {appliedCoupon.description || appliedCoupon.code} (-{formatCurrency(couponDiscount)})
                                </p>
                              )}
                            </TabsContent>
                          </Tabs>
                        ) : (
                          <div className="p-3 bg-slate-100/50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-border flex items-center gap-3 opacity-60">
                             <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                <Ticket className="w-4 h-4 text-slate-400" />
                             </div>
                             <p className="text-[10px] font-medium text-muted-foreground uppercase leading-tight">Descuentos y cupones desactivados.<br/><span className="font-black text-[9px] text-slate-400">REQUIERE AUTORIZACIÓN ADMIN</span></p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              <ScrollArea className="flex-1 mb-1.5">
                <AnimatePresence mode="popLayout">
                  <div className="space-y-1">
                    {cart.map((item, index) => (
                      <motion.div
                        key={`${item.type}-${item.id}`}
                        layout
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.8 }}
                        className="group flex items-center gap-2 p-2 bg-muted/30 hover:bg-muted/50 rounded-xl border border-transparent hover:border-border transition-all shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border text-muted-foreground group-hover:text-primary transition-colors">
                          {item.type === "PRODUCT" ? <Package className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-sm truncate">{item.name}</p>
                            {item.presentation && (
                              <Badge variant="outline" className="h-4 px-1 text-[8px] font-black bg-indigo-50 text-indigo-500 border-indigo-200">
                                {item.presentation.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{formatCurrency(item.price)} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center bg-background rounded-lg border p-0.5 shadow-sm">
                          <Button size="icon" variant="ghost" className="w-5 h-5" onClick={() => onUpdateCartQuantity(item.id, item.quantity - 1)}>-</Button>
                          <span className="w-6 text-center text-[11px] font-black text-primary">{item.quantity}</span>
                          <Button size="icon" variant="ghost" className="w-5 h-5" onClick={() => onUpdateCartQuantity(item.id, item.quantity + 1)}>+</Button>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="w-7 h-7 text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100" 
                          onClick={() => onUpdateCartQuantity(item.id, 0)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
              
              <div className="mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Método de Pago</p>
                  <TooltipProvider>
                    <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                      {[
                        { id: "CASH", label: "Efectivo", icon: Wallet, tip: "Pago en efectivo" },
                        { id: "CARD", label: "Tarjeta", icon: CreditCard, tip: "Pago con tarjeta de débito/crédito" },
                        { id: "TRANSFER", label: "Transf.", icon: RefreshCw, tip: "Transferencia bancaria / QR" },
                        { id: "CREDIT", label: "Crédito", icon: FileText, tip: "Venta a crédito para el cliente" },
                        { id: "GIFT_CARD", label: "Regalo", icon: Ticket, tip: "Redimir tarjeta de regalo" },
                        { id: "MIXED", label: "Mixto", icon: LayoutGrid, tip: "Múltiples medios de pago" }
                      ].filter(m => {
                        const branchMethods = currentBranch?.enabledPaymentMethods?.split(",").filter(Boolean);
                        if (branchMethods && branchMethods.length > 0) {
                          return branchMethods.includes(m.id);
                        }
                        if (!businessSettings?.enabledPaymentMethods) return true;
                        const enabled = businessSettings.enabledPaymentMethods.split(",").filter(Boolean);
                        return enabled.includes(m.id);
                      }).map(method => (
                        <Tooltip key={method.id}>
                          <TooltipTrigger asChild>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                  variant={cartPaymentMethod === method.id ? "default" : "outline"}
                                  className={`w-full h-8 px-1 text-[11px] font-black uppercase cursor-pointer transition-all duration-200 ${cartPaymentMethod === method.id ? "bg-primary hover:bg-primary shadow-sm" : "hover:border-emerald-300"}`}
                                  onClick={() => onSetCartPaymentMethod(method.id)}
                                >
                                  <method.icon className="w-4 h-4 mr-1" />{method.label}
                                </Button>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>{method.tip}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
              </div>
              
              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-tight"><span>Subtotal bruto</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-tight"><span>IVA (19%)</span><span>{formatCurrency(tax)}</span></div>
                
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-[10px] font-black text-amber-600 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200/50 dark:border-amber-900/30 uppercase">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-500" /> Puntos</span>
                    <span>-{formatCurrency(loyaltyDiscount)}</span>
                  </div>
                )}
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[10px] font-black text-blue-600 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200/50 dark:border-blue-900/30 uppercase">
                    <span className="flex items-center gap-1"><Ticket className="w-3 h-3 fill-blue-500 border-none" /> Cupón</span>
                    <span>-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                
                <div className="my-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                
                <div className="flex justify-between items-center p-1.5 px-3 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all duration-300">
                  <div className="flex flex-col">
                    <p className="text-[9px] uppercase font-black tracking-widest opacity-60">Total a Pagar</p>
                    <p className="text-xl font-black tabular-nums leading-none">
                      {formatCurrency(total)}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded flex bg-white/20 backdrop-blur-sm">
                    <div className="w-1 h-1 rounded-full bg-emerald-300 animate-pulse" />
                    <p className="text-[8px] font-black uppercase tracking-tighter">Balance</p>
                  </div>
                </div>

                {/* Pago Mixto / Detalle de Pagos */}
                {(cartPaymentMethod === "MIXED" || cartPayments.length > 1) && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-slate-100/50 dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-4 mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Desglose de Pagos</Label>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 text-[10px] font-black uppercase text-primary hover:text-primary hover:bg-emerald-50 px-2"
                        onClick={onAddPayment}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Añadir
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {cartPayments.map((payment, index) => (
                        <div key={index} className="flex gap-2 items-start group">
                          <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                              <Select 
                                value={payment.method} 
                                onValueChange={(val) => onUpdatePayment(index, { method: val })}
                              >
                                <SelectTrigger className="h-8 w-28 text-[10px] font-bold uppercase bg-background">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CASH">Efectivo</SelectItem>
                                  <SelectItem value="CARD">Tarjeta</SelectItem>
                                  <SelectItem value="TRANSFER">Transf.</SelectItem>
                                  <SelectItem value="CREDIT">Crédito</SelectItem>
                                  <SelectItem value="GIFT_CARD">Regalo</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="relative flex-1">
                                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-primary" />
                                <Input 
                                  type="number" 
                                  value={payment.amount || ""}
                                  onChange={(e) => onUpdatePayment(index, { amount: parseFloat(e.target.value) || 0 })}
                                  className="h-8 pl-6 pr-8 text-xs font-black tabular-nums bg-background"
                                  placeholder="0"
                                />
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="absolute right-0 top-0 h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                  title="Completar saldo"
                                  onClick={() => {
                                    const otherPaymentsTotal = cartPayments.reduce((sum, p, i) => i === index ? sum : sum + p.amount, 0)
                                    const remainder = Math.max(0, total - otherPaymentsTotal)
                                    onUpdatePayment(index, { amount: remainder })
                                  }}
                                >
                                  <Wand2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            
                            {payment.method === "GIFT_CARD" && (
                              <div className="relative">
                                <Ticket className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-500" />
                                <Input 
                                  placeholder="CÓDIGO GIFT CARD"
                                  value={payment.details?.code || ""}
                                  onChange={(e) => onUpdatePayment(index, { details: { ...payment.details, code: e.target.value.toUpperCase() } })}
                                  className="h-7 pl-7 text-[9px] font-black uppercase bg-blue-500/5 border-blue-500/20"
                                />
                              </div>
                            )}
                          </div>
                          
                          {cartPayments.length > 1 && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                              onClick={() => onRemovePayment(index)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-zinc-800">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                        <span>Restante</span>
                        <span className={total - cartPayments.reduce((sum, p) => sum + p.amount, 0) === 0 ? "text-primary" : "text-amber-600"}>
                          {formatCurrency(Math.max(0, total - cartPayments.reduce((sum, p) => sum + p.amount, 0)))}
                        </span>
                      </div>
                      <div className="mt-1 h-1 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (cartPayments.reduce((sum, p) => sum + p.amount, 0) / total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Vista Simple (Backward compatibility / Fast payment) */}
                {cartPaymentMethod !== "MIXED" && cartPayments.length <= 1 && (
                  <>
                    {cartPaymentMethod === "GIFT_CARD" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20 space-y-3 mb-4"
                      >
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold text-blue-600">Código de Tarjeta de Regalo</Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Ticket className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-500" />
                              <Input 
                                placeholder="GIFT-XXXX"
                                value={giftCardCode}
                                ref={giftCardInputRef}
                                onChange={(e) => onSetGiftCardCode(e.target.value)}
                                className="h-8 pl-7 bg-background border-blue-500/30 font-bold text-blue-600 uppercase" 
                              />
                            </div>
                            <Button 
                              size="sm" 
                              className={`h-8 px-3 text-[10px] font-black uppercase shadow-md transition-colors ${appliedGiftCard ? "bg-primary hover:bg-primary" : "bg-blue-600 hover:bg-blue-700"}`}
                              onClick={onValidateGiftCard}
                            >
                              {appliedGiftCard ? <CheckCircle2 className="w-4 h-4" /> : "LISTO"}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {cartPaymentMethod === "CASH" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-3 mb-4"
                      >
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold text-primary">Dinero entregado</Label>
                          <div className="relative">
                            <Wallet className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-primary" />
                            <Input 
                              type="number" 
                              placeholder="0"
                              value={cashReceived || ""}
                              onChange={(e) => {
                                onCashReceivedChange(parseFloat(e.target.value) || 0)
                                onUpdatePayment(0, { amount: total }) // Sync with simple payment
                              }}
                              className="h-8 pl-7 bg-background dark:bg-slate-900 border-primary/30 font-bold text-primary dark:text-primary" 
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

              </div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-3">
                {cartPaymentMethod === "GIFT_CARD" && (
                  (!cartCustomer || !appliedGiftCard || appliedGiftCard.balance < total) && (
                    <p className="text-[9px] font-black text-red-500 text-center mb-1 uppercase tracking-tight">
                      {!cartCustomer 
                        ? "Cliente requerido" 
                        : !appliedGiftCard 
                          ? "Tarjeta no validada" 
                          : "Saldo insuficiente"}
                    </p>
                  )
                )}
                {cartPaymentMethod === "CREDIT" && !cartCustomer && (
                  <p className="text-[9px] font-black text-red-500 text-center mb-1 uppercase tracking-tight">
                    Cliente registrado requerido
                  </p>
                )}

                <Button 
                  className={`w-full h-11 cursor-pointer transition-all duration-300 shadow-md ${
                    cartPaymentMethod === "GIFT_CARD" && (!appliedGiftCard || appliedGiftCard.balance < total || !cartCustomer)
                      ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
                      : "bg-primary hover:bg-primary shadow-primary/20"
                  } font-black uppercase text-xs tracking-widest`}
                  disabled={
                    cart.length === 0 || 
                    !cashRegister ||
                    (cartPaymentMethod === "GIFT_CARD" && (!appliedGiftCard || appliedGiftCard.balance < total || !cartCustomer)) ||
                    (cartPaymentMethod === "CREDIT" && !cartCustomer)
                  } 
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

"use client"

import { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react"
import { toast } from "sonner"
import { 
  ProductData, CategoryData, CustomerData, CreditWithDetails, 
  DashboardStats, CashRegisterData, NotificationData, ExpenseData, 
  BranchData, TenantUserData, SubscriptionServiceData, CustomerSubscriptionData, 
  SubscriptionStats, ProductBatchData
} from "@/types"
import { formatCurrency, getDaysOverdue } from "@/lib/utils"

export const usePOS = (session: any) => {
  // POS state
  const [posTab, setPosTab] = useState("dashboard")
  const [batchDialogOpen, setBatchDialogOpen] = useState(false)
  const [activeProductForBatch, setActiveProductForBatch] = useState<ProductData | null>(null)
  const [availableBatches, setAvailableBatches] = useState<ProductBatchData[]>([])
  const [products, setProducts] = useState<ProductData[]>([])
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [credits, setCredits] = useState<CreditWithDetails[]>([])
  const [dashboardStats, setDashboardStats] = useState<any>({
    todaySales: 0, todayTransactions: 0, monthSales: 0, pendingCredits: 0,
    lowStockProducts: 0, dailyGoal: 1000000, monthlyGoal: 0,
    weeklySales: [],
    topProducts: [],
    recentSales: []
  })
  const [cashRegister, setCashRegister] = useState<CashRegisterData | null>(null)
  const [suppliers, setSuppliers] = useState<any[]>([])
  
  // New state
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  
  const [expenses, setExpenses] = useState<ExpenseData[]>([])
  const [branches, setBranches] = useState<BranchData[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string | null>(session?.user?.branchId || null)
  const [creditFilter, setCreditFilter] = useState<string>("all")
  const [creditSearch, setCreditSearch] = useState<string>("")
  const [tenantUsers, setTenantUsers] = useState<TenantUserData[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [saleSearch, setSaleSearch] = useState<string>("")
  const [cashHistory, setCashHistory] = useState<any[]>([])
  
  // Cart state
  const [cart, setCart] = useState<{ 
    id: string; 
    name: string; 
    price: number; 
    quantity: number; 
    type: "PRODUCT" | "SERVICE"; 
    isSubscription?: boolean;
    data: any 
  }[]>([])
  const [cartCustomer, setCartCustomer] = useState<CustomerData | null>(null)
  const [cartPaymentMethod, setCartPaymentMethod] = useState<string>("CASH")
  const [cartPayments, setCartPayments] = useState<{ method: string, amount: number, details?: any }[]>([])
  const [cartDiscount, setCartDiscount] = useState(0)
  
  // Dialogs
  const [productDialog, setProductDialog] = useState(false)
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [customerDialog, setCustomerDialog] = useState(false)
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [cashDialog, setCashDialog] = useState(false)
  const [expenseDialog, setExpenseDialog] = useState(false)
  const [branchDialog, setBranchDialog] = useState(false)
  const [bulkUploadDialog, setBulkUploadDialog] = useState(false)
  const [userDialog, setUserDialog] = useState(false)
  const [stockAdjustmentDialog, setStockAdjustmentDialog] = useState(false)
  const [supplierDialog, setSupplierDialog] = useState(false)
  const [presentationDialogOpen, setPresentationDialogOpen] = useState(false)
  const [activeProductForPresentation, setActiveProductForPresentation] = useState<any>(null)
  const [activePresentation, setActivePresentation] = useState<any>(null)
  const [selectedProductForStock, setSelectedProductForStock] = useState<any>(null)
  
  // Form states
  const [productForm, setProductForm] = useState({
    code: "", sku: "", name: "", description: "", costPrice: 0, salePrice: 0, wholesalePrice: 0, 
    stock: 0, minStock: 5, unit: "unidad", categoryId: "", isActive: true,
    expiryDate: "", imageUrl: "",
    supplierId: "", batchNumber: "",
    presentations: [] as any[]
  })
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", color: "#10B981", icon: "🏷️", imageUrl: "" })
  const [customerForm, setCustomerForm] = useState({ name: "", document: "", phone: "", email: "", address: "", creditLimit: 0 })
  const [supplierForm, setSupplierForm] = useState({ name: "", nit: "", phone: "", email: "", address: "", notes: "" })
  const [editingSupplier, setEditingSupplier] = useState<any | null>(null)
  const [selectedCredit, setSelectedCredit] = useState<CreditWithDetails | null>(null)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentNotes, setPaymentNotes] = useState("")
  
  // New form states
  const [expenseForm, setExpenseForm] = useState({
    category: "Servicios", description: "", amount: 0,
    date: new Date().toISOString().split('T')[0], notes: ""
  })
  const [branchForm, setBranchForm] = useState({
    name: "", address: "", phone: "", city: "", isMain: false, monthlyGoal: 0,
    logoUrl: "", themeColor: "#10b981", enabledPaymentMethods: "CASH,CARD,TRANSFER,CREDIT,MIXED,GIFT_CARD"
  })
  const [bulkUploadData, setBulkUploadData] = useState("")
  const [editingBranch, setEditingBranch] = useState<BranchData | null>(null)
  const [editingUser, setEditingUser] = useState<TenantUserData | null>(null)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [userForm, setUserForm] = useState({
    name: "", email: "", password: "", role: "CASHIER", branchIds: [] as string[], phone: "", isQuickAccess: false
  })
  
  // Subscription state
  const [subscriptionServices, setSubscriptionServices] = useState<SubscriptionServiceData[]>([])
  const [subscriptions, setSubscriptions] = useState<CustomerSubscriptionData[]>([])
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats | null>(null)
  const [subscriptionServiceForm, setSubscriptionServiceForm] = useState({
    name: "", code: "", description: "", price: "", setupFee: "0",
    billingCycle: "MONTHLY", durationMonths: "", isActive: true,
    maxFreezes: "0", freezeDaysMax: "0", categoryId: ""
  })
  const [newSubscription, setNewSubscription] = useState({
    customerId: "", serviceId: "", startDate: "", agreedPrice: "",
    discountPercent: "0", discountReason: "", notes: "", initialPayment: "0", paymentMethod: "CASH"
  })
  const [editingSubscriptionService, setEditingSubscriptionService] = useState<SubscriptionServiceData | null>(null)
  const [showSubscriptionServiceDialog, setShowSubscriptionServiceDialog] = useState(false)
  const [showNewSubscriptionDialog, setShowNewSubscriptionDialog] = useState(false)
  const [showSubscriptionPaymentDialog, setShowSubscriptionPaymentDialog] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<CustomerSubscriptionData | null>(null)
  const [subscriptionPaymentAmount, setSubscriptionPaymentAmount] = useState("")
  const [subscriptionPaymentMethod, setSubscriptionPaymentMethod] = useState("CASH")
  const [subscriptionTab, setSubscriptionTab] = useState("services")
  const [showFreezeDialog, setShowFreezeDialog] = useState(false)
  const [freezeDays, setFreezeDays] = useState("30")
  const [showConfetti, setShowConfetti] = useState(false)
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [lastSale, setLastSale] = useState<any>(null)
  const [receiptDialog, setReceiptDialog] = useState(false)
  const [cashReportDialog, setCashReportDialog] = useState(false)
  const [cashReceived, setCashReceived] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  
  // Loyalty & Coupons state
  const [loyaltyConfig, setLoyaltyConfig] = useState<any>(null)
  const [coupons, setCoupons] = useState<any[]>([])
  const [redeemPoints, setRedeemPoints] = useState<number>(0)
  const [couponCode, setCouponCode] = useState<string>("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  
  // Held Carts (Ventas en Espera)
  const [heldCarts, setHeldCarts] = useState<{
    id: string;
    customer: CustomerData | null;
    cart: any[];
    total: number;
    heldAt: string;
    paymentMethod: string;
  }[]>([])
  
  // Gift Cards state
  const [giftCards, setGiftCards] = useState<any[]>([])
  const [giftCardCode, setGiftCardCode] = useState<string>("")
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null)
  const [giftCardDialog, setGiftCardDialog] = useState(false)
  const [giftCardForm, setGiftCardForm] = useState({
    amount: "",
    code: "",
    customerId: ""
  })
  const [showGiftCardPrintDialog, setShowGiftCardPrintDialog] = useState(false)
  const [selectedGiftCard, setSelectedGiftCard] = useState<any>(null)
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "destructive" | "default";
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "destructive"
  });

  const askConfirm = (title: string, message: string, onConfirm: () => void, variant: "destructive" | "default" = "destructive") => {
    setConfirmDialog({ open: true, title, message, onConfirm, variant });
  };

  // History state
  const [historyDialog, setHistoryDialog] = useState(false)
  const [historyItems, setHistoryItems] = useState<any[]>([])
  const [historyTitle, setHistoryTitle] = useState("")
  const [historyDescription, setHistoryDescription] = useState("")

  const handleOpenHistory = (items: any[], title: string, description: string = "") => {
    setHistoryItems(items)
    setHistoryTitle(title)
    setHistoryDescription(description)
    setHistoryDialog(true)
  }

  // Business settings
  const [businessSettings, setBusinessSettings] = useState<any>(null)
  const fetchBusinessSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/business")
      const data = await res.json()
      if (data.success) {
        setBusinessSettings(data.data)
      }
    } catch { console.error("Error fetching business settings") }
  }, [])

  const handleUpdateBusinessSettings = async (payload: any) => {
    try {
      const res = await fetch("/api/settings/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Configuración actualizada")
        setBusinessSettings(data.data)
        return true
      } else {
        toast.error(data.error || "Error al actualizar")
        return false
      }
    } catch { 
      toast.error("Error de conexión")
      return false
    }
  }

  // Profile management
  const [profileDialog, setProfileDialog] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "", 
    password: ""
  })

  // Sync profile form with session
  useEffect(() => {
    if (session?.user) {
      setProfileForm(prev => ({
        ...prev,
        name: session.user.name,
        email: session.user.email,
        phone: prev.phone // Phone is not in base session, needs fetching or manual update
      }))
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile")
      const data = await res.json()
      if (data.success) {
        setProfileForm({
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone || "",
          password: ""
        })
      }
    } catch { console.error("Error fetching profile") }
  }

  useEffect(() => {
    if (profileDialog) fetchProfile()
  }, [profileDialog])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Perfil actualizado con éxito")
        setProfileDialog(false)
        // Recargar página para actualizar sesión de NextAuth (o usar update() de useSession)
        setTimeout(() => window.location.reload(), 1500)
      } else {
        toast.error(data.error || "Error al actualizar perfil")
      }
    } catch { toast.error("Error de conexión al actualizar perfil") }
  }
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const barcodeBuffer = useRef<string>("")
  const lastKeyTime = useRef<number>(0)
  const prevBranchRef = useRef<string | null>(selectedBranch)

  // API CALLS
  const fetchPOSData = useCallback(async () => {
    if (!session?.user?.tenantId) return
    try {
      const query = selectedBranch ? `?branchId=${selectedBranch}` : ""
      const statsQuery = selectedBranch ? `?type=stats&branchId=${selectedBranch}` : "?type=stats"
      
      const [productsRes, categoriesRes, customersRes, statsRes, cashRes, creditsRes] = await Promise.all([
        fetch(`/api/products${query}`),
        fetch(`/api/categories${query}`),
        fetch(`/api/customers`), // Clientes usualmente son compartidos por tenant
        fetch(`/api/sales${statsQuery}`),
        fetch(`/api/cash${query}`),
        fetch(`/api/credits${query}`)
      ])
      
      // Si detectamos 401 (No autorizado) tras un reinicio de base de datos, forzar recarga
      if ([productsRes, categoriesRes, customersRes, statsRes, cashRes, creditsRes].some(r => r.status === 401)) {
        window.location.reload()
        return
      }
      
      if (productsRes.ok) setProducts((await productsRes.json()).data)
      if (categoriesRes.ok) setCategories((await categoriesRes.json()).data)
      if (customersRes.ok) setCustomers((await customersRes.json()).data)
      if (statsRes.ok) setDashboardStats((await statsRes.json()).data)
      if (cashRes.ok) setCashRegister((await cashRes.json()).data)
      if (creditsRes.ok) setCredits((await creditsRes.json()).data)
      
      const giftCardsRes = await fetch("/api/gift-cards")
      if (giftCardsRes.ok) setGiftCards((await giftCardsRes.json()).data)

      const suppliersRes = await fetch("/api/suppliers")
      if (suppliersRes.ok) setSuppliers((await suppliersRes.json()).data)

      await fetchBusinessSettings()
    } catch (error) {
      console.error("Error fetching POS data:", error)
    }
  }, [session, selectedBranch, fetchBusinessSettings])

  const fetchNotifications = useCallback(async () => {
    if (!session?.user?.tenantId) return
    try {
      const query = selectedBranch ? `?branchId=${selectedBranch}` : ""
      const res = await fetch(`/api/notifications${query}`)
      const data = await res.json()
      if (data.success) setNotifications(data.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }, [session, selectedBranch])

  const handleClearNotifications = async () => {
    if (notifications.length === 0) return
    try {
      const dynamicAlerts = notifications
        .filter(n => n.referenceId && !n.isRead)
        .map(n => ({
           type: n.type,
           title: n.title,
           message: n.message,
           referenceType: n.referenceType,
           referenceId: n.referenceId
        }))

      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true, dynamicAlerts })
      })
      
      if ((await res.json()).success) {
        toast.success("Notificaciones limpiadas")
        fetchNotifications()
      }
    } catch (error) {
      console.error("Error clearing notifications:", error)
      toast.error("Error al limpiar notificaciones")
    }
  }

  const fetchSales = useCallback(async () => {
    if (!session?.user?.tenantId) return
    try {
      const query = selectedBranch ? `?type=list&branchId=${selectedBranch}` : "?type=list"
      const res = await fetch(`/api/sales${query}`)
      const data = await res.json()
      if (data.success) setSales(data.data)
    } catch (error) {
      console.error("Error fetching sales:", error)
    }
  }, [session, selectedBranch])

  const fetchExpenses = useCallback(async () => {
    if (!session?.user?.tenantId) return
    try {
      const query = selectedBranch ? `?branchId=${selectedBranch}` : ""
      const res = await fetch(`/api/expenses${query}`)
      const data = await res.json()
      if (data.success) setExpenses(data.data)
    } catch (error) {
      console.error("Error fetching expenses:", error)
    }
  }, [session, selectedBranch])

  const fetchBranches = useCallback(async () => {
    if (!session?.user?.tenantId) return
    try {
      const res = await fetch("/api/branches")
      const data = await res.json()
      if (data.success) {
        setBranches(data.data)
        // Auto-seleccionar sede si no hay una (Admin entrando por primera vez)
        if (!selectedBranch && data.data.length > 0) {
          const main = data.data.find((b: any) => b.isMain) || data.data[0]
          setSelectedBranch(main.id)
          // Refrescar datos con la nueva sede inmediatamente
          fetchPOSData() 
          fetchNotifications()
        }
      }
    } catch (error) {
      console.error("Error fetching branches:", error)
    }
  }, [session, selectedBranch])

  const fetchUsers = useCallback(async () => {
    if (!session?.user?.tenantId) return
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      if (data.success) setTenantUsers(data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }, [session])

  const fetchSubscriptionServices = useCallback(async () => {
    if (!session?.user?.tenantId) return
    try {
      const res = await fetch("/api/subscription-services")
      const data = await res.json()
      if (data.success) setSubscriptionServices(data.data)
    } catch (error) {
      console.error("Error fetching subscription services:", error)
    }
  }, [session])

  const fetchSubscriptions = useCallback(async () => {
    if (!session?.user?.tenantId) return
    try {
      const res = await fetch("/api/subscriptions")
      const data = await res.json()
      if (data.success) {
        setSubscriptions(data.data)
        setSubscriptionStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
    }
  }, [session])

  const fetchProductBatches = async (productId: string) => {
    if (!selectedBranch) return []
    try {
      const res = await fetch(`/api/products/${productId}/batches?branchId=${selectedBranch}`)
      const data = await res.json()
      return data.success ? data.data : []
    } catch (error) {
      console.error("Error fetching batches:", error)
      return []
    }
  }

  const fetchCredits = useCallback(async () => {
    try {
      const query = selectedBranch ? `?branchId=${selectedBranch}` : ""
      const res = await fetch(`/api/credits${query}`)
      const data = await res.json()
      if (data.success) setCredits(data.data)
    } catch (error) {
      console.error("Error fetching credits:", error)
    }
  }, [selectedBranch])

  const fetchLoyaltyConfig = useCallback(async () => {
    try {
      const query = selectedBranch ? `?branchId=${selectedBranch}` : ""
      const res = await fetch(`/api/loyalty/config${query}`)
      const data = await res.json()
      if (data.success) setLoyaltyConfig(data.data)
    } catch (error) { console.error("Error fetching loyalty config:", error) }
  }, [selectedBranch])

  const fetchCoupons = useCallback(async () => {
    try {
      const query = selectedBranch ? `?branchId=${selectedBranch}` : ""
      const res = await fetch(`/api/loyalty/coupons${query}`)
      const data = await res.json()
      if (data.success) setCoupons(data.data)
    } catch (error) { console.error("Error fetching coupons:", error) }
  }, [selectedBranch])

  const fetchCashHistory = useCallback(async () => {
    try {
      const query = selectedBranch ? `?branchId=${selectedBranch}&type=history` : "?type=history"
      const res = await fetch(`/api/cash${query}`)
      const data = await res.json()
      if (data.success) setCashHistory(data.data)
    } catch (error) { console.error("Error fetching cash history:", error) }
  }, [selectedBranch])

  // Carga automática de servicios y suscripciones cuando el tab está activo o la sesión cambia
  useEffect(() => {
    if (posTab === "subscriptions" && session?.user?.tenantId) {
      fetchSubscriptionServices();
      fetchSubscriptions();
    }
  }, [posTab, session, fetchSubscriptionServices, fetchSubscriptions]);

  // Initial Load
  useEffect(() => {
    if (session?.user?.tenantId) {
      fetchPOSData()
      fetchNotifications()
      fetchExpenses()
      fetchBranches()
      fetchUsers()
      fetchSales()
      fetchCredits()
      fetchLoyaltyConfig()
      fetchCashHistory()
    }
  }, [session, fetchPOSData, fetchNotifications, fetchExpenses, fetchBranches, fetchUsers, fetchSales, fetchCredits, fetchLoyaltyConfig, fetchCashHistory])
  
  useEffect(() => {
    if (notificationsOpen) {
      fetchNotifications()
    }
  }, [notificationsOpen, fetchNotifications])

  // Limpiar carrito al cambiar de sucursal para evitar errores de inventario cruzado
  useEffect(() => {
    // Solo limpiar si la sucursal realmente cambió y no es la carga inicial
    if (prevBranchRef.current !== null && prevBranchRef.current !== selectedBranch) {
      if (cart.length > 0) {
        setCart([])
        setCartCustomer(null)
        setCartDiscount(0)
        setRedeemPoints(0)
        setCouponCode("")
        setAppliedCoupon(null)
        setCashReceived(0)
        setChange(0)
        toast.info("Carrito limpiado por cambio de sucursal", {
          description: "Los productos de una sucursal no pueden venderse en otra."
        })
      }
    }
    
    // Forzar actualización de notificaciones al cambiar de sede
    fetchNotifications()
    
    // Actualizar el ref para la próxima comparación
    prevBranchRef.current = selectedBranch
  }, [selectedBranch, fetchNotifications, cart.length])

  // Sincronizar pago cuando el total del carrito cambia (si no es mixto)
  useEffect(() => {
    if (cartPaymentMethod !== "MIXED") {
      const { total } = getCartTotal()
      setCartPayments([{ method: cartPaymentMethod, amount: total }])
    }
  }, [cart.length, cartDiscount, redeemPoints, appliedCoupon, cartPaymentMethod])

  // Aplicar tema de la sede dinámicamente (usando useLayoutEffect para evitar parpadeos)
  useLayoutEffect(() => {
    if (!selectedBranch || branches.length === 0) return
    const branch = branches.find((b: any) => b.id === selectedBranch)
    const baseColor = branch?.themeColor || '#10b981'
    const oklch = hexToOklch(baseColor)

    // Propagar variables CSS al documento
    const root = document.documentElement
    root.style.setProperty('--primary', oklch)
    root.style.setProperty('--sidebar-primary', oklch)
    root.style.setProperty('--ring', `${oklch} / 50%`)
    root.style.setProperty('--accent-foreground', oklch)
    root.style.setProperty('--sidebar-accent-foreground', oklch)
    root.style.setProperty('--sidebar-accent', `${oklch} / 10%`)
    root.style.setProperty('--accent', `${oklch} / 10%`)

    // Inyectar Tipografía basada en el tema
    const roundedThemes = ['#db2777', '#f59e0b', '#8b5cf6']
    if (roundedThemes.includes(baseColor.toLowerCase())) {
      root.style.setProperty('--pos-font', '"Outfit", "Geist Variable", ui-rounded, sans-serif')
    } else {
      root.style.setProperty('--pos-font', '"Geist Variable", "Inter", ui-sans-serif, sans-serif')
    }
  }, [selectedBranch, branches])

  // Helper para convertir HEX a OKLCH (proporcionando tonos premium balanceados)
  function hexToOklch(hex: string) {
    if (!hex) return 'oklch(0.65 0.18 160)'
    
    // Mapeo detallado de colores premium (balanceados para legibilidad y estética)
    const premiumPalette: Record<string, string> = {
      '#10b981': 'oklch(0.65 0.18 160)', // Bosque Esmeralda
      '#db2777': 'oklch(0.65 0.22 330)', // Energía Neón
      '#0ea5e9': 'oklch(0.65 0.15 240)', // Océano Ártico
      '#f59e0b': 'oklch(0.75 0.15 70)',  // Atardecer Dorado
      '#8b5cf6': 'oklch(0.65 0.18 290)', // Amatista Real
      '#3b82f6': 'oklch(0.6 0.2 250)',   // Fuego Azul
      // Legado / Otros
      '#ef4444': 'oklch(0.6 0.25 25)',   
      '#ec4899': 'oklch(0.65 0.2 330)',
      '#06b6d4': 'oklch(0.65 0.15 200)',
    }
    
    return premiumPalette[hex.toLowerCase()] || 'oklch(0.65 0.18 160)'
  }

  // Subida de logo de sede
  const handleUploadBranchLogo = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "branches")
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setBranchForm(prev => ({ ...prev, logoUrl: data.imageUrl }))
        toast.success("Logo subido temporalmente")
        return data.imageUrl
      } else {
        toast.error(data.error || "Error al subir logo")
      }
    } catch { toast.error("Error de conexión al subir imagen") }
  }

  // Handlers
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!productForm.name?.trim()) {
      return toast.error("El nombre del producto es obligatorio")
    }
    
    if (!productForm.salePrice || parseFloat(String(productForm.salePrice)) <= 0) {
      return toast.error("El precio de venta debe ser mayor a 0")
    }

    try {
      // Saneamiento de datos antes de enviar
      const payload = {
        ...productForm,
        code: productForm.code?.trim() || null,
        sku: productForm.sku?.trim() || null,
        name: productForm.name,
        description: productForm.description,
        costPrice: parseFloat(String(productForm.costPrice)) || 0,
        salePrice: parseFloat(String(productForm.salePrice)) || 0,
        wholesalePrice: productForm.wholesalePrice ? parseFloat(String(productForm.wholesalePrice)) : null,
        stock: parseFloat(String(productForm.stock)) || 0,
        minStock: parseFloat(String(productForm.minStock)) || 5,
        expiryDate: productForm.expiryDate && productForm.expiryDate !== "" ? productForm.expiryDate : null,
        categoryId: productForm.categoryId || null,
        supplierId: productForm.supplierId || null,
        batchNumber: productForm.batchNumber || null,
        branchId: selectedBranch,
        presentations: productForm.presentations
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Producto creado con éxito")
        setProductDialog(false)
        setProductForm({ 
          code: "", sku: "", name: "", description: "", costPrice: 0, salePrice: 0, wholesalePrice: 0, 
          stock: 0, minStock: 5, unit: "unidad", categoryId: "", isActive: true,
          expiryDate: "", imageUrl: "", presentations: []
        })
        fetchPOSData()
      } else {
        toast.error(data.error || "Error al crear producto", { duration: 4000 })
      }
    } catch { toast.error("Error de conexión al servidor") }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    
    if (!productForm.name?.trim()) {
      return toast.error("El nombre del producto es obligatorio")
    }
    
    if (!productForm.salePrice || parseFloat(String(productForm.salePrice)) <= 0) {
      return toast.error("El precio de venta debe ser mayor a 0")
    }

    try {
      const payload = {
        ...productForm,
        code: productForm.code?.trim() || null,
        sku: productForm.sku?.trim() || null,
        name: productForm.name,
        description: productForm.description,
        imageUrl: productForm.imageUrl,
        costPrice: parseFloat(String(productForm.costPrice)) || 0,
        salePrice: parseFloat(String(productForm.salePrice)) || 0,
        wholesalePrice: productForm.wholesalePrice ? parseFloat(String(productForm.wholesalePrice)) : null,
        stock: parseFloat(String(productForm.stock)) || 0,
        minStock: parseFloat(String(productForm.minStock)) || 5,
        expiryDate: productForm.expiryDate && productForm.expiryDate !== "" ? productForm.expiryDate : null,
        categoryId: productForm.categoryId || null,
        supplierId: productForm.supplierId || null,
        batchNumber: productForm.batchNumber || null,
        presentations: productForm.presentations
      }

      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Producto actualizado")
        setProductDialog(false)
        setEditingProduct(null)
        setProductForm({ 
          code: "", sku: "", name: "", description: "", costPrice: 0, salePrice: 0, wholesalePrice: 0, 
          stock: 0, minStock: 5, unit: "unidad", categoryId: "", isActive: true,
          expiryDate: "", imageUrl: "", presentations: []
        })
        fetchPOSData()
      } else {
        toast.error(data.error || "Error al actualizar")
      }
    } catch { toast.error("Error de conexión") }
  }

  const handleDeleteProduct = async (id: string) => {
    askConfirm(
      "¿Eliminar producto?",
      "Esta acción eliminará el producto o lo desactivará si tiene transacciones vinculadas para preservar la integridad de los datos.",
      async () => {
        try {
          const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
          const data = await res.json()
          if (data.success) {
            toast.success(data.message || "Producto eliminado")
            fetchPOSData()
            setConfirmDialog(prev => ({ ...prev, open: false }))
          } else {
            toast.error(data.error || "No se pudo eliminar")
          }
        } catch { toast.error("Error de conexión") }
      }
    )
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...categoryForm,
          branchId: selectedBranch // Asegurar que se crea en la sucursal seleccionada
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Categoría creada con éxito")
        setCategoryDialog(false)
        setCategoryForm({ name: "", description: "", color: "#10B981", icon: "🏷️", imageUrl: "" })
        fetchPOSData()
      } else {
        toast.error(data.error || "Error al crear categoría")
      }
    } catch { toast.error("Error de conexión al servidor") }
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    try {
      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Categoría actualizada")
        setCategoryDialog(false)
        setEditingCategory(null)
        setCategoryForm({ name: "", description: "", color: "#10B981", icon: "🏷️", imageUrl: "" })
        fetchPOSData()
      } else {
        toast.error(data.error || "Error al actualizar")
      }
    } catch { toast.error("Error de conexión") }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        toast.success("Categoría eliminada")
        fetchPOSData()
      } else {
        toast.error(data.error || "No se pudo eliminar")
      }
    } catch { toast.error("Error de conexión") }
  }

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerForm)
      })
      if ((await res.json()).success) {
        toast.success("Cliente creado")
        setCustomerDialog(false)
        setCustomerForm({ name: "", document: "", phone: "", email: "", address: "", creditLimit: 0 })
        fetchPOSData()
      }
    } catch { toast.error("Error al crear cliente") }
  }

  const addToCart = async (product: ProductData, selectedBatch?: ProductBatchData, selectedPresentation?: any) => {
    // Check if stock is 0 (global or branch)
    if (product.stock <= 0) {
      toast.error(`Producto sin stock: ${product.name}`)
      return
    }

    // SI TIENE PRESENTACIONES Y NO SE HA SELECCIONADO UNA, PREGUNTAR
    if (!selectedPresentation && product.presentations && product.presentations.length > 0) {
      setActiveProductForPresentation(product)
      setPresentationDialogOpen(true)
      return
    }

    // SI TIENE LOTES Y NO SE HA SELECCIONADO UNO, BUSCARLOS
    if (!selectedBatch) {
      const batches = await fetchProductBatches(product.id)
      if (batches.length > 1) {
        setActiveProductForBatch(product)
        setAvailableBatches(batches)
        setBatchDialogOpen(true)
        // Guardamos la presentación seleccionada para usarla cuando se elija el lote
        setActivePresentation(selectedPresentation)
        return
      } else if (batches.length === 1) {
        // Si solo hay un lote, seleccionarlo automáticamente
        selectedBatch = batches[0]
      }
    }

    // Si llegamos aquí, o no hay lotes, o ya se seleccionó uno
    const cartItemId = `${product.id}${selectedBatch ? '-' + selectedBatch.id : ''}${selectedPresentation ? '-pres-' + selectedPresentation.id : ''}`
    const existing = cart.find(item => item.id === cartItemId)
    
    // El precio debe ser el del lote si se seleccionó, de lo contrario el del producto
    let priceToUse = selectedBatch ? selectedBatch.salePrice : product.salePrice
    const stockToConsider = selectedBatch ? selectedBatch.quantity : product.stock

    // Si hay presentación, aplicar factor de conversión al precio
    if (selectedPresentation) {
      priceToUse = selectedPresentation.price || (priceToUse * selectedPresentation.conversionFactor)
    }

    const quantityToAdd = 1 // En el POS siempre se añade de a 1 por defecto
    const stockQuantityToDeduct = selectedPresentation ? (quantityToAdd * selectedPresentation.conversionFactor) : quantityToAdd

    if (existing) {
      const currentStockDeducted = cart.reduce((acc, item) => {
        if (item.data.id === product.id && (selectedBatch ? item.batchId === selectedBatch.id : !item.batchId)) {
          const factor = item.presentation?.conversionFactor || 1
          return acc + (item.quantity * factor)
        }
        return acc
      }, 0)

      if (currentStockDeducted + stockQuantityToDeduct > stockToConsider) {
        toast.error(`No hay suficiente stock ${selectedBatch ? 'en este lote' : ''} para ${product.name}`)
        return
      }
      setCart(cart.map(item => item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      if (stockQuantityToDeduct > stockToConsider) {
        toast.error(`No hay suficiente stock para ${product.name}`)
        return
      }

      setCart([...cart, { 
        id: cartItemId, 
        name: selectedPresentation 
          ? `${product.name} (${selectedPresentation.name})` 
          : (selectedBatch ? `${product.name} (${selectedBatch.batchNumber || 'Lote'})` : product.name), 
        price: priceToUse, 
        quantity: 1, 
        type: "PRODUCT", 
        data: product,
        batchId: selectedBatch?.id || null,
        batchNumber: selectedBatch?.batchNumber || null,
        presentation: selectedPresentation || null,
        presentationId: selectedPresentation?.id || null
      }])
    }
    
    // Limpiar estados temporales
    setActivePresentation(null)
  }

  const addServiceToCart = (service: SubscriptionServiceData, isSubscription: boolean = true) => {
    if (!cartCustomer) {
      toast.error("¡Cliente requerido!", {
        description: "Las suscripciones y servicios deben estar vinculados a un cliente registrado por seguridad y seguimiento.",
        duration: 3000,
        icon: "👤"
      })
      return
    }

    // Identificador único para el carrito si el mismo servicio se añade como suscripción y como pago único
    const compositeId = `${service.id}-${isSubscription ? 'sub' : 'one'}`
    const existing = cart.find(item => item.id === compositeId)

    if (existing) {
      setCart(cart.map(item => item.id === compositeId ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, { 
        id: compositeId, 
        name: isSubscription ? `${service.name} (Suscrip.)` : `${service.name} (Pago Único)`,
        price: service.price, 
        quantity: 1, 
        type: "SERVICE", 
        isSubscription,
        data: service 
      }])
    }
  }

  // Barcode Scanner Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only active in "sale" tab
      if (posTab !== "sale") return

      const target = e.target as HTMLElement
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
      
      // If typing in an input, ONLY capture if it's the Enter key (end of scan)
      if (isInput && e.key !== "Enter") return

      const currentTime = Date.now()
      
      // Threshold to detect fast typing (scanner). Delta > 50ms is usually human.
      if (currentTime - lastKeyTime.current > 50) {
        barcodeBuffer.current = ""
      }

      if (e.key === "Enter") {
        if (barcodeBuffer.current.length >= 2) {
          const product = products.find(p => p.code === barcodeBuffer.current && p.isActive)
          if (product) {
            addToCart(product)
            toast.success(`Leído: ${product.name}`, {
              icon: "🏷️",
              duration: 2000
            })
            e.preventDefault()
          } else {
            const service = subscriptionServices.find(s => s.code === barcodeBuffer.current && s.isActive)
            if (service) {
              addServiceToCart(service)
              toast.success(`Leído: ${service.name}`, {
                icon: "⚡",
                duration: 2000
              })
              e.preventDefault()
            }
          }
        }
        barcodeBuffer.current = ""
      } else if (e.key.length === 1) {
        barcodeBuffer.current += e.key
      }

      lastKeyTime.current = currentTime
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [posTab, products, subscriptionServices, addToCart, addServiceToCart])

  const removeFromCart = (id: string) => setCart(cart.filter(item => item.id !== id))

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    const item = cart.find(c => c.id === id)
    if (item && item.type === "PRODUCT" && quantity > item.data.stock) {
      toast.error(`Stock insuficiente para ${item.name}`)
      return
    }

    setCart(cart.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const taxValue = businessSettings?.taxRate || 19
    const tax = Math.round(subtotal * (taxValue / 100))
    
    // Loyalty & Coupon discounts
    let loyaltyDiscount = 0
    if (loyaltyConfig?.isActive && redeemPoints > 0) {
      loyaltyDiscount = redeemPoints * loyaltyConfig.redemptionValue
    }
    
    let couponDiscount = 0
    if (appliedCoupon) {
      if (appliedCoupon.type === "PERCENTAGE") {
        couponDiscount = Math.round(subtotal * (appliedCoupon.value / 100))
      } else {
        couponDiscount = appliedCoupon.value
      }
    }

    const total = Math.max(0, subtotal + tax - cartDiscount - loyaltyDiscount - couponDiscount)
    return { subtotal, tax, total, loyaltyDiscount, couponDiscount }
  }

  const handleSale = async () => {
    const { total } = getCartTotal()
    
    if (cart.length === 0) return

    // Validación de Pago Total (para Mixtos o Simples)
    const paidTotal = cartPayments.reduce((sum, p) => sum + p.amount, 0)
    
    if (Math.abs(paidTotal - total) > 1) { // Margen de 1 unidad por redondeo
       toast.error("¡Pago incompleto!", {
          description: `El total de pagos (${formatCurrency(paidTotal)}) no coincide con el total de la venta (${formatCurrency(total)}).`,
          duration: 5000
       })
       return
    }

    // Validaciones específicas por cada método en el array de pagos
    for (const payment of cartPayments) {
      if (payment.method === "GIFT_CARD") {
        if (!cartCustomer) {
          toast.error("¡Cliente requerido!", { description: "Para redimir una tarjeta de regalo, es obligatorio seleccionar un cliente.", duration: 5000 })
          return
        }
      }
      if (payment.method === "CREDIT" && !cartCustomer) {
        toast.error("¡Cliente requerido!", { description: "Para ventas a crédito, debes seleccionar un cliente.", duration: 5000 })
        return
      }
    }

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: cartCustomer?.id,
          payments: cartPayments,
          paymentMethod: cartPaymentMethod,
          items: cart.map(item => {
            // El ID real de DB está en item.data.id (para productos y servicios)
            const realId = (item.type === "PRODUCT" || item.type === "SERVICE") ? item.data.id : item.id
            return { 
              id: item.id,
              productId: item.type === "PRODUCT" ? realId : null, 
              serviceId: item.type === "SERVICE" ? realId : null,
              quantity: item.quantity,
              type: item.type,
              isSubscription: item.isSubscription,
              batchId: item.batchId,
              presentationId: item.presentationId,
              unitPrice: item.price // Asegurar que enviamos el precio calculado
            }
          }),
          paymentMethod: cartPaymentMethod,
          discount: cartDiscount,
          pointsRedeemed: redeemPoints,
          couponCode: appliedCoupon?.code,
          giftCardCode: appliedGiftCard?.code,
          cashRegisterId: cashRegister?.id,
          cashReceived,
          change,
          branchId: selectedBranch
        })
      })
      const data = await res.json()
      if (data.success) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        toast.success("🎉 ¡Venta registrada exitosamente!")
        
        // Guardar venta y mostrar recibo
        setLastSale(data.data)
        setReceiptDialog(true)

        setCart([])
        setCartCustomer(null)
        setCartDiscount(0)
        setRedeemPoints(0)
        setCouponCode("")
        setAppliedCoupon(null)
        setCashReceived(0)
        setChange(0)
        setChange(0)
        fetchPOSData()
        fetchCredits()
        fetchNotifications()
        fetchSales()
        fetchSubscriptionServices()
        fetchSubscriptions()
        
        // Clear Gift Card state
        setAppliedGiftCard(null)
        setGiftCardCode("")
      } else {
        toast.error("Error al procesar la venta", {
          description: data.error || "Ocurrió un error inesperado al guardar la venta."
        })
      }
    } catch (error) {
      console.error("Error en handleSale:", error)
      toast.error("Error de conexión", {
        description: "No se pudo comunicar con el servidor para registrar la venta."
      })
    }
  }

  const handleSaveLoyaltyConfig = async (newConfig: any) => {
    try {
      const res = await fetch("/api/loyalty/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Configuración de lealtad guardada")
        setLoyaltyConfig(data.data)
      } else {
        toast.error(data.error || "Error al guardar configuración")
      }
    } catch { toast.error("Error de conexión") }
  }

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierForm)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Proveedor registrado")
        setSupplierDialog(false)
        setSupplierForm({ name: "", nit: "", phone: "", email: "", address: "", notes: "" })
        fetchPOSData()
      } else {
        toast.error(data.error || "Error al registrar proveedor")
      }
    } catch { toast.error("Error de conexión") }
  }

  const handleUpdateSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSupplier) return
    try {
      const res = await fetch(`/api/suppliers/${editingSupplier.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierForm)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Proveedor actualizado")
        setSupplierDialog(false)
        setEditingSupplier(null)
        setSupplierForm({ name: "", nit: "", phone: "", email: "", address: "", notes: "" })
        fetchPOSData()
      } else {
        toast.error(data.error || "Error al actualizar")
      }
    } catch { toast.error("Error de conexión") }
  }

  const handleDeleteSupplier = async (id: string) => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        toast.success("Proveedor eliminado")
        fetchPOSData()
      } else {
        toast.error(data.error || "No se pudo eliminar")
      }
    } catch { toast.error("Error de conexión") }
  }

  const handleValidateCoupon = async () => {
    if (!couponCode) return
    try {
      const res = await fetch(`/api/loyalty/coupons/${couponCode}`)
      const data = await res.json()
      if (data.success) {
        const coupon = data.data
        const { subtotal } = getCartTotal()
        
        if (subtotal < coupon.minPurchase) {
          toast.error(`Compra mínima para este cupón: ${formatCurrency(coupon.minPurchase)}`)
          return
        }

        setAppliedCoupon(coupon)
        toast.success("Cupón aplicado correctamente")
      } else {
        toast.error(data.error || "Cupón inválido")
        setAppliedCoupon(null)
      }
    } catch { toast.error("Error al validar cupón") }
  }

  const fetchGiftCards = async () => {
    try {
      const res = await fetch("/api/gift-cards")
      const data = await res.json()
      if (data.success) setGiftCards(data.data)
    } catch (error) { console.error("Error fetching gift cards:", error) }
  }

  const handleValidateGiftCard = async () => {
    if (!giftCardCode) return
    try {
      const res = await fetch(`/api/gift-cards?code=${giftCardCode}`)
      const data = await res.json()
      if (data.success) {
        setAppliedGiftCard(data.data)
        toast.success("Tarjeta de regalo validada")
      } else {
        toast.error(data.error || "Tarjeta inválida o sin saldo")
        setAppliedGiftCard(null)
      }
    } catch { toast.error("Error al validar tarjeta") }
  }

  const handleAddGiftCardToCart = () => {
    const amount = parseFloat(giftCardForm.amount)
    if (!amount || amount <= 0) {
      toast.error("Ingresa un monto válido")
      return
    }

    const item = {
      id: `GIFT-${Date.now()}`,
      name: `Tarjeta Regalo ${formatCurrency(amount)}`,
      price: amount,
      quantity: 1,
      type: "GIFT_CARD",
      data: { ...giftCardForm, amount }
    }

    setCart([...cart, item as any])
    setGiftCardForm({ amount: "", code: "", customerId: "" })
    toast.success("Tarjeta de regalo añadida al carrito")
  }

  const handleSetCartPaymentMethod = (method: string) => {
    setCartPaymentMethod(method)
    const { total } = getCartTotal()
    
    // Si no es mixto, resetear pagos a uno solo del método seleccionado
    if (method !== "MIXED") {
      setCartPayments([{ method, amount: total }])
    }
    
    // Limpieza de estados específicos
    if (method !== "GIFT_CARD") {
      setAppliedGiftCard(null)
      setGiftCardCode("")
    }
    if (method !== "CASH") {
      setCashReceived(0)
      setChange(0)
    }
  }

  const handleAddPayment = () => {
    setCartPayments([...cartPayments, { method: "CASH", amount: 0 }])
  }

  const handleRemovePayment = (index: number) => {
    const newPayments = [...cartPayments]
    newPayments.splice(index, 1)
    setCartPayments(newPayments)
  }

  const handleUpdatePayment = (index: number, data: any) => {
    const newPayments = [...cartPayments]
    newPayments[index] = { ...newPayments[index], ...data }
    setCartPayments(newPayments)
  }

  const handlePrintGiftCard = (card: any) => {
    setSelectedGiftCard(card)
    setShowGiftCardPrintDialog(true)
  }


  const handleOpenCash = async (initialCash: number) => {
    try {
      const res = await fetch("/api/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          initialCash,
          branchId: selectedBranch
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Caja abierta")
        setCashRegister(data.data)
        setCashDialog(false)
        fetchCashHistory()
      } else {
        toast.error(data.error || "No se pudo abrir la caja")
      }
    } catch (error) { 
      console.error("Error opening cash:", error)
      toast.error("Error de conexión al abrir caja") 
    }
  }

  const handleCloseCash = async (finalCash: number) => {
    try {
      const res = await fetch("/api/cash", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          finalCash,
          branchId: selectedBranch
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Caja cerrada. Diferencia: ${formatCurrency(data.data.difference || 0)}`)
        setCashRegister(null)
        setCashDialog(false)
        fetchCashHistory()
      }
    } catch { toast.error("Error al cerrar caja") }
  }

  const handlePayment = async () => {
    if (!selectedCredit || paymentAmount <= 0) return
    try {
      const res = await fetch(`/api/credits/${selectedCredit.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: paymentAmount, 
          paymentMethod: "CASH",
          date: paymentDate,
          notes: paymentNotes
        })
      })
      if ((await res.json()).success) {
        toast.success("Abono registrado")
        setPaymentDialog(false)
        setPaymentAmount(0)
        setPaymentDate(new Date().toISOString().split('T')[0])
        setPaymentNotes("")
        setSelectedCredit(null)
        fetchPOSData()
        fetchCredits()
        fetchNotifications()
        fetchSales()
      }
    } catch { toast.error("Error al registrar abono") }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...expenseForm,
          branchId: selectedBranch
        })
      })
      if ((await res.json()).success) {
        toast.success("Gasto registrado")
        setExpenseDialog(false)
        setExpenseForm({
          category: "Servicios", description: "", amount: 0,
          date: new Date().toISOString().split('T')[0], notes: ""
        })
        fetchExpenses()
        fetchPOSData()
      }
    } catch { toast.error("Error al registrar gasto") }
  }

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingBranch ? "PUT" : "POST"
      const res = await fetch("/api/branches", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBranch 
          ? { ...branchForm, id: editingBranch.id, monthlyGoal: parseFloat(branchForm.monthlyGoal.toString()) || 0 } 
          : { ...branchForm, monthlyGoal: parseFloat(branchForm.monthlyGoal.toString()) || 0 }
        )
      })
      const data = await res.json()
      if (data.success) {
        toast.success(editingBranch ? "Sucursal actualizada" : "Sucursal creada")
        setBranchDialog(false)
        setEditingBranch(null)
        setBranchForm({ name: "", address: "", phone: "", city: "", isMain: false, monthlyGoal: 0, logoUrl: "", themeColor: "#10b981" })
        fetchBranches()
      } else {
        toast.error(data.error || "Error al procesar sucursal")
      }
    } catch (error) { 
      console.error("Error updating branch:", error)
      toast.error("Error de conexión al servidor") 
    }
  }

  const handleDeleteBranch = async (id: string) => {
    askConfirm(
      "¿Eliminar sucursal?",
      "Esta acción no se puede deshacer y podría afectar los registros históricos de ventas asociados.",
      async () => {
        try {
          const res = await fetch(`/api/branches?id=${id}`, { method: "DELETE" })
          if ((await res.json()).success) {
            toast.success("Sucursal eliminada")
            fetchBranches()
            setConfirmDialog(prev => ({ ...prev, open: false }))
          }
        } catch { toast.error("Error al eliminar") }
      }
    )
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingUser ? "PUT" : "POST"
      const res = await fetch("/api/users", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser ? { ...userForm, id: editingUser.id } : userForm)
      })
      if ((await res.json()).success) {
        toast.success(editingUser ? "Usuario actualizado" : "Usuario creado")
        setUserDialog(false)
        setEditingUser(null)
        setUserForm({ name: "", email: "", password: "", role: "CASHIER", branchIds: [], phone: "", isQuickAccess: false })
        fetchUsers()
      }
    } catch { toast.error("Error al procesar usuario") }
  }

  const handleDeleteUser = async (id: string) => {
    askConfirm(
      "¿Eliminar usuario?",
      "El usuario perderá acceso inmediato al sistema.",
      async () => {
        try {
          const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" })
          if ((await res.json()).success) {
            toast.success("Usuario eliminado")
            fetchUsers()
            setConfirmDialog(prev => ({ ...prev, open: false }))
          }
        } catch { toast.error("Error al eliminar") }
      }
    )
  }

  const handleToggleUserActive = async (id: string, active: boolean) => {
    try {
      const res = await fetch("/api/users?type=status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active })
      })
      if ((await res.json()).success) {
        toast.success("Estado actualizado")
        fetchUsers()
      }
    } catch { toast.error("Error al actualizar") }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => setBulkUploadData(event.target?.result as string)
    reader.readAsText(file)
  }

  const handleBulkUpload = async () => {
    try {
      const res = await fetch("/api/products?type=bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: bulkUploadData })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Carga exitosa: ${data.count} productos`)
        setBulkUploadDialog(false)
        setBulkUploadData("")
        fetchPOSData()
      }
    } catch { toast.error("Error en la carga masiva") }
  }

  const handleCreateSubscriptionService = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/subscription-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscriptionServiceForm)
      })
      if ((await res.json()).success) {
        toast.success("Servicio creado")
        setShowSubscriptionServiceDialog(false)
        fetchSubscriptionServices()
      }
    } catch { toast.error("Error al crear servicio") }
  }

  const handleUpdateSubscriptionService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSubscriptionService) return
    try {
      const res = await fetch("/api/subscription-services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...subscriptionServiceForm, id: editingSubscriptionService.id })
      })
      if ((await res.json()).success) {
        toast.success("Servicio actualizado")
        setShowSubscriptionServiceDialog(false)
        setEditingSubscriptionService(null)
        fetchSubscriptionServices()
      }
    } catch { toast.error("Error al actualizar") }
  }

  const handleDeleteSubscriptionService = async (id: string) => {
    askConfirm(
      "¿Eliminar servicio?",
      "Esto no eliminará las suscripciones activas, pero no se podrán crear nuevas de este tipo.",
      async () => {
        try {
          const res = await fetch(`/api/subscription-services?id=${id}`, { method: "DELETE" })
          if ((await res.json()).success) {
            toast.success("Servicio eliminado")
            fetchSubscriptionServices()
            setConfirmDialog(prev => ({ ...prev, open: false }))
          }
        } catch { toast.error("Error al eliminar") }
      }
    )
  }

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSubscription,
          cashRegisterId: cashRegister?.id
        })
      })
      if ((await res.json()).success) {
        toast.success("Suscripción creada")
        setShowNewSubscriptionDialog(false)
        fetchSubscriptions()
        fetchPOSData() // Actualizar transacciones y caja
      }
    } catch { toast.error("Error al crear suscripción") }
  }

  const handleSubscriptionPayment = async () => {
    if (!selectedSubscription) return
    try {
      const res = await fetch("/api/subscriptions/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: selectedSubscription.id,
          amount: parseFloat(subscriptionPaymentAmount),
          paymentMethod: subscriptionPaymentMethod,
          cashRegisterId: cashRegister?.id
        })
      })
      if ((await res.json()).success) {
        toast.success("Pago registrado")
        setShowSubscriptionPaymentDialog(false)
        fetchSubscriptions()
        fetchSales()
        fetchPOSData()
      }
    } catch { toast.error("Error al registrar pago") }
  }

  const handleFreezeSubscription = async () => {
    if (!selectedSubscription) return
    try {
      const res = await fetch("/api/subscriptions?type=status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedSubscription.id, status: "FROZEN", days: parseInt(freezeDays) })
      })
      if ((await res.json()).success) {
        toast.success("Suscripción congelada")
        setShowFreezeDialog(false)
        fetchSubscriptions()
      }
    } catch { toast.error("Error al congelar") }
  }

  const handleUnfreezeSubscription = async (id: string) => {
    try {
      const res = await fetch("/api/subscriptions?type=status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "ACTIVE" })
      })
      if ((await res.json()).success) {
        toast.success("Suscripción reactivada")
        fetchSubscriptions()
      }
    } catch { toast.error("Error al reactivar") }
  }

  const handleCancelSubscription = async (id: string) => {
    askConfirm(
      "¿Cancelar suscripción?",
      "El servicio se marcará como cancelado y el cliente no podrá utilizarlo.",
      async () => {
        try {
          const res = await fetch("/api/subscriptions?type=status", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: "CANCELLED" })
          })
          if ((await res.json()).success) {
            toast.success("Suscripción cancelada")
            fetchSubscriptions()
            setConfirmDialog(prev => ({ ...prev, open: false }))
          }
        } catch { toast.error("Error al cancelar") }
      }
    )
  }

  const handleAdjustStock = async (data: any) => {
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          branchId: selectedBranch || session?.user?.branchId // Fallback to user branch
        })
      })
      const result = await res.json()
      if (result.success) {
        toast.success("Stock ajustado correctamente")
        fetchPOSData() // Actualizar lista de productos
      } else {
        toast.error(result.error || "Error al ajustar stock")
      }
    } catch (error) {
      toast.error("Error de conexión")
    }
  }

  const fetchActivityLogs = async () => {
    try {
      const res = await fetch("/api/logs")
      const data = await res.json()
      if (data.success) {
        setActivityLogs(data.data)
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
    }
  }

  // Held Carts Handlers
  const handleHoldCart = useCallback(() => {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newHeldCart = {
      id: `HELD-${Date.now()}`,
      customer: cartCustomer,
      cart: [...cart],
      total: total,
      heldAt: new Date().toISOString(),
      paymentMethod: cartPaymentMethod
    };
    
    setHeldCarts(prev => [newHeldCart, ...prev]);
    setCart([]);
    setCartCustomer(null);
    setCartPaymentMethod("CASH");
    setRedeemPoints(0);
    setAppliedCoupon(null);
    setAppliedGiftCard(null);
    toast.success("Venta puesta en espera");
  }, [cart, cartCustomer, cartPaymentMethod]);

  const handleResumeCart = useCallback((heldId: string) => {
    const held = heldCarts.find(h => h.id === heldId);
    if (!held) return;
    
    // If current cart is not empty, offer to hold it or clear it?
    // For simplicity, we'll just merge or replace. Usually REPLACE is safer for "resuming".
    if (cart.length > 0) {
      toast.error("El carrito actual no está vacío. Por favor límpialo o ponlo en espera primero.");
      return;
    }
    
    setCart(held.cart);
    setCartCustomer(held.customer);
    setCartPaymentMethod(held.paymentMethod);
    setHeldCarts(prev => prev.filter(h => h.id !== heldId));
    toast.success("Venta reanudada");
  }, [heldCarts, cart]);

  const handleDeleteHeldCart = useCallback((heldId: string) => {
    setHeldCarts(prev => prev.filter(h => h.id !== heldId));
    toast.info("Venta en espera descartada");
  }, []);

  // Helper values
  const unreadNotifications = notifications.filter(n => !n.isRead).length
  const overdueCredits = credits.filter(c => c.status === "OVERDUE")
  const filteredCredits = credits.filter(c => {
    if (creditSearch) {
      const search = creditSearch.toLowerCase()
      const matchesName = c.customer.name.toLowerCase().includes(search)
      const matchesInvoice = c.sale?.invoiceNumber?.toLowerCase().includes(search)
      if (!matchesName && !matchesInvoice) return false
    }

    if (creditFilter === "all") return c.status !== "PAID"
    if (creditFilter === "overdue") return c.status === "OVERDUE"
    if (creditFilter === "paid") return c.status === "PAID"
    if (creditFilter === "dueSoon") {
      if (c.status === "PAID" || c.status === "OVERDUE") return false
      if (!c.dueDate) return false
      const days = getDaysOverdue(c.dueDate)
      return days >= -7 && days < 0
    }
    return true
  })

  const filteredSales = sales.filter(s => {
    if (!saleSearch) return true
    const search = saleSearch.toLowerCase()
    const matchesInvoice = s.invoiceNumber?.toLowerCase().includes(search)
    const matchesCustomer = s.customer?.name.toLowerCase().includes(search)
    return matchesInvoice || matchesCustomer
  })

  return {
    session,
    posTab, setPosTab, products, categories, customers, credits,
    dashboardStats, cashRegister, notifications, notificationsOpen, 
    setNotificationsOpen, expenses, branches, setBranches,
    sales, filteredSales, fetchSales,
    selectedBranch, setSelectedBranch, creditFilter, setCreditFilter,
    saleSearch, setSaleSearch,
    activityLogs, fetchActivityLogs,
    tenantUsers, cart, setCart, cartCustomer, setCartCustomer,
    cartPaymentMethod, setCartPaymentMethod: handleSetCartPaymentMethod, cartDiscount, setCartDiscount,
    productDialog, setProductDialog, 
    handleOpenProductDialog: (isOpen: boolean, product: any = null) => {
      if (isOpen && !product) {
        // Reset form for NEW product
        setProductForm({
          code: "", sku: "", name: "", description: "", costPrice: 0, salePrice: 0, wholesalePrice: 0, 
          stock: 0, minStock: 5, unit: "unidad", categoryId: "", isActive: true,
          expiryDate: "", imageUrl: "", supplierId: "",
          batchNumber: `LOT-${Math.floor(100000 + Math.random() * 900000)}` // Auto-generate lot
        })
        setEditingProduct(null)
      } else if (isOpen && product) {
        // Edit existing product
        setEditingProduct(product)
        setProductForm({
          code: product.code || "",
          sku: product.sku || "",
          name: product.name,
          description: product.description || "",
          costPrice: product.costPrice || 0,
          salePrice: product.salePrice,
          wholesalePrice: product.wholesalePrice || 0,
          stock: product.stock || 0,
          minStock: product.minStock || 5,
          unit: product.unit || "unidad",
          categoryId: product.categoryId || "",
          isActive: product.isActive,
          expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : "",
          imageUrl: product.imageUrl || "",
          supplierId: product.supplierId || "",
          batchNumber: "", // For existing products, batches are managed in advanced tab
          presentations: product.presentations || []
        })
      }
      setProductDialog(isOpen)
    },
    categoryDialog, setCategoryDialog,
    customerDialog, setCustomerDialog, paymentDialog, setPaymentDialog,
    cashDialog, setCashDialog, expenseDialog, setExpenseDialog,
    branchDialog, setBranchDialog, bulkUploadDialog, setBulkUploadDialog,
    userDialog, setUserDialog, productForm, setProductForm,
    editingProduct, setEditingProduct, handleUpdateProduct, handleDeleteProduct,
    addServiceToCart,
    stockAdjustmentDialog, setStockAdjustmentDialog,
    selectedProductForStock, setSelectedProductForStock,
    handleAdjustStock,
    categoryForm, setCategoryForm, customerForm, setCustomerForm,
    selectedCredit, setSelectedCredit, paymentAmount, setPaymentAmount,
    expenseForm, setExpenseForm, branchForm, setBranchForm,
    handleUploadBranchLogo,
    bulkUploadData, setBulkUploadData, editingBranch, setEditingBranch,
    editingUser, setEditingUser, userForm, setUserForm,
    subscriptionServices, subscriptions, subscriptionStats,
    subscriptionServiceForm, setSubscriptionServiceForm,
    newSubscription, setNewSubscription, editingSubscriptionService, 
    setEditingSubscriptionService, showSubscriptionServiceDialog, 
    setShowSubscriptionServiceDialog, showNewSubscriptionDialog, 
    setShowNewSubscriptionDialog, showSubscriptionPaymentDialog, 
    setShowSubscriptionPaymentDialog, selectedSubscription, 
    setSelectedSubscription, subscriptionPaymentAmount, 
    setSubscriptionPaymentAmount, subscriptionPaymentMethod, 
    setSubscriptionPaymentMethod, subscriptionTab, setSubscriptionTab,
    showFreezeDialog, setShowFreezeDialog, freezeDays, setFreezeDays, confirmDialog, setConfirmDialog,
    showConfetti, fetchPOSData, fetchNotifications, handleClearNotifications, fetchExpenses, 
    fetchBranches, fetchUsers, fetchSubscriptionServices, fetchSubscriptions,
    fetchCredits, handleAddProduct, handleAddCategory, handleAddCustomer,
    addToCart, removeFromCart, updateCartQuantity, getCartTotal,
    handleSale, handleOpenCash, handleCloseCash, fetchCashHistory, cashHistory,
    handlePayment, handleAddExpense, handleAddBranch, handleDeleteBranch, 
    handleAddUser, handleDeleteUser, handleToggleUserActive, 
    handleFileUpload, handleBulkUpload,
    handleCreateSubscriptionService, handleUpdateSubscriptionService,
    handleDeleteSubscriptionService, handleCreateSubscription,
    handleSubscriptionPayment, handleFreezeSubscription,
    handleUnfreezeSubscription, handleCancelSubscription,
    lastSale, setLastSale, receiptDialog, setReceiptDialog,
    cashReportDialog, setCashReportDialog, cashReceived, setCashReceived,
    change, setChange,
    branches, selectedBranch, setSelectedBranch,
    editingCategory, setEditingCategory, handleUpdateCategory, handleDeleteCategory,
    unreadNotifications, filteredCredits, fileInputRef,
    overdueCredits: credits.filter(c => c.status === "OVERDUE" || (c.dueDate && new Date(c.dueDate) < new Date() && c.status !== "PAID")),
    dueSoonCredits: credits.filter(c => {
      if (c.status === "PAID" || c.status === "OVERDUE") return false
      if (!c.dueDate) return false
      const days = getDaysOverdue(c.dueDate)
      return days >= -7 && days < 0
    }),
    getDaysOverdue,
    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    todayExpenses: expenses.filter(e => e.date === new Date().toISOString().split('T')[0]).reduce((sum, e) => sum + e.amount, 0),
    
    // Loyalty & Coupons
    loyaltyConfig, fetchLoyaltyConfig, handleSaveLoyaltyConfig,
    coupons, fetchCoupons, handleValidateCoupon,
    redeemPoints, setRedeemPoints: (points: number) => {
      const available = cartCustomer?.points || 0
      setRedeemPoints(Math.min(points, available))
    },
    couponCode, setCouponCode,
    appliedCoupon, setAppliedCoupon,
    calculatePointsDiscount: (points: number) => {
      if (!loyaltyConfig || !loyaltyConfig.isActive) return 0
      return points * loyaltyConfig.redemptionValue
    },
    // Gift Cards
    giftCards,
    giftCardCode,
    setGiftCardCode,
    appliedGiftCard,
    setAppliedGiftCard,
    giftCardDialog,
    setGiftCardDialog,
    giftCardForm,
    setGiftCardForm,
    handleAddGiftCardToCart,
    handleValidateGiftCard,
    showGiftCardPrintDialog,
    setShowGiftCardPrintDialog,
    selectedGiftCard,
    handlePrintGiftCard,
    historyDialog, setHistoryDialog, historyItems, historyTitle, historyDescription,
    handleOpenHistory,
    suppliers, setSuppliers, supplierDialog, setSupplierDialog,
    supplierForm, setSupplierForm, editingSupplier, setEditingSupplier,
    handleAddSupplier, handleUpdateSupplier, handleDeleteSupplier,
    profileDialog, setProfileDialog, profileForm, setProfileForm, handleUpdateProfile,
    cartPayments, setCartPayments, handleAddPayment, handleUpdatePayment, handleRemovePayment,
    businessSettings, handleUpdateBusinessSettings,
    batchDialogOpen, setBatchDialogOpen, availableBatches, activeProductForBatch,
    heldCarts, handleHoldCart, handleResumeCart, handleDeleteHeldCart
  }
}

import { User, Tenant, Product, Category, Customer, Sale, Credit, CashRegister } from "@prisma/client"
export type { User, Tenant, Product, Category, Customer, Sale, Credit, CashRegister }

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Tenant Types
export interface TenantWithStats extends Tenant {
  _count?: {
    products: number
    customers: number
    sales: number
  }
  totalSales?: number
}

export interface TenantData extends Tenant {
  _count?: { products: number; customers: number; sales: number }
  totalSales?: number
}

// Product Types
export interface ProductWithCategory extends Product {
  category?: Category | null
}

export interface ProductData {
  id: string
  code: string | null
  name: string
  description: string | null
  costPrice: number
  salePrice: number
  stock: number
  minStock: number
  unit: string
  isActive: boolean
  category: { id: string; name: string; color: string | null } | null
}

// Category Types
export interface CategoryData {
  id: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  _count?: { products: number }
}

// Customer & Credit Types
export interface CustomerData {
  id: string
  name: string
  document: string | null
  phone: string | null
  email: string | null
  pendingBalance: number
  creditLimit: number
  points: number
}

export interface CreditWithDetails {
  id: string
  customer: CustomerData
  totalAmount: number
  paidAmount: number
  balance: number
  status: string
  dueDate?: string | null
  createdAt: string
}

// Sale Types
export interface SaleWithDetails {
  id: string
  invoiceNumber: string
  customer: CustomerData | null
  items: SaleItemData[]
  total: number
  paymentMethod: string
  paymentStatus: string
  createdAt: string
}

export interface SaleItemData {
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

// Dashboard Stats
export interface DashboardStats {
  todaySales: number
  todayTransactions: number
  monthSales: number
  monthTransactions: number
  topProducts: TopProduct[]
  recentSales: SaleWithDetails[]
  pendingCredits: number
  lowStockProducts: number
}

export interface TopProduct {
  id: string
  name: string
  totalSold: number
  totalRevenue: number
}

// Cash Register
export interface CashRegisterData {
  id: string
  openedAt: string
  initialCash: number
  totalSales: number
  totalCash: number
  totalCard: number
  totalTransfer: number
  totalCredit: number
  totalExpenses?: number
  status: "OPEN" | "CLOSED"
}

// Notifications
export interface NotificationData {
  id: string
  type: "LOW_STOCK" | "CREDIT_OVERDUE" | "CREDIT_DUE" | "CREDIT_DUE_SOON" | "OVERDUE_CREDIT" | "DUE_SOON_CREDIT"
  title: string
  message: string
  data?: Record<string, unknown>
  createdAt: string
  createdAt: string
  isRead: boolean
}

// Global Types
export interface ExpenseData {
  id: string
  category: string
  description: string
  amount: number
  date: string
  notes?: string | null
  createdAt: string
}

export interface BranchData {
  id: string
  name: string
  address: string | null
  phone: string | null
  city: string
  isMain: boolean
  isActive: boolean
  logoUrl?: string | null
  themeColor?: string | null
  enabledPaymentMethods?: string | null
  _count?: { products: number; sales: number }
  createdAt: string
}

export interface TenantUserData {
  id: string
  name: string
  email: string
  role: string
  phone?: string | null
  isActive: boolean
  branch?: { id: string; name: string } | null
  createdAt: string
}

// Subscription Types
export interface SubscriptionServiceData {
  id: string
  name: string
  code: string | null
  description: string | null
  price: number
  setupFee: number
  billingCycle: string
  billingDays: number
  durationMonths: number | null
  isActive: boolean
  maxFreezes: number
  freezeDaysMax: number
  category: { id: string; name: string } | null
  _count?: { subscriptions: number }
}

export interface CustomerSubscriptionData {
  id: string
  customerId: string
  serviceId: string
  startDate: string
  endDate: string | null
  nextBillingDate: string
  lastPaymentDate: string | null
  status: string
  agreedPrice: number
  frozenAt: string | null
  frozenUntil: string | null
  freezeCount: number
  discountPercent: number
  discountReason: string | null
  notes: string | null
  customer: { id: string; name: string; phone: string | null; email: string | null }
  service: { id: string; name: string; price: number; billingCycle: string }
  payments: SubscriptionPaymentData[]
}

export interface SubscriptionPaymentData {
  id: string
  amount: number
  paymentMethod: string
  periodStart: string
  periodEnd: string
  status: string
  receiptNumber: string | null
  createdAt: string
}

export interface SubscriptionStats {
  total: number
  active: number
  overdue: number
  monthlyRevenue: number
}

// Session User
export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
  tenantId?: string
  tenantName?: string
  tenantStatus?: string
}

"use client"

import { usePOS } from "@/hooks/usePOS"
import { POSDashboard } from "./POSDashboard"
import { DashboardTab } from "./tabs/DashboardTab"
import { SaleTab } from "./tabs/SaleTab"
import { InventoryTab } from "./tabs/InventoryTab"
import { CustomersTab } from "./tabs/CustomersTab"
import { CreditsTab } from "./tabs/CreditsTab"
import { ExpensesTab } from "./tabs/ExpensesTab"
import { BranchesTab } from "./tabs/BranchesTab"
import { UsersTab } from "./tabs/UsersTab"
import { CashTab } from "./tabs/CashTab"
import { SubscriptionsTab } from "./tabs/SubscriptionsTab"
import { TransactionsTab } from "./tabs/TransactionsTab"
import { CategoriesTab } from "./tabs/CategoriesTab"
import { LoyaltyConfigTab } from "./tabs/LoyaltyConfigTab"
import { GiftCardsTab } from "./tabs/GiftCardsTab"
import { AdvancedInventoryTab } from "./tabs/AdvancedInventoryTab"
import { SuppliersTab } from "./tabs/SuppliersTab"
import { StockAdjustmentDialog } from "./dialogs/StockAdjustmentDialog"
import { ProductDialog } from "./dialogs/ProductDialog"
import { CategoryDialog } from "./dialogs/CategoryDialog"
import { CustomerDialog } from "./dialogs/CustomerDialog"
import { CashDialog } from "./dialogs/CashDialog"
import { PaymentDialog } from "./dialogs/PaymentDialog"
import { ExpenseDialog } from "./dialogs/ExpenseDialog"
import { BranchDialog } from "./dialogs/BranchDialog"
import { GiftCardPrintDialog } from "./dialogs/GiftCardPrintDialog"
import { UserDialog } from "./dialogs/UserDialog"
import { HistoryDialog } from "./dialogs/HistoryDialog"
import { BulkUploadDialog } from "./dialogs/BulkUploadDialog"
import { ReceiptDialog } from "./dialogs/ReceiptDialog"
import { CashReportDialog } from "./dialogs/CashReportDialog"
import { ConfirmationDialog } from "./dialogs/ConfirmationDialog"
import { SupplierDialog } from "./dialogs/SupplierDialog"
import { 
  SubscriptionServiceDialog, 
  NewSubscriptionDialog, 
  SubscriptionPaymentDialog,
  SubscriptionFreezeDialog
} from "./dialogs/SubscriptionDialogs"
import { AnimatePresence } from "framer-motion"

interface POSViewProps {
  session: any
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
  onSignOut: () => void
}

export const POSView = ({
  session,
  sidebarOpen,
  onSidebarOpenChange,
  onSignOut
}: POSViewProps) => {
  const pos = usePOS(session)
  const cartTotals = pos.getCartTotal()

  return (
    <>
      <POSDashboard
        session={session}
        view="pos"
        posTab={pos.posTab}
        onPosTabChange={(tab) => {
          pos.setPosTab(tab)
          if (tab === "credits") pos.fetchCredits()
          if (tab === "expenses") pos.fetchExpenses()
          if (tab === "subscriptions") {
            pos.fetchSubscriptionServices()
            pos.fetchSubscriptions()
          }
          if (tab === "transactions") pos.fetchSales()
          if (tab === "loyalty") {
            pos.fetchLoyaltyConfig()
            pos.fetchCoupons()
          }
          if (tab === "giftcards") {
            pos.fetchGiftCards()
          }
          if (tab === "suppliers") {
            pos.fetchPOSData() // Reutilizamos para cargar proveedores
          }
        }}
        sidebarOpen={sidebarOpen}
        onSidebarOpenChange={onSidebarOpenChange}
        notifications={pos.notifications}
        unreadNotifications={pos.unreadNotifications}
        notificationsOpen={pos.notificationsOpen}
        onNotificationsOpenChange={pos.setNotificationsOpen}
        onClearNotifications={pos.handleClearNotifications}
        onTabChangeWithEffects={(tab) => pos.setPosTab(tab)}
        showConfetti={pos.showConfetti}
        onSignOut={onSignOut}
        branches={pos.branches}
        selectedBranch={pos.selectedBranch}
        onBranchChange={pos.setSelectedBranch}
      >
        <AnimatePresence mode="wait">
          {pos.posTab === "dashboard" && (
            <DashboardTab
              dashboardStats={pos.dashboardStats}
              fetchPOSData={pos.fetchPOSData}
              onPosTabChange={pos.setPosTab}
              overdueCredits={pos.overdueCredits}
              setCreditFilter={pos.setCreditFilter}
            />
          )}
          {pos.posTab === "sale" && (
            <SaleTab
              cashRegister={pos.cashRegister}
              onOpenCashDialog={() => pos.setCashDialog(true)}
              products={pos.products}
              cart={pos.cart}
              onAddToCart={pos.addToCart}
              onUpdateCartQuantity={pos.updateCartQuantity}
              onClearCart={() => pos.setCart([])}
              customers={pos.customers}
              cartCustomer={pos.cartCustomer}
              onSetCartCustomer={pos.setCartCustomer}
              cartPaymentMethod={pos.cartPaymentMethod}
              onSetCartPaymentMethod={pos.setCartPaymentMethod}
              subtotal={cartTotals.subtotal}
              tax={cartTotals.tax}
              total={cartTotals.total}
              onHandleSale={pos.handleSale}
              subscriptionServices={pos.subscriptionServices}
              onAddServiceToCart={pos.addServiceToCart}
              // Loyalty & Coupons
              loyaltyConfig={pos.loyaltyConfig}
              redeemPoints={pos.redeemPoints}
              onSetRedeemPoints={pos.setRedeemPoints}
              couponCode={pos.couponCode}
              onSetCouponCode={pos.setCouponCode}
              appliedCoupon={pos.appliedCoupon}
              onValidateCoupon={pos.handleValidateCoupon}
              loyaltyDiscount={cartTotals.loyaltyDiscount}
              couponDiscount={cartTotals.couponDiscount}
              cashReceived={pos.cashReceived}
              onCashReceivedChange={pos.setCashReceived}
              change={pos.change}
              onSetChange={pos.setChange}
              onSetCustomerDialog={pos.setCustomerDialog}
              giftCardForm={pos.giftCardForm}
              onSetGiftCardForm={pos.setGiftCardForm}
              onAddGiftCardToCart={pos.handleAddGiftCardToCart}
              giftCardCode={pos.giftCardCode}
              onSetGiftCardCode={pos.setGiftCardCode}
              onValidateGiftCard={pos.handleValidateGiftCard}
              appliedGiftCard={pos.appliedGiftCard}
              cartPayments={pos.cartPayments}
              onAddPayment={pos.handleAddPayment}
              onRemovePayment={pos.handleRemovePayment}
              onUpdatePayment={pos.handleUpdatePayment}
              userRole={pos.session?.user?.role}
            />
          )}
          {pos.posTab === "loyalty" && (
            <LoyaltyConfigTab
              config={pos.loyaltyConfig}
              onSaveConfig={pos.handleSaveLoyaltyConfig}
              coupons={pos.coupons}
              fetchCoupons={pos.fetchCoupons}
            />
          )}
          {pos.posTab === "products" && (
            <InventoryTab
              products={pos.products}
              categories={pos.categories}
              onSetProductDialog={pos.setProductDialog}
              onSetCategoryDialog={pos.setCategoryDialog}
              onSetBulkUploadDialog={pos.setBulkUploadDialog}
              onSetStockAdjustmentDialog={pos.setStockAdjustmentDialog}
              onSetSelectedProductForStock={pos.setSelectedProductForStock}
              onSetEditingProduct={pos.setEditingProduct}
              onSetProductForm={pos.setProductForm}
              userRole={pos.session?.user?.role}
            />
          )}
          {pos.posTab === "categories" && (
            <CategoriesTab
              categories={pos.categories}
              onSetCategoryDialog={pos.setCategoryDialog}
              onSetEditingCategory={pos.setEditingCategory}
              onSetCategoryForm={pos.setCategoryForm}
              onDeleteCategory={pos.handleDeleteCategory}
            />
          )}
          {pos.posTab === "customers" && (
            <CustomersTab
              customers={pos.customers}
              credits={pos.credits}
              onSetCustomerDialog={pos.setCustomerDialog}
              onSetSelectedCredit={pos.setSelectedCredit}
              onSetPaymentAmount={pos.setPaymentAmount}
              onSetPaymentDialog={pos.setPaymentDialog}
            />
          )}
          {pos.posTab === "credits" && (
            <CreditsTab
              credits={pos.credits || []}
              filteredCredits={pos.filteredCredits}
              overdueCredits={pos.overdueCredits}
              dueSoonCredits={pos.dueSoonCredits}
              creditFilter={pos.creditFilter}
              onSetCreditFilter={pos.setCreditFilter}
              onSetSelectedCredit={pos.setSelectedCredit}
              onSetPaymentAmount={pos.setPaymentAmount}
              onSetPaymentDialog={pos.setPaymentDialog}
              onOpenHistory={pos.handleOpenHistory}
              getDaysOverdue={pos.getDaysOverdue}
              creditSearch={pos.creditSearch}
              onSetCreditSearch={pos.setCreditSearch}
            />
          )}
          {pos.posTab === "expenses" && (
            <ExpensesTab
              expenses={pos.expenses}
              onSetExpenseDialog={pos.setExpenseDialog}
              totalExpenses={pos.totalExpenses}
              todayExpenses={pos.todayExpenses}
            />
          )}
          {pos.posTab === "branches" && (
            <BranchesTab
              branches={pos.branches}
              onSetBranchDialog={pos.setBranchDialog}
              onSetEditingBranch={pos.setEditingBranch}
              onSetBranchForm={pos.setBranchForm}
              onDeleteBranch={pos.handleDeleteBranch}
            />
          )}
          {pos.posTab === "users" && (
            <UsersTab
               tenantUsers={pos.tenantUsers}
               onSetEditingUser={pos.setEditingUser}
               onSetUserForm={pos.setUserForm}
               onSetUserDialog={pos.setUserDialog}
               onToggleUserActive={pos.handleToggleUserActive}
               onDeleteUser={pos.handleDeleteUser}
            />
          )}
          {pos.posTab === "cash" && (
            <CashTab
              cashRegister={pos.cashRegister}
              onSetCashDialog={pos.setCashDialog}
              todayExpenses={pos.todayExpenses}
              onSetExpenseDialog={pos.setExpenseDialog}
              onPrintSummary={() => pos.setCashReportDialog(true)}
              cashHistory={pos.cashHistory}
              userRole={pos.session?.user?.role}
            />
          )}

          {pos.posTab === "suppliers" && (
            <SuppliersTab 
              suppliers={pos.suppliers}
              onAdd={() => {
                pos.setEditingSupplier(null)
                pos.setSupplierForm({ name: "", nit: "", phone: "", email: "", address: "", notes: "" })
                pos.setSupplierDialog(true)
              }}
              onEdit={(supplier) => {
                pos.setEditingSupplier(supplier)
                pos.setSupplierForm({
                  name: supplier.name,
                  nit: supplier.nit || "",
                  phone: supplier.phone || "",
                  email: supplier.email || "",
                  address: supplier.address || "",
                  notes: supplier.notes || ""
                })
                pos.setSupplierDialog(true)
              }}
              onDelete={pos.handleDeleteSupplier}
            />
          )}

          {pos.posTab === "subscriptions" && (
            <SubscriptionsTab
              subscriptionStats={pos.subscriptionStats}
              subscriptionServices={pos.subscriptionServices}
              subscriptions={pos.subscriptions}
              subscriptionTab={pos.subscriptionTab}
              onSetSubscriptionTab={pos.setSubscriptionTab}
              onSetEditingSubscriptionService={pos.setEditingSubscriptionService}
              onSetSubscriptionServiceForm={pos.setSubscriptionServiceForm}
              onSetShowSubscriptionServiceDialog={pos.setShowSubscriptionServiceDialog}
              onSetNewSubscription={pos.setNewSubscription}
              onSetShowNewSubscriptionDialog={pos.setShowNewSubscriptionDialog}
              onSetSelectedSubscription={pos.setSelectedSubscription}
              onSetSubscriptionPaymentAmount={pos.setSubscriptionPaymentAmount}
              onSetShowSubscriptionPaymentDialog={pos.setShowSubscriptionPaymentDialog}
              onDeleteSubscriptionService={pos.handleDeleteSubscriptionService}
              onFreezeSubscription={pos.handleFreezeSubscription}
              onUnfreezeSubscription={pos.handleUnfreezeSubscription}
              onCancelSubscription={pos.handleCancelSubscription}
              onOpenHistory={pos.handleOpenHistory}
              onSetShowFreezeDialog={pos.setShowFreezeDialog}
            />
          )}
          {pos.posTab === "transactions" && (
            <TransactionsTab
              sales={pos.filteredSales || []}
              onSetLastSale={pos.setLastSale}
              onSetReceiptDialog={pos.setReceiptDialog}
              onOpenHistory={pos.handleOpenHistory}
              saleSearch={pos.saleSearch}
              onSetSaleSearch={pos.setSaleSearch}
            />
          )}
          {pos.posTab === "giftcards" && (
            <GiftCardsTab 
              giftCards={pos.giftCards} 
              onPrintCard={pos.handlePrintGiftCard} 
            />
          )}
          {pos.posTab === "advanced-inventory" && (
            <AdvancedInventoryTab 
              products={pos.products}
              branches={pos.branches}
            />
          )}
        </AnimatePresence>
      </POSDashboard>

      {/* Dialogs */}
      <ProductDialog
        open={pos.productDialog}
        onOpenChange={(open) => {
          pos.setProductDialog(open)
          if (!open) pos.setEditingProduct(null)
        }}
        productForm={pos.productForm}
        onProductFormChange={pos.setProductForm}
        onSubmit={pos.editingProduct ? pos.handleUpdateProduct : pos.handleAddProduct}
        categories={pos.categories}
      />
      <CategoryDialog
        open={pos.categoryDialog}
        onOpenChange={(open) => {
          pos.setCategoryDialog(open)
          if (!open) pos.setEditingCategory(null)
        }}
        categoryForm={pos.categoryForm}
        onCategoryFormChange={pos.setCategoryForm}
        onSubmit={pos.editingCategory ? pos.handleUpdateCategory : pos.handleAddCategory}
        editingCategory={pos.editingCategory}
      />
      <CustomerDialog
        open={pos.customerDialog}
        onOpenChange={pos.setCustomerDialog}
        customerForm={pos.customerForm}
        onCustomerFormChange={pos.setCustomerForm}
        onSubmit={pos.handleAddCustomer}
      />
      <CashDialog
        open={pos.cashDialog}
        onOpenChange={pos.setCashDialog}
        cashRegister={pos.cashRegister}
        onOpenCash={pos.handleOpenCash}
        onCloseCash={pos.handleCloseCash}
        todayExpenses={pos.todayExpenses}
        paymentAmount={pos.paymentAmount}
        onPaymentAmountChange={pos.setPaymentAmount}
        userRole={pos.session?.user?.role}
      />
      <PaymentDialog
        open={pos.paymentDialog}
        onOpenChange={pos.setPaymentDialog}
        paymentAmount={pos.paymentAmount}
        onPaymentAmountChange={pos.setPaymentAmount}
        onSubmit={pos.handlePayment}
        selectedCredit={pos.selectedCredit}
      />
      <ExpenseDialog
        open={pos.expenseDialog}
        onOpenChange={pos.setExpenseDialog}
        expenseForm={pos.expenseForm}
        onExpenseFormChange={pos.setExpenseForm}
        onSubmit={pos.handleAddExpense}
      />
      <BranchDialog
        open={pos.branchDialog}
        onOpenChange={pos.setBranchDialog}
        branchForm={pos.branchForm}
        onBranchFormChange={pos.setBranchForm}
        onSubmit={pos.handleAddBranch}
        editingBranch={pos.editingBranch}
      />
      <UserDialog
        open={pos.userDialog}
        onOpenChange={pos.setUserDialog}
        userForm={pos.userForm}
        onUserFormChange={pos.setUserForm}
        onSubmit={pos.handleAddUser}
        editingUser={pos.editingUser}
        branches={pos.branches}
      />
      <BulkUploadDialog
        open={pos.bulkUploadDialog}
        onOpenChange={pos.setBulkUploadDialog}
        bulkUploadData={pos.bulkUploadData}
        onBulkUploadDataChange={pos.setBulkUploadData}
        onBulkUpload={pos.handleBulkUpload}
        onFileUpload={pos.handleFileUpload}
        fileInputRef={pos.fileInputRef as any}
      />
      <SubscriptionServiceDialog
        open={pos.showSubscriptionServiceDialog}
        onOpenChange={pos.setShowSubscriptionServiceDialog}
        editingService={pos.editingSubscriptionService}
        form={pos.subscriptionServiceForm}
        onFormChange={pos.setSubscriptionServiceForm}
        categories={pos.categories}
        onSubmit={pos.editingSubscriptionService ? pos.handleUpdateSubscriptionService : pos.handleCreateSubscriptionService}
      />
      <NewSubscriptionDialog
        open={pos.showNewSubscriptionDialog}
        onOpenChange={pos.setShowNewSubscriptionDialog}
        form={pos.newSubscription}
        onFormChange={pos.setNewSubscription}
        customers={pos.customers}
        services={pos.subscriptionServices}
        onSubmit={pos.handleCreateSubscription}
      />
      <ConfirmationDialog
        open={pos.confirmDialog.open}
        onOpenChange={(open) => pos.setConfirmDialog({ ...pos.confirmDialog, open })}
        title={pos.confirmDialog.title}
        message={pos.confirmDialog.message}
        onConfirm={pos.confirmDialog.onConfirm}
        variant={pos.confirmDialog.variant}
      />
      <SubscriptionPaymentDialog
        open={pos.showSubscriptionPaymentDialog}
        onOpenChange={pos.setShowSubscriptionPaymentDialog}
        selectedSubscription={pos.selectedSubscription}
        amount={pos.subscriptionPaymentAmount}
        onAmountChange={pos.setSubscriptionPaymentAmount}
        method={pos.subscriptionPaymentMethod}
        onMethodChange={pos.setSubscriptionPaymentMethod}
        onSubmit={() => pos.handleSubscriptionPayment()}
      />
      <SubscriptionFreezeDialog
        open={pos.showFreezeDialog}
        onOpenChange={pos.setShowFreezeDialog}
        selectedSubscription={pos.selectedSubscription}
        days={pos.freezeDays}
        onDaysChange={pos.setFreezeDays}
        onSubmit={pos.handleFreezeSubscription}
      />
      <StockAdjustmentDialog
        open={pos.stockAdjustmentDialog}
        onOpenChange={pos.setStockAdjustmentDialog}
        product={pos.selectedProductForStock}
        onAdjust={pos.handleAdjustStock}
      />
      <SupplierDialog
        open={pos.supplierDialog}
        onOpenChange={pos.setSupplierDialog}
        form={pos.supplierForm}
        setForm={pos.setSupplierForm}
        editingSupplier={pos.editingSupplier}
        onSubmit={pos.editingSupplier ? pos.handleUpdateSupplier : pos.handleAddSupplier}
      />
      <HistoryDialog
        open={pos.historyDialog}
        onOpenChange={pos.setHistoryDialog}
        title={pos.historyTitle}
        description={pos.historyDescription}
        items={pos.historyItems}
      />
      <PaymentDialog
        open={pos.paymentDialog}
        onOpenChange={pos.setPaymentDialog}
        selectedCredit={pos.selectedCredit}
        paymentAmount={pos.paymentAmount}
        onPaymentAmountChange={pos.setPaymentAmount}
        paymentDate={pos.paymentDate}
        onPaymentDateChange={pos.setPaymentDate}
        paymentNotes={pos.paymentNotes}
        onPaymentNotesChange={pos.setPaymentNotes}
        onSubmit={pos.handlePayment}
      />
      <ReceiptDialog
        open={pos.receiptDialog}
        onOpenChange={pos.setReceiptDialog}
        sale={pos.lastSale}
        tenant={{
          name: session?.user?.tenantName || "POS COLOMBIA",
          address: pos.branches.find(b => b.id === session?.user?.branchId)?.address || "Sede Principal",
          phone: pos.branches.find(b => b.id === session?.user?.branchId)?.phone || "Consulte en caja",
          nit: "Régimen Simplificado"
        }}
        onPrintGiftCard={pos.handlePrintGiftCard}
      />
      <GiftCardPrintDialog
        open={pos.showGiftCardPrintDialog}
        onOpenChange={pos.setShowGiftCardPrintDialog}
        card={pos.selectedGiftCard}
        tenant={{
          name: session?.user?.tenantName || "POS COLOMBIA",
          address: pos.branches.find(b => b.id === session?.user?.branchId)?.address || "Sede Principal",
          phone: pos.branches.find(b => b.id === session?.user?.branchId)?.phone || "Consulte en caja",
        }}
      />
      <CashReportDialog
        open={pos.cashReportDialog}
        onOpenChange={pos.setCashReportDialog}
        cashRegister={pos.cashRegister}
        todayExpenses={pos.todayExpenses}
        tenant={{
          name: session?.user?.tenantName || "POS COLOMBIA",
          address: pos.branches.find(b => b.id === session?.user?.branchId)?.address || "Sede Principal",
          phone: pos.branches.find(b => b.id === session?.user?.branchId)?.phone || "Consulte en caja",
        }}
      />
    </>
  )
}

"use client"

import { formatCurrency, formatDate } from "@/lib/utils"

interface CashReceiptProps {
  cashRegister: any
  tenant: any
  todayExpenses: number
}

export const CashReceipt = ({ cashRegister, tenant, todayExpenses }: CashReceiptProps) => {
  if (!cashRegister) return null

  const expectedCash = cashRegister.initialCash + cashRegister.totalCash - todayExpenses

  return (
    <div className="cash-receipt bg-white text-black p-4 font-mono text-[12px] leading-tight w-[300px] mx-auto">
      <style jsx global>{`
        @media print {
          @page { margin: 0; size: 80mm auto; }
          body { background: white; color: black; }
          .no-print { display: none !important; }
          .cash-receipt { width: 100% !important; padding: 10px !important; margin: 0 !important; }
        }
      `}</style>

      <div className="text-center mb-4 space-y-1">
        <h2 className="text-lg font-bold uppercase">{tenant?.name || "POS COLOMBIA"}</h2>
        <p className="text-[10px] uppercase font-bold">Resumen de Caja (X-Report)</p>
        <p>FECHA: {formatDate(new Date().toISOString())}</p>
      </div>

      <div className="border-t border-b border-black border-dashed py-2 mb-2 space-y-1">
        <div className="flex justify-between">
          <span>APERTURA:</span>
          <span>{formatDate(cashRegister.openedAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>ID CAJA:</span>
          <span>{cashRegister.id.substring(0, 8).toUpperCase()}</span>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <p className="font-bold border-b border-black border-dashed pb-1">DESGLOSE DE VENTAS</p>
        <div className="flex justify-between">
          <span>EFECTIVO:</span>
          <span>{formatCurrency(cashRegister.totalCash)}</span>
        </div>
        <div className="flex justify-between">
          <span>TARJETA:</span>
          <span>{formatCurrency(cashRegister.totalCard)}</span>
        </div>
        <div className="flex justify-between">
          <span>TRANSFERENCIA:</span>
          <span>{formatCurrency(cashRegister.totalTransfer)}</span>
        </div>
        <div className="flex justify-between">
          <span>CRÉDITOS:</span>
          <span>{formatCurrency(cashRegister.totalCredit)}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-black border-dashed pt-1">
          <span>VENTAS TOTALES:</span>
          <span>{formatCurrency(cashRegister.totalSales)}</span>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <p className="font-bold border-b border-black border-dashed pb-1">BALANCE DE EFECTIVO</p>
        <div className="flex justify-between">
          <span>(+) EFECTIVO INICIAL:</span>
          <span>{formatCurrency(cashRegister.initialCash)}</span>
        </div>
        <div className="flex justify-between">
          <span>(+) VENTAS EFECTIVO:</span>
          <span>{formatCurrency(cashRegister.totalCash)}</span>
        </div>
        <div className="flex justify-between text-red-600">
          <span>(-) GASTOS TOTALES:</span>
          <span>-{formatCurrency(todayExpenses)}</span>
        </div>
        <SeparatorLine />
        <div className="flex justify-between font-bold text-lg">
          <span>EFECTIVO ESPERADO:</span>
          <span>{formatCurrency(expectedCash)}</span>
        </div>
      </div>

      <div className="mt-8 border-t border-black border-dashed pt-8">
        <div className="border-t border-black w-2/3 mx-auto mt-4 pt-1 text-center font-bold">
          FIRMA RESPONSABLE
        </div>
      </div>

      <div className="text-center mt-6 text-[9px] text-gray-500">
        <p>Generado por FostPOS</p>
        <p>{new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
}

const SeparatorLine = () => <div className="border-t border-black border-double my-1" />

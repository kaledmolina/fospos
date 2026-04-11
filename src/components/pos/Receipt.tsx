"use client"

import { formatCurrency, formatDate } from "@/lib/utils"

interface ReceiptProps {
  sale: any
  tenant: any
}

export const Receipt = ({ sale, tenant }: ReceiptProps) => {
  if (!sale) return null

  return (
    <div className="receipt-container bg-white text-black p-4 font-mono text-[12px] leading-tight w-[300px] mx-auto">
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: 80mm auto;
          }
          body {
            background: white;
            color: black;
          }
          .no-print {
            display: none !important;
          }
          .receipt-container {
            width: 100% !important;
            padding: 10px !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="text-center mb-4 space-y-1">
        <h2 className="text-lg font-bold uppercase">{tenant?.name || "POS COLOMBIA"}</h2>
        <p>{tenant?.address || "Dirección del Establecimiento"}</p>
        <p>Tel: {tenant?.phone || "300 000 0000"}</p>
        <p>NIT: {tenant?.nit || "000.000.000-0"}</p>
      </div>

      <div className="border-t border-b border-black border-dashed py-2 mb-2 space-y-1">
        <p>FACTURA: {sale.invoiceNumber || sale.id.substring(0, 8).toUpperCase()}</p>
        <p>FECHA: {formatDate(sale.createdAt)}</p>
        <p>CLIENTE: {sale.customer?.name || "CLIENTE GENERAL"}</p>
        {sale.customer?.document && <p>DOC: {sale.customer.document}</p>}
      </div>

      <table className="w-full mb-4 border-collapse">
        <thead>
          <tr className="border-b border-black border-dashed text-left">
            <th className="py-1">DESCRIPCIÓN</th>
            <th className="py-1 text-center">CT.</th>
            <th className="py-1 text-right">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="py-1 uppercase text-[11px]">{item.productName}</td>
              <td className="py-1 text-center">{item.quantity}</td>
              <td className="py-1 text-right">{formatCurrency(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-black border-dashed pt-2 space-y-1">
        <div className="flex justify-between font-bold">
          <span>SUBTOTAL:</span>
          <span>{formatCurrency(sale.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>IVA (19%):</span>
          <span>{formatCurrency(sale.tax)}</span>
        </div>
        {sale.discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>DTO:</span>
            <span>-{formatCurrency(sale.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-1 border-t border-black border-double">
          <span>TOTAL:</span>
          <span>{formatCurrency(sale.total)}</span>
        </div>
        {sale.cashReceived > 0 && (
          <>
            <div className="flex justify-between pt-2">
              <span>EFECTIVO RECIBIDO:</span>
              <span>{formatCurrency(sale.cashReceived)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>CAMBIO:</span>
              <span>{formatCurrency(sale.change || 0)}</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <p className="font-bold">MÉTODO: {sale.paymentMethod === "CREDIT" ? "CRÉDITO" : sale.paymentMethod}</p>
        {sale.paymentMethod === "CREDIT" && (
          <p className="text-[10px] italic">*** ESTO ES UN COMPROBANTE DE DEUDA ***</p>
        )}
      </div>

      <div className="text-center mt-6 mb-2">
        <p className="font-bold">¡GRACIAS POR SU COMPRA!</p>
        <p className="text-[10px]">Desarrollado por FostPOS</p>
      </div>
    </div>
  )
}

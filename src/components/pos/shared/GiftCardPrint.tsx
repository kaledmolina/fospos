"use client"

import { formatCurrency, formatDate } from "@/lib/utils"

interface GiftCardPrintProps {
  card: {
    code: string
    balance: number
    expiresAt?: string | Date
    customer?: { name: string }
    createdAt?: string | Date
  }
  tenant: {
    name: string
    address?: string
    phone?: string
  }
}

export const GiftCardPrint = ({ card, tenant }: GiftCardPrintProps) => {
  if (!card) return null

  return (
    <div className="gift-card-print bg-white text-black p-4 font-mono text-[13px] leading-tight w-[300px] mx-auto border-2 border-black border-double rounded-sm">
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
          .gift-card-print {
            width: 100% !important;
            padding: 10px !important;
            margin: 0 !important;
            border: 2px solid black !important;
          }
        }
      `}</style>

      <div className="text-center mb-4 space-y-1">
        <h2 className="text-lg font-bold uppercase">{tenant.name}</h2>
        <p className="text-[10px] font-bold uppercase tracking-widest border-y border-black py-1">*** TARJETA DE REGALO ***</p>
      </div>

      <div className="space-y-3 py-2">
        <div className="text-center bg-black text-white py-2 rounded">
           <p className="text-[9px] uppercase tracking-widest font-bold">Saldo de la Tarjeta</p>
           <p className="text-2xl font-black">{formatCurrency(card.balance)}</p>
        </div>

        <div className="space-y-1 border-b border-black border-dashed pb-2">
          <div className="flex justify-between">
            <span>CÓDIGO:</span>
            <span className="font-bold">{card.code}</span>
          </div>
          <div className="flex justify-between">
            <span>FECHA EMISIÓN:</span>
            <span>{formatDate(card.createdAt || new Date())}</span>
          </div>
          <div className="flex justify-between uppercase">
            <span>CLIENTE:</span>
            <span className="truncate">{card.customer?.name || "CLIENTE GENERAL"}</span>
          </div>
          {card.expiresAt && (
            <div className="flex justify-between font-bold">
              <span>VÁLIDA HASTA:</span>
              <span>{formatDate(card.expiresAt)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-center px-4">
        <div className="border border-black p-2 mb-3">
           <p className="text-[10px] font-bold">INSTRUCCIONES DE USO</p>
           <p className="text-[9px] mt-1 leading-snug">Presente este ticket o proporcione el código al momento de su pago. El saldo se descontará de su compra.</p>
        </div>
        <p className="text-[9px] italic">Este documento es equivalente a dinero en efectivo dentro del establecimiento. No se aceptan devoluciones en efectivo por saldos remanentes.</p>
      </div>

      <div className="text-center mt-6">
        <p className="text-[10px] font-bold">¡DISFRUTA TU REGALO!</p>
        <p className="text-[8px] mt-1">Generado por FostPOS</p>
      </div>
    </div>
  )
}

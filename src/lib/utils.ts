import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export const formatDateShort = (date: string | Date) => {
  return new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

export const getDaysOverdue = (dueDate: string | Date) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = today.getTime() - due.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

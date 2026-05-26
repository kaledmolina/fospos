"use client"

import { Building2, Globe } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BranchData } from "@/types"

interface BranchSelectorProps {
  branches: BranchData[]
  selectedBranch: string | null
  onBranchChange: (branchId: string | null) => void
  isAdmin: boolean
  customName?: string
}

export const BranchSelector = ({
  branches,
  selectedBranch,
  onBranchChange,
  isAdmin,
  customName
}: BranchSelectorProps) => {
  if (!isAdmin || branches.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-xl">
        <Building2 className="w-4 h-4 text-primary shrink-0" />
        <span className="font-black uppercase text-[10px] tracking-wider text-primary truncate block max-w-[150px]">
          {customName || "Cargando..."}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedBranch || ""}
        onValueChange={onBranchChange}
      >
        <SelectTrigger className="h-9 px-3 bg-primary/5 hover:bg-primary/10 border-primary/20 dark:border-primary/10 rounded-xl transition-all shadow-none flex items-center gap-2 group">
          <div className="flex items-center gap-2 max-w-[150px] text-left">
            <Building2 className="w-4 h-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
            <span className="font-black uppercase text-[10px] tracking-wider text-primary truncate">
              {customName || "Seleccionar Sede"}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200 dark:border-zinc-800 shadow-xl">
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id} className="rounded-lg">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-500" />
                <span>{branch.name}</span>
                {branch.isMain && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold ml-1">
                    CP
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

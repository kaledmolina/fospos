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
      <div className="flex items-center gap-2 px-1">
        <span className="font-bold text-sm text-foreground truncate block">
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
        <SelectTrigger className="h-auto p-0 border-0 bg-transparent shadow-none hover:bg-transparent focus:ring-0 group">
          <div className="flex items-center gap-1.5 truncate max-w-[140px]">
            <span className="font-bold text-sm text-foreground truncate block transition-colors group-hover:text-emerald-500">
              {customName || "Seleccionar Sede"}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
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

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Truck, Plus, Search, Filter, Mail, Phone, 
  MapPin, Edit, Trash2, MoreVertical, ExternalLink 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SuppliersTabProps {
  suppliers: any[]
  onAdd: () => void
  onEdit: (supplier: any) => void
  onDelete: (id: string) => void
}

export const SuppliersTab = ({ suppliers, onAdd, onEdit, onDelete }: SuppliersTabProps) => {
  const [search, setSearch] = useState("")

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.nit?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Proveedores</h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium ml-1">Gestiona tus socios comerciales y fuentes de abastecimiento</p>
        </div>

        <Button 
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 group"
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" /> Nuevo Proveedor
        </Button>
      </div>

      <Card className="border border-slate-100 dark:border-zinc-800 shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-50 dark:border-zinc-900/50 bg-slate-50/30 dark:bg-zinc-900/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black tracking-tight">Directorio de Proveedores</CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-widest opacity-60">Total: {suppliers.length} registrados</CardDescription>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                <Input 
                  placeholder="Buscar por nombre, NIT o correo..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 bg-white/50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-emerald-500/20 font-medium"
                />
              </div>
              <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-zinc-800 shrink-0">
                <Filter className="w-4 h-4 opacity-60" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 divide-x divide-y divide-slate-50 dark:divide-zinc-900">
            <AnimatePresence mode="popLayout">
              {filteredSuppliers.map((supplier) => (
                <motion.div 
                  layout
                  key={supplier.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group p-6 hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-all duration-300 relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 group-hover:border-emerald-500/30 group-hover:shadow-lg group-hover:shadow-emerald-500/5 transition-all">
                      <Truck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-zinc-800 w-40">
                        <DropdownMenuItem onClick={() => onEdit(supplier)} className="rounded-lg h-10 cursor-pointer">
                          <Edit className="w-4 h-4 mr-2 text-blue-500" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(supplier.id)} 
                          className="rounded-lg h-10 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-1 mb-6">
                    <h3 className="font-black text-lg tracking-tight group-hover:text-emerald-600 transition-colors uppercase line-clamp-1">
                      {supplier.name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <Badge variant="outline" className="text-[9px] font-black tracking-widest bg-slate-100/50 dark:bg-zinc-900 border-none opacity-60">
                        NIT {supplier.nit || "SIN REGISTRO"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span className="tabular-nums">{supplier.phone || "No registrado"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{supplier.email || "No registrado"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{supplier.address || "Sin dirección"}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 dark:border-zinc-900 flex items-center justify-between">
                    <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest opacity-40">
                      ID: {supplier.id.slice(-8)}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 rounded-lg font-bold text-[10px] uppercase text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
                      Ver Historial <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredSuppliers.length === 0 && (
              <div className="col-span-full py-24 text-center space-y-4">
                <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] mx-auto flex items-center justify-center">
                  <Truck className="w-10 h-10 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-xl">No se encontraron proveedores</p>
                  <p className="text-muted-foreground text-sm font-medium">Ajusta tu búsqueda o registra uno nuevo para empezar.</p>
                </div>
                <Button 
                  onClick={onAdd}
                  className="mt-4 bg-emerald-600 dark:bg-emerald-500 rounded-2xl h-11 px-8 font-black uppercase tracking-widest text-[10px]"
                >
                  <Plus className="w-3 h-3 mr-2" /> Registrar ahora
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

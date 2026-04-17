"use client"

import { motion } from "framer-motion"
import { Settings, Building, Star, Percent, Receipt, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { fadeInUp } from "@/lib/animations"

export const SettingsTab = ({ userRole }: { userRole: string }) => {
  const isAdmin = userRole === "TENANT_ADMIN"

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Settings className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <p className="text-xl font-medium">Acceso restringido</p>
        <p className="text-muted-foreground">Solo el administrador puede acceder a la configuración global.</p>
      </div>
    )
  }

  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración y Personalización</h1>
        <p className="text-muted-foreground">Ajusta los parámetros globales de tu sede.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="general" className="gap-2"><Building className="w-4 h-4" /> General</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2"><Receipt className="w-4 h-4" /> Facturación</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Identidad de la Sede</CardTitle>
              <CardDescription>Esta información aparecerá en tus reportes y facturas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre Comercial</Label>
                  <Input placeholder="Ej: Fost Accesorios" />
                </div>
                <div className="space-y-2">
                  <Label>NIT / RUT</Label>
                  <Input placeholder="123456789-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Eslogan o Mensaje de Bienvenida</Label>
                <Input placeholder="¡Gracias por tu compra!" />
              </div>
              <Button className="bg-emerald-500 hover:bg-emerald-600">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reglas de Negocio</CardTitle>
              <CardDescription>Valores predeterminados para tus ventas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Impuesto Predeterminado (IVA %)</Label>
                  <Input type="number" defaultValue="19" />
                </div>
                <div className="space-y-2">
                  <Label>Habilitar Propina Sugerida</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch />
                    <span className="text-sm">Activo</span>
                  </div>
                </div>
              </div>
              <Button className="bg-emerald-500 hover:bg-emerald-600">Actualizar Facturación</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Building, Receipt, Wallet, CreditCard, RefreshCw, FileText, Ticket, LayoutGrid } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { fadeInUp } from "@/lib/animations"

interface SettingsTabProps {
  userRole: string;
  settings: any;
  onUpdateSettings: (payload: any) => Promise<boolean>;
}

export const SettingsTab = ({ userRole, settings, onUpdateSettings }: SettingsTabProps) => {
  const isAdmin = userRole === "TENANT_ADMIN"
  const [form, setForm] = useState({
    businessName: "",
    nit: "",
    address: "",
    phone: "",
    taxRate: 19,
    enabledPaymentMethods: ""
  })

  useEffect(() => {
    if (settings) {
      setForm({
        businessName: settings.businessName || "",
        nit: settings.nit || "",
        address: settings.address || "",
        phone: settings.phone || "",
        taxRate: settings.taxRate || 0,
        enabledPaymentMethods: settings.enabledPaymentMethods || ""
      })
    }
  }, [settings])

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Settings className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <p className="text-xl font-medium">Acceso restringido</p>
        <p className="text-muted-foreground">Solo el administrador puede acceder a la configuración global.</p>
      </div>
    )
  }

  const handleToggleMethod = (method: string) => {
    const methods = form.enabledPaymentMethods.split(",").filter(Boolean)
    const newMethods = methods.includes(method)
      ? methods.filter(m => m !== method)
      : [...methods, method]
    setForm({ ...form, enabledPaymentMethods: newMethods.join(",") })
  }

  const handleSubmit = async () => {
    await onUpdateSettings(form)
  }

  const paymentMethods = [
    { id: "CASH", label: "Efectivo", icon: Wallet },
    { id: "CARD", label: "Tarjeta", icon: CreditCard },
    { id: "TRANSFER", label: "Transferencia", icon: RefreshCw },
    { id: "CREDIT", label: "Crédito", icon: FileText },
    { id: "GIFT_CARD", label: "Tarjeta Regalo", icon: Ticket },
    { id: "MIXED", label: "Pago Mixto", icon: LayoutGrid }
  ]

  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración y Personalización</h1>
        <p className="text-muted-foreground">Ajusta los parámetros globales de tu negocio.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="general" className="gap-2"><Building className="w-4 h-4" /> General</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2"><Receipt className="w-4 h-4" /> Facturación</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Identidad del Negocio</CardTitle>
              <CardDescription>Esta información aparecerá en tus reportes y facturas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre Comercial</Label>
                  <Input 
                    value={form.businessName} 
                    onChange={e => setForm({...form, businessName: e.target.value})}
                    placeholder="Ej: Fost Accesorios" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>NIT / RUT</Label>
                  <Input 
                    value={form.nit} 
                    onChange={e => setForm({...form, nit: e.target.value})}
                    placeholder="123456789-0" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dirección Principal</Label>
                  <Input 
                    value={form.address} 
                    onChange={e => setForm({...form, address: e.target.value})}
                    placeholder="Calle 123 #45-67" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono de Contacto</Label>
                  <Input 
                    value={form.phone} 
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="+57 300 123 4567" 
                  />
                </div>
              </div>
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary cursor-pointer">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Impuestos y Cobros</CardTitle>
              <CardDescription>Configura los valores predeterminados para tus ventas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>IVA Predeterminado (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={form.taxRate} 
                      onChange={e => setForm({...form, taxRate: parseFloat(e.target.value) || 0})}
                      min="0"
                      max="100"
                    />
                    <span className="font-bold text-muted-foreground">%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">Este valor se aplicará a todas las ventas nuevas.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago Habilitados</CardTitle>
              <CardDescription>Selecciona qué formas de pago estarán disponibles en la caja.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {paymentMethods.map(method => (
                  <div 
                    key={method.id} 
                    className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${form.enabledPaymentMethods.includes(method.id) ? "bg-primary/5 border-primary/30" : "bg-muted/10 opacity-60"}`}
                    onClick={() => handleToggleMethod(method.id)}
                  >
                    <Checkbox 
                      id={method.id} 
                      checked={form.enabledPaymentMethods.includes(method.id)}
                      onCheckedChange={() => handleToggleMethod(method.id)}
                    />
                    <div className="flex items-center gap-2">
                      <method.icon className={`w-4 h-4 ${form.enabledPaymentMethods.includes(method.id) ? "text-primary" : "text-muted-foreground"}`} />
                      <Label htmlFor={method.id} className="cursor-pointer font-bold text-xs">{method.label}</Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} size="lg" className="bg-primary hover:bg-primary cursor-pointer shadow-lg shadow-primary/20">
              Guardar Configuración de Facturación
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Store, ArrowLeft, Mail, Lock, Eye, EyeOff, 
  LogIn, AlertCircle, Rocket, User, CheckCircle, Zap, TrendingUp,
  ShieldCheck, Phone, Building2, MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fadeInUp, staggerContainer, floatAnimation } from "@/lib/animations"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { StaffAccessView } from "./StaffAccessView"

interface AuthViewProps {
  authTab: "login" | "register" | "staff"
  onAuthTabChange: (tab: "login" | "register" | "staff") => void
  loginForm: any
  onLoginFormChange: (form: any) => void
  onLogin: (e: React.FormEvent<HTMLFormElement>) => void
  loginLoading: boolean
  loginError: string
  onLoginErrorChange: (err: string) => void
  registerForm: any
  onRegisterFormChange: (form: any) => void
  onRegister: (e: React.FormEvent<HTMLFormElement>) => void
  registerLoading: boolean
  registerError: string
  onRegisterErrorChange: (err: string) => void
  onShowLanding: () => void
}

export const AuthView = ({
  authTab,
  onAuthTabChange,
  loginForm,
  onLoginFormChange,
  onLogin,
  loginLoading,
  loginError,
  onLoginErrorChange,
  registerForm,
  onRegisterFormChange,
  onRegister,
  registerLoading,
  registerError,
  onRegisterErrorChange,
  onShowLanding,
}: AuthViewProps) => {
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden transition-colors duration-500">
      {/* Visual Side (50%) - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onShowLanding}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none text-foreground">Fost<span className="text-emerald-500">POS</span></h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Smart Engine</p>
            </div>
          </motion.div>

          <motion.div 
            className="mt-20 max-w-lg"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-5xl font-black leading-[0.9] tracking-tighter mb-6 text-foreground"
            >
              Control total en la <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">palma de tu mano.</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg font-medium opacity-70">
              Unete a la revolucion del comercio digital. Gestiona sedes, inventarios y ventas con tecnologia de punta.
            </motion.p>
          </motion.div>
        </div>

        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative group">
             <div className="absolute -inset-4 bg-emerald-500/10 rounded-[2rem] blur-2xl transition-opacity animate-pulse" />
             <img 
               src="/hero-dashboard.png" 
               alt="Dashboard Mockup" 
               className="rounded-3xl border border-white/10 shadow-2xl transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-700"
             />
             <motion.div 
                className="absolute -top-6 -right-6 bg-slate-900 border border-white/10 p-4 rounded-2xl shadow-2xl hidden xl:block"
                variants={floatAnimation}
                animate="animate"
             >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Growth</p>
                      <p className="text-lg font-black">+240%</p>
                   </div>
                </div>
             </motion.div>
          </div>
        </motion.div>

        <div className="relative z-10 flex gap-10">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Multi-Sede
           </div>
           <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Nube Segura
           </div>
           <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> SOPORTE 24/7
           </div>
        </div>
      </div>

      {/* Auth Side (50%) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 md:p-24 relative overflow-y-auto bg-card">
        <div className="absolute top-4 right-4 z-20">
           <ThemeToggle />
        </div>
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-12">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={onShowLanding}
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tighter">Fost<span className="text-emerald-400">POS</span></h1>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-black tracking-tighter mb-2 text-foreground">
              {authTab === "login" ? "Bienvenido de nuevo." : "Crea tu cuenta."}
            </h2>
            <p className="text-muted-foreground text-sm font-medium mb-8">
              {authTab === "login" ? "Ingresa para gestionar tu negocio." : "Empieza tu prueba gratuita de 30 días hoy."}
            </p>
          </motion.div>

          <Tabs value={authTab} onValueChange={(v) => onAuthTabChange(v as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 bg-muted border border-border p-1 mb-8 rounded-xl">
               <TabsTrigger 
                 value="login" 
                 className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase text-[10px] tracking-widest transition-all"
               >
                 Admin
               </TabsTrigger>
               <TabsTrigger 
                 value="staff" 
                 className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase text-[10px] tracking-widest transition-all"
               >
                 Personal
               </TabsTrigger>
               <TabsTrigger 
                value="register" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase text-[10px] tracking-widest transition-all"
                onClick={() => {
                  onLoginErrorChange("");
                  onRegisterErrorChange("");
                }}
              >
                Registrarse
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="login" key="login-tab" className="mt-0">
                <motion.form 
                  onSubmit={onLogin} 
                  className="space-y-5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <AnimatePresence>
                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold leading-relaxed flex items-center gap-3"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {loginError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Correo Electrónico</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                       <Input 
                         type="email"
                         placeholder="email@negocio.com"
                         value={loginForm.email}
                         onChange={e => onLoginFormChange({ ...loginForm, email: e.target.value })}
                         className="h-14 pl-12 bg-muted/30 border-border rounded-xl focus:border-primary focus:ring-primary/10 transition-all font-medium"
                         disabled={loginLoading}
                         required
                       />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Contraseña</label>
                      <button type="button" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-foreground/80 transition-colors">Olvidé mi contraseña</button>
                    </div>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                       <Input 
                         type={showLoginPassword ? "text" : "password"}
                         placeholder="••••••••"
                         value={loginForm.password}
                         onChange={e => onLoginFormChange({ ...loginForm, password: e.target.value })}
                         className="h-14 pl-12 pr-12 bg-muted/30 border-border rounded-xl focus:border-primary focus:ring-primary/10 transition-all font-medium"
                         disabled={loginLoading}
                         required
                       />
                       <button
                         type="button"
                         onClick={() => setShowLoginPassword(!showLoginPassword)}
                         className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                       >
                         {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                       </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase text-xs tracking-widest rounded-xl shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Verificando..." : "Iniciar Sesión"}
                  </Button>
                </motion.form>
              </TabsContent>

              <TabsContent value="staff" key="staff-tab" className="mt-0">
                <StaffAccessView 
                  loading={loginLoading}
                  onLogin={async (email, pin) => {
                    onLoginFormChange({ email, password: pin });
                    // Trigger login programmatically
                    setTimeout(() => {
                      const form = document.querySelector('form') as HTMLFormElement;
                      if (form) onLogin({ preventDefault: () => {}, currentTarget: form } as any);
                    }, 100);
                  }}
                />
              </TabsContent>

              <TabsContent value="register" key="register-tab" className="mt-0">
                <motion.form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (registerForm.password.length < 8) {
                      onRegisterErrorChange("La contraseña debe tener al menos 8 caracteres");
                      return;
                    }
                    if (registerForm.password !== registerForm.confirmPassword) {
                      onRegisterErrorChange("Las contraseñas no coinciden");
                      return;
                    }
                    onRegister(e);
                  }}
                  className="space-y-4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <AnimatePresence mode="wait">
                    {registerError && (
                      <motion.div
                        key="register-error"
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold leading-relaxed flex items-center gap-3 mb-2"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {registerError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Business Name</label>
                       <div className="relative">
                          <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                          <Input 
                            placeholder="Nombre de tu negocio"
                            value={registerForm.businessName}
                            onChange={e => onRegisterFormChange({ ...registerForm, businessName: e.target.value })}
                            className="h-14 pl-12 bg-muted/30 border-border rounded-xl focus:border-primary font-medium"
                            required
                          />
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">NIT / ID</label>
                       <Input 
                         placeholder="NIT o Cédula"
                         value={registerForm.nit}
                         onChange={e => onRegisterFormChange({ ...registerForm, nit: e.target.value })}
                         className="h-14 bg-muted/30 border-border rounded-xl focus:border-primary font-medium"
                         required
                       />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Phone</label>
                       <Input 
                         placeholder="+57..."
                         value={registerForm.phone}
                         onChange={e => onRegisterFormChange({ ...registerForm, phone: e.target.value })}
                         className="h-14 bg-muted/30 border-border rounded-xl focus:border-primary font-medium"
                         required
                       />
                    </div>

                    <div className="space-y-1.5 col-span-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Owner Name</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                          <Input 
                            placeholder="Nombre completo responsable"
                            value={registerForm.ownerName}
                            onChange={e => onRegisterFormChange({ ...registerForm, ownerName: e.target.value })}
                            className="h-14 pl-12 bg-muted/30 border-border rounded-xl focus:border-primary font-medium"
                            required
                          />
                       </div>
                    </div>

                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email</label>
                       <Input 
                         type="email"
                         placeholder="email@empresa.com"
                         value={registerForm.email}
                         onChange={e => onRegisterFormChange({ ...registerForm, email: e.target.value })}
                         className="h-14 bg-muted/30 border-border rounded-xl focus:border-primary font-medium"
                         required
                       />
                    </div>

                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">City</label>
                       <Input 
                         placeholder="Bogotá, Medellín..."
                         value={registerForm.city}
                         onChange={e => onRegisterFormChange({ ...registerForm, city: e.target.value })}
                         className="h-14 bg-muted/30 border-border rounded-xl focus:border-primary font-medium"
                         required
                       />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Contraseña</label>
                       <div className="relative">
                          <Input 
                            type={showRegisterPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={registerForm.password}
                            onChange={e => onRegisterFormChange({ ...registerForm, password: e.target.value })}
                            className="h-14 pr-12 bg-muted/30 border-border rounded-xl focus:border-primary font-medium"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirmar Contraseña</label>
                       <Input 
                         type={showRegisterConfirmPassword ? "text" : "password"}
                         placeholder="••••••••"
                         value={registerForm.confirmPassword}
                         onChange={e => onRegisterFormChange({ ...registerForm, confirmPassword: e.target.value })}
                         className="h-14 bg-muted/30 border-border rounded-xl focus:border-primary font-medium"
                         required
                       />
                    </div>

                    <div className="space-y-1.5 md:col-span-2 mt-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Código de Activación (Opcional)</label>
                       <div className="relative">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/60" />
                          <Input 
                            placeholder="FOST-XXXX-XXXX"
                            value={registerForm.activationCode || ""}
                            onChange={e => {
                              const val = e.target.value.toUpperCase();
                              onRegisterFormChange({ ...registerForm, activationCode: val });
                            }}
                            className="h-14 pl-12 bg-muted/30 border-border rounded-xl focus:border-emerald-500 focus:ring-emerald-500/10 transition-all font-mono font-bold tracking-widest"
                            disabled={registerLoading}
                          />
                       </div>
                       <p className="text-[10px] text-muted-foreground/60 px-2 font-medium">Si tienes una llave de activación, ingrésala para activar tu cuenta de inmediato.</p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-primary text-primary-foreground hover:opacity-90 font-black uppercase text-xs tracking-widest rounded-xl transition-all duration-300 shadow-xl shadow-primary/20 cursor-pointer"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Registrar mi Negocio
                  </Button>

                  <p className="text-[10px] text-center text-muted-foreground font-medium">
                    Al registrarte, aceptas nuestros <span className="text-primary hover:underline cursor-pointer">Términos y Condiciones</span> y Política de Privacidad.
                  </p>
                </motion.form>
              </TabsContent>
            </AnimatePresence>
          </Tabs>

          <Button
            variant="ghost"
            onClick={onShowLanding}
            className="w-full mt-10 text-muted-foreground hover:text-foreground hover:bg-accent font-bold uppercase text-[10px] tracking-widest cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la landing page
          </Button>
        </div>

        <footer className="mt-auto pt-10 text-center text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
           © 2024 FOSTPOS SOFTWARE LTD. - System Engine V2.0
        </footer>
      </div>
    </div>
  )
}

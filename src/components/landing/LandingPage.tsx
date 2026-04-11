"use client"

import { motion } from "framer-motion"
import { 
  Store, ArrowRight, Building2, Briefcase, Globe, TrendingUp, 
  Wallet, Package, Smartphone, Users, BarChart3, Shield, 
  CheckCircle, Star, Rocket, Mail, ChevronRight, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { containerVariants, itemVariants, floatAnimation } from "@/lib/animations"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

interface LandingPageProps {
  onEnterApp: () => void
  onRegister: () => void
}

export const LandingPage = ({ onEnterApp, onRegister }: LandingPageProps) => {
  const plans = [
    {
      name: "Emprendedor",
      price: "49.900",
      description: "Ideal para pequeños negocios que están comenzando.",
      features: ["1 Sede", "Hasta 500 productos", "Ventas y Facturación", "Control de Inventario", "Soporte por email"],
      color: "emerald",
      popular: false
    },
    {
      name: "Negocio Pro",
      price: "89.900",
      description: "Todo lo que necesitas para escalar tu negocio.",
      features: ["Hasta 3 Sedes", "Productos ilimitados", "Reportes avanzados", "Módulo de Clientes y Fiados", "Soporte prioritario"],
      color: "teal",
      popular: true
    },
    {
      name: "Empresarial",
      price: "Consultar",
      description: "Soluciones personalizadas para grandes operaciones.",
      features: ["Sedes ilimitadas", "Usuarios ilimitados", "API personalizada", "Integraciones externas", "Account Manager dedicado"],
      color: "slate",
      popular: false
    }
  ]

  const testimonials = [
    {
      name: "Carlos Rodríguez",
      role: "Dueño de Minimal Tienda",
      content: "Desde que implementamos FostPOS, el control de mi inventario es impecable. Los fiados ya no son un dolor de cabeza.",
      avatar: "CR"
    },
    {
      name: "Elena Gómez",
      role: "Gerente de Boutique Aurora",
      content: "La facilidad de uso en el móvil me permite ver cómo va mi negocio incluso cuando no estoy en el local. ¡Altamente recomendado!",
      avatar: "EG"
    },
    {
      name: "Ricardo Mesa",
      role: "Propietario de Ferretería El Martillo",
      content: "El soporte técnico es excelente y el sistema es muy intuitivo. Mis cajeros aprendieron a usarlo en menos de una hora.",
      avatar: "RM"
    }
  ]

  return (
    <motion.div 
      className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30 overflow-x-hidden font-sans transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Premium Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Store className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-black leading-none tracking-tighter text-foreground">Fost<span className="text-emerald-500">POS</span></h1>
              <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-1">Smart Business Cloud</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <a href="#inicio" className="hover:text-emerald-500 transition-colors">Inicio</a>
            <a href="#caracteristicas" className="hover:text-emerald-500 transition-colors">Características</a>
            <a href="#precios" className="hover:text-emerald-500 transition-colors">Planes</a>
            <a href="#testimonios" className="hover:text-emerald-500 transition-colors">Clientes</a>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={onEnterApp}
              className="hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-accent text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              Log In
            </Button>
            <Button
              onClick={onRegister}
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 px-8 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative pt-32 pb-20 lg:pt-52 lg:pb-40 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={itemVariants} className="z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-10 backdrop-blur-md"
            >
              <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">The Future of Retail is Here</span>
            </motion.div>
            
            <h2 className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-foreground">
              Vende más. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600">Gana mejor.</span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium opacity-80">
              La plataforma de gestión empresarial más avanzada y visualmente impresionante. Control total de tu negocio desde cualquier lugar, en tiempo real.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={onRegister}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:text-white h-16 px-12 text-sm font-black uppercase tracking-widest rounded-2xl shadow-2xl transition-all duration-500 group cursor-pointer"
              >
                Empezar Ahora
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onEnterApp}
                className="border-white/20 hover:bg-white/5 h-16 px-12 text-sm font-black uppercase tracking-widest rounded-2xl backdrop-blur-md transition-all duration-500 cursor-pointer"
              >
                Agendar Demo
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-[#020617] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)]">
                <div className="bg-slate-900/50 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.3em]">FOST-POS-ENGINE.V2.0</div>
                </div>
                <img 
                  src="/hero-dashboard.png" 
                  alt="FostPOS Dashboard" 
                  className="w-full h-auto transform transition-transform duration-1000 group-hover:scale-[1.03]"
                />
              </div>
              
              {/* Floating Stat Card */}
              <motion.div 
                className="absolute -bottom-10 -right-10 bg-emerald-500 text-white p-6 rounded-3xl shadow-2xl hidden md:block"
                variants={floatAnimation}
                animate="animate"
              >
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-8 h-8" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Revenue Today</div>
                    <div className="text-2xl font-black leading-tight">$4.890.000</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="caracteristicas" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-10">
            <div className="max-w-2xl">
              <h2 className="text-emerald-400 text-xs font-black uppercase tracking-[0.4em] mb-6">Capabilities</h2>
              <h3 className="text-5xl lg:text-7xl font-black mb-8 leading-none tracking-tighter">Potencia bruta para <br />tu comercio.</h3>
              <p className="text-gray-400 text-xl font-medium opacity-70">Diseñado para ser la espina dorsal de tu operación. Sin fricciones, sin retrasos, solo resultados.</p>
            </div>
            <div className="flex gap-4">
               <div className="p-4 bg-muted rounded-2xl border border-border text-center flex-1">
                 <p className="text-3xl font-black text-foreground">5k+</p>
                 <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Negocios</p>
               </div>
               <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center flex-1">
                 <p className="text-3xl font-black text-emerald-400">99%</p>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Uptime</p>
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Wallet,
                title: "Flujo de Caja",
                desc: "Gestión impecable de ingresos y egresos. Cada peso bajo control, cada cierre perfecto.",
                accent: "emerald"
              },
              {
                icon: Package,
                title: "Manejo de Stock",
                desc: "Alertas inteligentes y control multi-sede. Nunca te quedes sin stock de lo que más vendes.",
                accent: "teal"
              },
              {
                icon: Users,
                title: "CRM de Clientes",
                desc: "Conoce a tus clientes. Gestiona créditos y deudas con un sistema de cobro automático.",
                accent: "blue"
              },
              {
                icon: BarChart3,
                title: "Business Intelligence",
                desc: "Reportes visuales de alto impacto. Descubre tendencias y optimiza tus márgenes.",
                accent: "purple"
              },
              {
                icon: Shield,
                title: "Ciberseguridad",
                desc: "Protección de datos nivel bancario. Tu información es tu activo más valioso.",
                accent: "red"
              },
              {
                icon: Smartphone,
                title: "Experiencia Móvil",
                desc: "La aplicación de ventas más rápida del mercado. Toda la potencia en la palma de tu mano.",
                accent: "amber"
              }
            ].map((f, i) => (
              <motion.div
                key={f.title}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group cursor-default"
              >
                <Card className="h-full bg-card border border-border hover:border-emerald-500/30 transition-all duration-700 p-10 rounded-[2.5rem]">
                  <div className={`w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500`}>
                    <f.icon className={`w-8 h-8 text-emerald-500`} />
                  </div>
                  <h4 className="text-2xl font-black mb-4 text-foreground tracking-tight">{f.title}</h4>
                  <p className="text-muted-foreground text-base leading-relaxed font-medium opacity-60 group-hover:opacity-100 transition-opacity duration-500">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Experience */}
      <section className="py-32 px-6 bg-emerald-500/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24 items-center">
          <div className="lg:w-1/2 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px]" />
            <motion.img 
              src="/hero-mobile.png" 
              alt="FostPOS Mobile" 
              className="max-w-[450px] w-full mx-auto relative z-10 drop-shadow-[0_40px_80px_rgba(16,185,129,0.3)] rounded-[3rem]"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-emerald-400 text-xs font-black uppercase tracking-[0.4em] mb-6">Mobility</h2>
            <h3 className="text-5xl lg:text-7xl font-black mb-10 leading-none tracking-tighter">Tu negocio <br />en el bolsillo.</h3>
            <p className="text-gray-400 text-xl font-medium mb-12 opacity-80 leading-relaxed">
              Vende en ferias, domicilios o en el salón. Nuestra app móvil no es una versión reducida, es todo el motor de FostPOS optimizado para un toque.
            </p>
            <div className="space-y-6">
              {[
                { title: "Ventas Offline", desc: "Sigue vendiendo incluso sin internet." },
                { title: "Escaneo por Cámara", desc: "No necesitas hardware adicional." },
                { title: "Tickets Digitales", desc: "Ahorra en papel y cuida el planeta." }
              ].map(item => (
                <div key={item.title} className="flex gap-5 group">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="text-white font-black text-lg group-hover:text-emerald-400 transition-colors">{item.title}</h5>
                    <p className="text-gray-500 text-sm font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-14 h-16 px-12 rounded-2xl bg-white text-slate-950 font-black uppercase text-xs tracking-widest hover:bg-emerald-400 hover:text-white transition-all cursor-pointer">
              Descargar App
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter">Precios transparentes.</h2>
            <p className="text-gray-400 text-xl font-medium opacity-70 italic">Escale su negocio sin sorpresas al final del mes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full z-10 shadow-2xl">
                    Most Chosen
                  </div>
                )}
                <Card className={`h-full bg-white/[0.03] backdrop-blur-2xl border ${plan.popular ? "border-emerald-500/50" : "border-white/5"} transition-all duration-500 rounded-[3rem] overflow-hidden group`}>
                   {plan.popular && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />}
                  <CardHeader className="p-12 text-center">
                    <h4 className="text-sm font-black text-gray-500 mb-8 uppercase tracking-[0.3em]">{plan.name}</h4>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {plan.price !== "Consultar" && <span className="text-2xl font-black text-gray-600">$</span>}
                      <span className="text-7xl font-black text-white leading-none tracking-tighter">{plan.price}</span>
                      {plan.price !== "Consultar" && <span className="text-gray-500 text-sm font-black">/mo</span>}
                    </div>
                    <p className="text-xs text-gray-400 font-medium px-4">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="px-12 pb-12">
                    <Separator className="bg-white/5 mb-10" />
                    <ul className="space-y-6 mb-12">
                      {plan.features.map(feat => (
                        <li key={feat} className="flex gap-4 text-sm font-bold text-gray-300">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 cursor-pointer ${plan.popular ? "bg-emerald-500 text-white hover:bg-white hover:text-slate-950" : "bg-white/5 text-white hover:bg-white/10"}`}
                      onClick={onRegister}
                    >
                      Start Plan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-32 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-24 gap-10">
             <h3 className="text-5xl lg:text-7xl font-black tracking-tighter">Wall of <span className="text-emerald-400">Trust.</span></h3>
             <div className="flex gap-2">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /></div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /></div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /></div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /></div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /></div>
             </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={itemVariants}>
                <Card className="bg-white/5 border border-white/5 h-full p-10 rounded-[2.5rem] hover:bg-white/[0.08] transition-all duration-500 group">
                  <p className="text-gray-300 text-lg leading-relaxed mb-10 italic font-medium opacity-80 group-hover:opacity-100 transition-opacity">"{t.content}"</p>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-xl">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-black text-white tracking-tight">{t.name}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-6xl lg:text-9xl font-black mb-12 tracking-tighter leading-none">Ready to <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500">Transform?</span></h2>
          <p className="text-2xl text-gray-400 mb-16 max-w-2xl mx-auto font-medium opacity-70">
            Únase a los miles de negocios que ya operan a la velocidad de la luz con FostPOS.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={onRegister}
              className="bg-emerald-500 hover:bg-emerald-600 text-white h-20 px-16 text-xl font-black uppercase tracking-[0.2em] rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
            >
              Start Free Today
              <Rocket className="ml-4 w-6 h-6 animate-bounce" />
            </Button>
          </motion.div>
          <p className="mt-10 text-gray-600 text-xs font-bold uppercase tracking-[0.3em]">No credit card required • 30-day trial</p>
        </div>
        
        {/* Giant Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
           <Store className="w-[800px] h-[800px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500/10" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#020617]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-foreground">Fost<span className="text-emerald-500">POS</span></h1>
            </div>
            <p className="text-gray-500 text-base max-w-sm mb-10 font-medium leading-relaxed">
              Redefiniendo el comercio en América Latina con tecnología SaaS de vanguardia e interfaces que inspiran grandeza.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={Globe} />
              <SocialIcon icon={Mail} />
              <motion.div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 cursor-pointer hover:text-emerald-400 hover:border-emerald-400 transition-all">
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </div>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10">Product</h5>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10">Company</h5>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Story</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Legal</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-600">
          <p>© 2024 FOSTPOS SOFTWARE LTD.</p>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-white transition-colors">System Status</span>
            <span className="cursor-pointer hover:text-white transition-colors">Help Center</span>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}

const SocialIcon = ({ icon: Icon }: { icon: any }) => (
  <motion.div 
    whileHover={{ y: -3, color: "#10B981", borderColor: "#10B981" }}
    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 transition-all cursor-pointer"
  >
    <Icon className="w-5 h-5" />
  </motion.div>
)

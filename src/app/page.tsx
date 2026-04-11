"use client"

import { useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { LandingPage } from "@/components/landing/LandingPage"
import { AuthView } from "@/components/auth/AuthView"
import { RegistrationSuccessView } from "@/components/auth/RegistrationSuccessView"
import { SetupView } from "@/components/setup/SetupView"
import { SuperAdminDashboard } from "@/components/superadmin/SuperAdminDashboard"
import { POSView } from "@/components/pos/POSView"

export default function Home() {
  const { data: session, status } = useSession()
  const [showLanding, setShowLanding] = useState(true)
  const [authTab, setAuthTab] = useState<"login" | "register">("login")
  const [view, setView] = useState<"auth" | "pos" | "superadmin" | "setup">("auth")
  const [needsSetup, setNeedsSetup] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Auth state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [registerForm, setRegisterForm] = useState({
    businessName: "", nit: "", ownerName: "", email: "", 
    phone: "", city: "", address: "", password: "", confirmPassword: "",
    activationCode: ""
  })
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  // Check setup status
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const res = await fetch("/api/setup/check")
        const data = await res.json()
        if (data.needsSetup) {
          setNeedsSetup(true)
          setView("setup")
          // Si hay una sesión fantasma (cookies viejas), limpiarla
          if (status === "authenticated") {
            signOut({ redirect: false })
          }
        }
      } catch (error) {
        console.error("Setup check failed:", error)
      }
    }
    checkSetup()
  }, [status])

  // View logic
  useEffect(() => {
    if (needsSetup) {
      setView("setup")
      setShowLanding(false)
      return
    }

    if (status === "authenticated" && session?.user) {
      setShowLanding(false)
      if (session.user.role === "SUPER_ADMIN") {
        setView("superadmin")
      } else {
        setView("pos")
      }
    } else if (status === "unauthenticated") {
      setView("auth")
    }
  }, [status, session, needsSetup])

  // Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError("")
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: loginForm.email,
        password: loginForm.password,
      })
      if (result?.error) {
        setLoginError("Credenciales inválidas o cuenta no activada")
        toast.error("Error de inicio de sesión")
      } else {
        toast.success("¡Bienvenido!")
      }
    } catch {
      setLoginError("Error de conexión")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registerForm.password !== registerForm.confirmPassword) {
      return toast.error("Las contraseñas no coinciden")
    }
    setRegisterLoading(true)
    try {
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm)
      })
      const data = await res.json()
      if (data.success) {
        setRegisteredEmail(registerForm.email)
        setShowSuccess(true)
        setRegisterForm({
          businessName: "", nit: "", ownerName: "", email: "", 
          phone: "", city: "", address: "", password: "", confirmPassword: "",
          activationCode: ""
        })
      } else {
        setRegisterError(data.error || "Error al registrar")
        toast.error(data.error || "Error al registrar")
      }
    } catch {
      setRegisterError("Error de conexión con el servidor")
      toast.error("Error de servidor")
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    
    console.log("Iniciando configuración inicial con datos:", { ...data, password: "***" })
    
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      
      const responseData = await res.json()
      console.log("Respuesta de /api/seed:", responseData)

      if (responseData.success) {
        toast.success("¡Super Admin creado exitosamente!")
        setNeedsSetup(false)
        setView("auth")
        setAuthTab("login")
        // Pre-cargar el email en el formulario de login
        setLoginForm(prev => ({ ...prev, email: String(data.email) }))
      } else {
        toast.error(responseData.error || "Error al crear Super Admin")
        console.error("Fallo en setup:", responseData.error)
      }
    } catch (error) {
      console.error("Error de conexión en setup:", error)
      toast.error("Error de conexión con el servidor")
    }
  }



  // LOADING STATE
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
        />
      </div>
    )
  }

  // SETUP VIEW
  if (view === "setup" || needsSetup) {
    return <SetupView onSetup={handleSetup} />
  }

  // AUTH VIEW
  if (view === "auth") {
    if (showLanding) return <LandingPage onEnterApp={() => setShowLanding(false)} onRegister={() => { setShowLanding(false); setAuthTab("register") }} />
    
    if (showSuccess) {
      return (
        <RegistrationSuccessView
          registeredEmail={registeredEmail}
          showConfetti={true}
          onLoginClick={(email) => {
            setShowSuccess(false)
            setAuthTab("login")
            setLoginForm({ ...loginForm, email })
          }}
          onRegisterAnother={() => setShowSuccess(false)}
        />
      )
    }

    return (
      <AuthView
        authTab={authTab}
        onAuthTabChange={setAuthTab}
        loginForm={loginForm}
        onLoginFormChange={setLoginForm}
        onLogin={handleLogin}
        loginLoading={loginLoading}
        loginError={loginError}
        onLoginErrorChange={setLoginError}
        registerForm={registerForm}
        onRegisterFormChange={setRegisterForm}
        onRegister={handleRegister}
        registerLoading={registerLoading}
        registerError={registerError}
        onRegisterErrorChange={setRegisterError}
        onShowLanding={() => setShowLanding(true)}
      />
    )
  }

  // SUPER ADMIN VIEW
  if (view === "superadmin") {
    return (
      <SuperAdminDashboard
        sidebarOpen={sidebarOpen}
        onSidebarOpenChange={setSidebarOpen}
        onSignOut={() => signOut()}
      />
    )
  }

  // POS VIEW
  return (
    <POSView
      session={session}
      sidebarOpen={sidebarOpen}
      onSidebarOpenChange={setSidebarOpen}
      onSignOut={() => signOut()}
    />
  )
}

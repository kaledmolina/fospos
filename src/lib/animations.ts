import { Variants } from "framer-motion"

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20, pointerEvents: "none" },
  animate: { opacity: 1, y: 0, pointerEvents: "auto" },
  exit: { opacity: 0, y: -20, pointerEvents: "none" }
}

export const fadeIn: Variants = {
  initial: { opacity: 0, pointerEvents: "none" },
  animate: { opacity: 1, pointerEvents: "auto" },
  exit: { opacity: 0, pointerEvents: "none" }
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95, pointerEvents: "none" },
  animate: { opacity: 1, scale: 1, pointerEvents: "auto" },
  exit: { opacity: 0, scale: 0.95, pointerEvents: "none" }
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20, pointerEvents: "none" },
  animate: { opacity: 1, x: 0, pointerEvents: "auto" },
  exit: { opacity: 0, x: -20, pointerEvents: "none" }
}

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

export const cardHover = {
  rest: { scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  hover: { scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }
}

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
}

// Enhanced animation variants
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

export const floatAnimation: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
}

export const pulseAnimation: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
}

export const glowAnimation: Variants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(16, 185, 129, 0.3)",
      "0 0 40px rgba(16, 185, 129, 0.5)",
      "0 0 20px rgba(16, 185, 129, 0.3)"
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
}

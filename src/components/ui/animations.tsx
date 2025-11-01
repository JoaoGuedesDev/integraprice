'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Componente para números animados (contadores)
export const AnimatedCounter: React.FC<{
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}> = ({ value, duration = 2, prefix = '', suffix = '', className = '' }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      setCount(Math.floor(progress * value))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// Componente para texto digitado
export const TypewriterText: React.FC<{
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}> = ({ text, speed = 50, className = '', onComplete }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Componente para partículas flutuantes
export const FloatingParticles: React.FC<{
  count?: number
  className?: string
}> = ({ count = 20, className = '' }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }))

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-primary/20 to-secondary/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Componente para botão com efeito ripple
export const RippleButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}> = ({ children, onClick, className = '', disabled = false }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y
    }

    setRipples(prev => [...prev, newRipple])

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)

    onClick?.()
  }

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </button>
  )
}

// Componente para loading skeleton animado
export const LoadingSkeleton: React.FC<{
  className?: string
  lines?: number
}> = ({ className = '', lines = 3 }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-pulse"
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}

// Componente para transições de página
export const PageTransition: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

// Componente para hover com escala suave
export const HoverScale: React.FC<{
  children: React.ReactNode
  scale?: number
  className?: string
}> = ({ children, scale = 1.05, className = '' }) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

// Componente para revelar conteúdo ao scroll
export const ScrollReveal: React.FC<{
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}> = ({ children, direction = 'up', delay = 0, className = '' }) => {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    }
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Componente para progresso animado
export const AnimatedProgress: React.FC<{
  value: number
  max?: number
  className?: string
  showValue?: boolean
}> = ({ value, max = 100, className = '', showValue = true }) => {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        {showValue && (
          <span className="text-sm font-medium text-muted-foreground">
            <AnimatedCounter value={value} suffix={`/${max}`} />
          </span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
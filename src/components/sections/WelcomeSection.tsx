"use client"

import { motion } from "framer-motion"
import { SCROLL_THRESHOLDS } from "@/constants"

interface WelcomeSectionProps {
  scrollProgress: number
}

export function WelcomeSection({ scrollProgress }: WelcomeSectionProps) {
  const isVisible = scrollProgress <= SCROLL_THRESHOLDS.HIDE_WELCOME
  const opacity =
    scrollProgress > SCROLL_THRESHOLDS.HIDE_WELCOME ? 0 : 1 - scrollProgress / SCROLL_THRESHOLDS.HIDE_WELCOME
  const scale = scrollProgress > SCROLL_THRESHOLDS.HIDE_WELCOME ? 0.5 : 1 - scrollProgress / 800

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-10"
      animate={{ opacity, scale }}
      transition={{ duration: 0.1 }}
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-6xl md:text-9xl font-bold text-white mb-6"
        >
          WELCOME!
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-xl md:text-3xl text-neutral-300 font-light mb-8"
        >
          To My Digital Universe
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-neutral-400 animate-bounce-slow text-lg"
        >
          ↓ Scroll to explore ↓
        </motion.div>
      </div>
    </motion.div>
  )
}

"use client";

import type React from "react";
import { motion } from "framer-motion";

interface SplitLayoutProps {
  children: React.ReactNode;
}

export function SplitLayout({ children }: SplitLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Brand Section with Light-to-Dark Blue Gradient */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between text-white relative overflow-hidden"
      >
        {/* Gradient Background (light → dark blue) */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #93c5fd 0%, #3b82f6 50%, #1e3a8a 100%)",
          }}
        />

        {/* Animated Light Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.06) 0%, transparent 60%)",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "50% 50%", "0% 0%"],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3">
            <img
              className="w-48"
              src="https://framerusercontent.com/images/8BRir1J0nj1Sr0UQvMIH5u76nko.svg"
              alt="algohire.ai"
            />
          </div>
        </motion.div>

        {/* Headline + Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 space-y-6"
        >
          <h1 className="text-5xl font-bold leading-tight text-white drop-shadow-md">
            Smarter Hiring with AI
          </h1>
          <p className="text-xl text-blue-100/90 leading-relaxed">
            Streamline recruitment and automate candidate filtering with
            AlgoHire.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 flex items-center justify-between text-sm text-blue-100/80"
        >
          <p>© 2025 AlgoHire.ai Enterprises LTD.</p>
          <a href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
        </motion.div>
      </motion.div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

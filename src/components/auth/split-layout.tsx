"use client";

import type React from "react";
import { motion } from "framer-motion";

interface SplitLayoutProps {
  children: React.ReactNode;
}

export function SplitLayout({ children }: SplitLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Brand Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold">AlgoHire</span>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 space-y-6"
        >
          <h1 className="text-5xl font-bold leading-tight">
            Effortlessly manage your team and operations.
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Log in to access your CRM dashboard and manage your team.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 flex items-center justify-between text-sm text-blue-100"
        >
          <p>Copyright © 2025 AlgoHire Enterprises LTD.</p>
          <a href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
        </motion.div>
      </motion.div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-neutral-50">
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

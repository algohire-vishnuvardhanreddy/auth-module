"use client";

import { motion } from "framer-motion";
import { SplitLayout } from "@/components/auth/split-layout";
import { Button } from "@/components/ui/button";
import { MailCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function ForgotPasswordSuccessPage() {
  return (
    <SplitLayout>
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <MailCheck className="h-16 w-16 text-neutral-900" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-neutral-900/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-neutral-900">
              Check Your Email
            </h1>
            <p className="text-neutral-600">
              We've sent password reset instructions to your email
            </p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="text-center space-y-4">
            <p className="text-sm text-neutral-600">
              If an account exists with that email, you'll receive a password
              reset link shortly.
            </p>
            <p className="text-sm text-neutral-600">
              Didn't receive an email? Check your spam folder or try again.
            </p>
          </div>
          <Link to="/login">
            <Button className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-base transition-colors">
              <span className="flex items-center gap-2">
                Back to Login
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </Button>
          </Link>
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </div>
        </motion.div>
      </div>
    </SplitLayout>
  );
}

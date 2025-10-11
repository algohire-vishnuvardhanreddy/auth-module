"use client";

import { motion } from "framer-motion";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { Link } from "react-router";

export default function ForgotPasswordSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <AuthCard
          title="Check Your Email"
          description="We've sent password reset instructions to your email"
          icon={
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
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
                  <MailCheck className="h-16 w-16 text-primary" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
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
          }
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                If an account exists with that email, you'll receive a password
                reset link shortly.
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive an email? Check your spam folder or try again.
              </p>
            </div>

            <Link to="/login">
              <Button className="w-full group">
                <span className="flex items-center gap-2">
                  Back to Login
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              </Button>
            </Link>
          </motion.div>
        </AuthCard>
      </motion.div>
    </div>
  );
}

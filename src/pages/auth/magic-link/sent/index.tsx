"use client";

import { useSearchParams, Link } from "react-router";
import { motion } from "framer-motion";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Sparkles } from "lucide-react";

export default function MagicLinkSentPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const isSignup = searchParams.get("signup") === "true";

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <AuthCard
          title={isSignup ? "Check Your Email" : "Magic Link Sent"}
          description={
            isSignup
              ? "Complete your signup by clicking the link we sent"
              : "Click the link to sign in"
          }
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
                  <Mail className="h-16 w-16 text-primary" />
                </motion.div>
                <motion.div
                  className="absolute top-0 right-0"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="h-6 w-6 text-primary" />
                </motion.div>
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
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium">Email sent to:</p>
              <Badge variant="secondary" className="font-mono text-xs">
                {email}
              </Badge>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                We've sent a magic link to your email. Click the link to{" "}
                {isSignup ? "complete your signup" : "sign in"}.
              </p>
              <p className="text-xs text-muted-foreground">
                The link will expire in 15 minutes.
              </p>
            </div>

            <div className="space-y-2">
              <Link to="/login">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Login
                </Button>
              </Link>

              <p className="text-xs text-center text-muted-foreground">
                Didn't receive the email? Check your spam folder.
              </p>
            </div>
          </motion.div>
        </AuthCard>
      </motion.div>
    </div>
  );
}

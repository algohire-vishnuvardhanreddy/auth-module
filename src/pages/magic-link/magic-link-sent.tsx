import { SplitLayout } from "@/components/auth/split-layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router";

export default function MagicLinkSentPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <SplitLayout>
      <div className="space-y-8">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -top-1 -right-1 w-8 h-8 bg-white border-2 border-neutral-900 rounded-full flex items-center justify-center"
            >
              <Sparkles className="h-4 w-4 text-neutral-900" />
            </motion.div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 text-center"
        >
          <h1 className="text-3xl font-bold text-neutral-900">
            Check Your Email
          </h1>
          <p className="text-neutral-600 text-base">
            We've sent a magic link to
          </p>
          <p className="text-neutral-900 font-medium text-lg">{email}</p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-neutral-100 border border-neutral-200 rounded-lg p-5 space-y-3"
        >
          <h2 className="font-semibold text-neutral-900">What's next?</h2>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li className="flex items-start gap-2">
              <span className="text-neutral-900 font-bold mt-0.5">1.</span>
              <span>Open your email inbox and look for our message</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-900 font-bold mt-0.5">2.</span>
              <span>Click the magic link inside the email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-900 font-bold mt-0.5">3.</span>
              <span>You'll be automatically logged in</span>
            </li>
          </ul>
          <p className="text-xs text-neutral-500 pt-2 border-t border-neutral-200">
            The link will expire in 15 minutes for security.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Back to Login */}
          <Link to="/sign-up">
            <Button
              type="button"
              variant="ghost"
              className="w-full h-11 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-neutral-500"
        >
          Make sure to check your spam or junk folder if you don't see the email
          in your inbox.
        </motion.p>
      </div>
    </SplitLayout>
  );
}

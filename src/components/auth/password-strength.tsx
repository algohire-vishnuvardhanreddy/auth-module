"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
  confirmPassword?: string;
  showMatch?: boolean;
}

export function PasswordStrength({
  password,
  confirmPassword,
  showMatch = false,
}: PasswordStrengthProps) {
  const checks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", valid: /[a-z]/.test(password) },
    { label: "Contains number", valid: /\d/.test(password) },
  ];

  const validCount = checks.filter((c) => c.valid).length;
  const strength =
    validCount === 0
      ? 0
      : validCount <= 1
      ? 25
      : validCount === 2
      ? 50
      : validCount === 3
      ? 75
      : 100;

  const strengthColor =
    strength === 0
      ? "bg-neutral-300"
      : strength <= 25
      ? "bg-red-500"
      : strength <= 50
      ? "bg-orange-500"
      : strength <= 75
      ? "bg-yellow-500"
      : "bg-green-500";

  const strengthLabel =
    strength === 0
      ? ""
      : strength <= 25
      ? "Weak"
      : strength <= 50
      ? "Fair"
      : strength <= 75
      ? "Good"
      : "Strong";

  const passwordsMatch =
    showMatch && confirmPassword
      ? password === confirmPassword && password.length > 0
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-3"
    >
      {/* Strength Bar */}
      {password.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-600">Password Strength</span>
            <span
              className={`font-medium ${
                strength <= 25
                  ? "text-red-600"
                  : strength <= 50
                  ? "text-orange-600"
                  : strength <= 75
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {strengthLabel}
            </span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${strength}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full ${strengthColor} rounded-full`}
            />
          </div>
        </div>
      )}

      {/* Requirements */}
      {password.length > 0 && (
        <div className="space-y-1.5">
          {checks.map((check, index) => (
            <motion.div
              key={check.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 text-xs"
            >
              {check.valid ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <X className="h-3.5 w-3.5 text-neutral-400" />
              )}
              <span
                className={check.valid ? "text-green-600" : "text-neutral-500"}
              >
                {check.label}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Password Match Indicator */}
      {showMatch && confirmPassword && confirmPassword.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
            passwordsMatch
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {passwordsMatch ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <X className="h-3.5 w-3.5" />
          )}
          <span>
            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

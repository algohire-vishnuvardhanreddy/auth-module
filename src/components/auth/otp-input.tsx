"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  error,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [shake, setShake] = useState(false);

  const handleChange = (index: number, inputValue: string) => {
    // Only allow digits
    const digit = inputValue.replace(/\D/g, "").slice(-1);

    const newValue = value.split("");
    newValue[index] = digit;
    const updatedValue = newValue.join("");

    onChange(updatedValue);

    // Auto-tab to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all digits are filled
    if (updatedValue.length === length && onComplete) {
      onComplete(updatedValue);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    onChange(pastedData);

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    if (pastedData.length === length && onComplete) {
      onComplete(pastedData);
    }
  };

  // Trigger shake animation on error
  if (error && !shake) {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  return (
    <div className={cn("flex gap-2 justify-center", shake && "animate-shake")}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "h-12 w-12 rounded-lg border-2 text-center text-lg font-semibold transition-all",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            error
              ? "border-destructive bg-destructive/5"
              : "border-input bg-background",
            value[index] && "border-primary"
          )}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
}

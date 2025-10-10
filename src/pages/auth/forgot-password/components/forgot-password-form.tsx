import { type HTMLAttributes, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AnimatedButton from "@/components/ui/animated-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Mock API call to simulate password reset email
const mockSendPasswordResetEmail = async (email: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email) {
        resolve({ success: true });
      } else {
        reject(new Error("Invalid email"));
      }
    }, 1000);
  });
};

type ForgotFormProps = HTMLAttributes<HTMLDivElement>;

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
});

// Extracted button styles as a constant for reuse and clarity
const buttonClass = cn(
  "w-full",
  "bg-indigo-600 text-white hover:bg-indigo-700",
  "dark:bg-indigo-500 dark:hover:bg-indigo-600",
  "transition-colors duration-200",
  "rounded-md"
);

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await mockSendPasswordResetEmail(data.email);
      toast.success("An email will be sent if the account exists");
    } catch {
      toast.error(
        "If an account exists with this email, you will receive password reset instructions."
      );
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <AnimatedButton
            type="submit"
            icon={<Send size={16} />}
            disabled={isLoading}
            //@ts-ignore ignore
            className={buttonClass}
          >
            Send Reset Link
          </AnimatedButton>
        </form>
      </Form>
    </div>
  );
}

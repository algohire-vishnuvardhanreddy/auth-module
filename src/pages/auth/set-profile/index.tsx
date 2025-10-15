import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SplitLayout } from "@/components/auth/split-layout";
import { useAuth } from "@/context/auth-context";
import useGeoIpData from "@/hooks/use-geo-id";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { z } from "zod";
import { PageLoader } from "@/components/ui/page-loader";
import apiClient from "@/lib/apis";
import { useBrowserTimezone } from "@/hooks/use-browser-timezone";
import { usePortalStore } from "@/store/portal-store";
import { auth } from "@/services/firebase";

interface ProfileUpdateResponse {
  status: "success" | "error"; // you can expand this if there are other statuses
  message: string;
  data: {
    profile_completed: boolean;
    redirect_url: string;
  };
}

export default function SetProfilePage() {
  const geoIpData = useGeoIpData();
  const portal = usePortalStore((state) => state.portal);
  const { user, loading } = useAuth();

  const formSchema = z.object({
    first_name: z.string().min(1, "First name is required").max(30),
    last_name: z.string().min(1, "Last name is required").max(30),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine((value) => value && isValidPhoneNumber(value), {
        message: "Invalid phone number",
      }),
    country: z.string().min(1, "Country is required"),
    source: z.string().min(1, "Source is required"),
  });

  const { mutate: fnUserProfileSetup, isPending: isPendingUserProfile } =
    useMutation({
      mutationFn: (data: z.infer<typeof formSchema>) =>
        apiClient.post(
          "/auth/profile",
          { ...data, timezone },
          {
            params: {
              portal: portal,
            },
          }
        ),
      onSuccess: async (data: AxiosResponse<ProfileUpdateResponse>) => {
        auth.signOut();
        window.location.href = data.data.data.redirect_url;
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "An error occurred");
        }
      },
    });



  const timezone = useBrowserTimezone();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
      country: geoIpData?.country || "US",
      source: user?.source || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = { ...values };
    fnUserProfileSetup({ ...formData });
  }

  if (loading) return <PageLoader fullScreen />;

  return (
    <SplitLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">
            Complete Your Profile
          </h1>
          <p className="text-neutral-600">
            Thanks for joining Algohire! Let's get to know each other.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={form.handleSubmit(onSubmit)}
            className={`space-y-5 ${
              Object.keys(form.formState.errors).length > 0
                ? "animate-shake"
                : ""
            }`}
          >
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-neutral-900 font-medium">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John"
                        className={`h-12 bg-white border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900 ${
                          form.formState.errors.first_name
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-neutral-900 font-medium">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Doe"
                        className={`h-12 bg-white border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900 ${
                          form.formState.errors.last_name
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email Field (Disabled) */}
            <div className="space-y-2">
              <FormLabel className="text-neutral-900 font-medium">
                Email Address
              </FormLabel>
              <Input
                type="email"
                disabled
                value={user?.email}
                placeholder="joe@company.com"
                className="h-12 bg-white border-neutral-300 text-neutral-600"
              />
            </div>

            {/* Phone Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-neutral-900 font-medium">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      id="phone"
                      name="phone"
                      defaultCountry={geoIpData?.country || "US"}
                      placeholder="Phone number"
                      value={field.value}
                      onChange={(value) => {
                        form.setValue("phone", value, {
                          shouldValidate: true,
                        });
                        form.setValue("country", geoIpData?.country || "US");
                      }}
                      className={`h-12 bg-white border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900 ${
                        form.formState.errors.phone ? "border-red-500" : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Source Field */}
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-neutral-900 font-medium">
                    Where did you hear about us?
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`h-12 bg-white border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900 ${
                          form.formState.errors.source ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="google">
                        Google
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="friend">
                        Friend Referral
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="social">
                        Social Media
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="ad">
                        Advertisement
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="other">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPendingUserProfile}
              className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-base transition-colors"
            >
              {isPendingUserProfile ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </motion.form>
        </Form>
      </div>
    </SplitLayout>
  );
}

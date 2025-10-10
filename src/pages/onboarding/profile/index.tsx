import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { isValidPhoneNumber, type Country } from "react-phone-number-input";
import { toast } from "sonner";
import AnimatedButton from "@/components/ui/animated-button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageLoader } from "@/components/ui/page-loader";
import OnboardingLayout from "@/components/onboarding/onboarding-layout";
import { useAuth } from "@/context/auth-context";
import useGeoIpData from "@/hooks/use-geo-ip";

// Mock API call
const userProfileSetup = async (data: {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  source: string;
}) => {
  console.log("Submitting profile:", data);
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true }), 1000)
  );
};

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

export default function Index() {
  const geoIpData = useGeoIpData();
  const { user, loading, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      country: geoIpData?.country || "US",
      source: "",
    },
  });

  const handleProfileSetup = async (data: z.infer<typeof formSchema>) => {
    try {
      await userProfileSetup(data);
      await fetchUserProfile();
      navigate("/");
      // @ts-ignore dgkfjkdg
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    handleProfileSetup({ ...values });
  }

  useEffect(() => {
    if (user?.profile_completed) {
      navigate("/");
    }
  }, [user?.profile_completed, navigate]);

  if (loading) return <PageLoader fullScreen />;

  return (
    <OnboardingLayout>
      <div className="mt-0 flex items-center justify-center">
        <Card className="w-full max-w-lg border-0 bg-white p-6 dark:bg-transparent dark:shadow-2xl">
          <div className="mb-6 space-y-2 text-center">
            <p className="text-muted-foreground">Thanks for joining Algohire</p>
            <h1 className="max-w-md text-3xl font-bold">
              First, let's get to know each other
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label>First name</Label>
                      <FormControl>
                        <Input {...field} placeholder="John" className="h-12" />
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
                      <Label>Last name</Label>
                      <FormControl>
                        <Input {...field} placeholder="Doe" className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  placeholder="joe@company.com"
                  className="text-md h-12 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label>Phone Number</Label>
                    <FormControl>
                      <PhoneInput
                        id="phone"
                        name="phone"
                        defaultCountry={geoIpData?.country as Country}
                        placeholder="Phone number"
                        value={field.value}
                        onChange={(value) => {
                          form.setValue("phone", value || "", {
                            shouldValidate: true,
                          });
                          form.setValue("country", geoIpData?.country || "US");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label>Where did you hear about us? *</Label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
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

              <AnimatedButton
                disabled={false}
                type="submit"
                icon={<ArrowRight size={16} />}
              >
                Continue
              </AnimatedButton>
            </form>
          </Form>
        </Card>
      </div>
    </OnboardingLayout>
  );
}

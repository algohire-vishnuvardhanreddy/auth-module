import { createContext, useContext, useState } from "react";
import apiClient from "@/lib/apis";
import type { AxiosError } from "axios";
import { auth } from "@/services/firebase";

interface AuthContextType {
  user: {
    user_id: string;
    email: string;
    profile_completed: boolean;
    default_org: string | null;
  } | null;
  loading: boolean;
  fetchUserProfile: () => Promise<void>;
  signInWithProvider: () => Promise<{ success: boolean }>;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  loginWithToken?: (portal: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null); // Initialize as null (unauthenticated)
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    const response = await apiClient.get("/auth/profile");
    setUser(response.data.data);
    setLoading(false);
  };

  const signInWithProvider = async (): Promise<{ success: boolean }> => {
    try {
      await signInWithProvider();
      return { success: true };
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { success: false };
    }
  };

  async function loginWithToken(portal: string): Promise<{ error?: string }> {
    try {
      await apiClient.post(`/auth/token`, {
        portal,
      });
      await fetchUserProfile();
      return { error: undefined };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError?.response?.data?.message;
      setLoading(false);
      await auth.signOut();
      if (String(errorMessage).toLowerCase().includes("not found")) {
        return {
          error: `user is not registered! Please Signup.`,
        };
      } else {
        return {
          error:
            "Oops! Something went wrong on our end. Please try again later.",
        };
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await apiClient.post(`/auth/login`, {
        email,
        password,
      });
      await fetchUserProfile();
      return { success: true };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError?.response?.data?.message;
      setLoading(false);
      await auth.signOut();

      if (String(errorMessage).toLowerCase().includes("not found")) {
        // return {
        //   error: `user is not registered! Please Signup.`,
        // };
        return { success: false };
      } else {
        return { success: false };
        // return {
        //   error:
        //     "Oops! Something went wrong on our end. Please try again later.",
        // };
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        fetchUserProfile,
        signInWithProvider,
        login,
        loginWithToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

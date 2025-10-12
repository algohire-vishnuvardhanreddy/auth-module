import { createContext, useContext, useState } from "react";
import apiClient from "@/lib/apis";
import type { AxiosError } from "axios";
import { auth, provider } from "@/services/firebase";
import { toast } from "sonner";
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

type OauthGoogleApiResponse = {
  status: "success" | "error";
  data: {
    user_id: string;
    email: string;
    profile_completed: boolean;
    token: string;
    redirect_url: string;
    portal: string;
  };
};

type SignInSuccessResponse = {
  status: "success";
  data: {
    profile_completed: boolean;
    token: string;
    redirect_url: string | null;
  };
};

interface AuthContextType {
  user: {
    user_id: string;
    email: string;
    profile_completed: boolean;
    default_org: string | null;
  } | null;
  loading: boolean;
  fetchUserProfile: () => Promise<void>;
  signInWithProvider: (portal: string) => Promise<{
    success: boolean;
    profileCompleted?: boolean;
    redirectUrl?: string;
    portal?: string;
  }>;
  login: (
    email: string,
    password: string,
    portal: string
  ) => Promise<{ success: boolean }>;
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

  const signInWithProvider = async (
    portal: string
  ): Promise<{
    success: boolean;
    profileCompleted?: boolean;
    redirectUrl?: string;
    portal?: string;
  }> => {
    try {
      if (!provider) {
        toast.error("Provider not supported.");
        return { success: false };
      }
      const result = await signInWithPopup(auth, provider);
      const id_token = await result.user.getIdToken();
      const response = await apiClient.post<OauthGoogleApiResponse>(
        `/auth/sign-in/google-oauth`,
        {
          id_token,
          portal,
        }
      );
      const customToken = response.data.data.token;

      if (
        response.data.data.redirect_url &&
        response.data.data.profile_completed
      ) {
        window.location.href = response.data.data.redirect_url;
      }

      await signInWithCustomToken(auth, customToken);
      await fetchUserProfile();
      return {
        success: true,
        profileCompleted: response.data.data.profile_completed,
        redirectUrl: response.data.data.redirect_url,
        portal: response.data.data.portal,
      };
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { success: false };
    }
  };

  async function loginWithToken(portal: string): Promise<{ error?: string }> {
    try {
      await apiClient.post<SignInSuccessResponse>(`/auth/token`, {
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
          error: "Something went wrong",
        };
      }
    }
  }

  const login = async (email: string, password: string, portal: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      const uid = res.user.uid;
      const response = await apiClient.post<SignInSuccessResponse>(
        `/auth/token`,
        {
          uid,
          portal,
        }
      );

      if (
        response.data.data.redirect_url &&
        response.data.data.profile_completed
      ) {
        window.location.href = response.data.data.redirect_url;
      }

      if (!response.data.data.profile_completed) {
        await signInWithCustomToken(auth, response.data.data.token);
        await fetchUserProfile();
      }

      return {
        success: true,
        profileCompleted: response.data.data.profile_completed,
        redirectUrl: response.data.data.redirect_url,
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError?.response?.data?.message;
      setLoading(false);
      await auth.signOut();

      if (String(errorMessage).toLowerCase().includes("not found")) {
        return { success: false };
      } else {
        return { success: false };
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

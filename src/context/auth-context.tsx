import apiClient from "@/lib/apis";
import { auth, provider } from "@/services/firebase";
import type { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface CurrentUser {
  first_name: string | null;
  last_name: string | null;
  email: string;
  is_email_verified: boolean;
  updated_at: Timestamp;
  created_at: Timestamp;
  user_id: string;
  default_org: string | null;
  profile_completed: boolean;
  provider_id: string;
  source: string;
  phone: string | null;
}

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
  user: CurrentUser | null;
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
  ) => Promise<{ success: boolean } | { success: boolean; error: string }>;
  loginWithToken?: (portal: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null); // Initialize as null (unauthenticated)
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginWithTokenCallback = useCallback(loginWithToken, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);

      if (user) {
        await loginWithTokenCallback("recruiter", user.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [loginWithTokenCallback]);

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
      navigate("/sign-up/set-profile");
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

  async function loginWithToken(
    portal: string,
    uid?: string
  ): Promise<{ error?: string }> {
    try {
      await apiClient.post<SignInSuccessResponse>(`/auth/token`, {
        portal,
        uid,
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
        navigate("/sign-up/set-profile");
      }

      return {
        success: true,
        profileCompleted: response.data.data.profile_completed,
        redirectUrl: response.data.data.redirect_url,
      };
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const errorMessages = {
          "auth/invalid-credential": "Invalid credentials!",
          "auth/user-not-found": "User not registered! Please Signup.",
          "auth/wrong-password": "Wrong password!",
          "auth/too-many-requests": "Too many requests!",
        };
        const errorMessage =
          errorMessages[error.code as keyof typeof errorMessages];
        if (errorMessage) {
          setLoading(false);
          await auth.signOut();
          return { success: false, error: errorMessage };
        }
      }
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Something went wrong. Please try again.";

      setLoading(false);
      await auth.signOut();
      return { success: false, error: errorMessage };
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

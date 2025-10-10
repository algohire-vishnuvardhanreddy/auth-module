import { createContext, useContext, useState } from "react";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null); // Initialize as null (unauthenticated)
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    // Mock fetching user profile
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const signInWithProvider = async (): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({
          user_id: "123",
          email: "joe@company.com",
          profile_completed: false,
          default_org: null,
        });
        resolve({ success: true });
      }, 1000);
    });
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean }> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "joe@company.com" && password === "password123") {
          setUser({
            user_id: "123",
            email,
            profile_completed: false,
            default_org: null,
          });
          resolve({ success: true });
        } else {
          reject(new Error("Invalid credentials"));
        }
        setLoading(false);
      }, 1000);
    });
  };

  return (
    // <AuthContext.Provider value={{ user, loading, fetchUserProfile, signInWithProvider, login }}>
    <AuthContext.Provider
      value={{ user, loading, fetchUserProfile, signInWithProvider, login }}
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

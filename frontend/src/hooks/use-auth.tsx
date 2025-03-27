import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api-client.ts";
import { SignInFormValues, SignUpFormValues } from "@/schemas/authForms.tsx";
import { useLocation, useNavigate } from "react-router";
import { User } from "@/types";
import { AxiosError } from "axios";
import { refresh } from "@/lib/utils.ts";
import { useAuthStore } from "@/store/auth.ts";

const useAuthProvider = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isRefreshing = useRef(false);
  const setStoreToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes("/auth")) {
      console.log("refreshing");
      refreshToken();
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (token) me().then((user) => setUser(user));
    setIsLoading(false);
  }, [token]);

  const signUp = async (data: SignUpFormValues) => {
    return await api.auth.signUp(data);
  };

  const signIn = async (data: SignInFormValues) => {
    const response = await api.auth.signIn(data);
    await refreshToken();
    return response;
  };

  const signOut = async () => {
    setToken(null);
    await api.auth.signOut();
    refresh();
  };

  const me = async () => {
    return await api.auth.me();
  };

  const refreshToken = async () => {
    if (isRefreshing.current) return; // Prevent multiple calls
    isRefreshing.current = true;
    setIsLoading(true);
    try {
      const { data } = await api.auth.refreshToken();

      setToken(data.accessToken);
      setStoreToken(data.accessToken);
      setIsAuthenticated(true);
    } catch (err) {
      if (err instanceof AxiosError && !location.pathname.includes("auth")) {
        if (err.status === 401) {
          if (location.pathname === "/auth/signin") return;
          await signOut();
          return navigate("/auth/signin");
        }
      }
    } finally {
      isRefreshing.current = false;
      setIsCheckingAuth(false);
      setIsLoading(false);
    }
  };

  return {
    user,
    isCheckingAuth,
    isLoading,
    token,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    refreshToken,
    me,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const AuthContext = createContext<ReturnType<typeof useAuthProvider> | null>(
  null,
);

export const useAuth = () => useContext(AuthContext)!;

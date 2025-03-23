import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api-client.ts";
import { SignInFormValues, SignUpFormValues } from "@/schemas/authForms.tsx";
import { useLocation, useNavigate } from "react-router";
import { User } from "@/types";
import { AxiosError } from "axios";
import { refresh } from "@/lib/utils.ts";

const useAuthProvider = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
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
    await api.auth.signOut();
    refresh();
  };

  const me = async () => {
    return await api.auth.me(token!);
  };

  const refreshToken = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.auth.refreshToken();

      setToken(data.accessToken);
      setIsAuthenticated(true);
    } catch (err) {
      if (err instanceof AxiosError && !location.pathname.includes("auth")) {
        if (err.status === 401) {
          await signOut();
          return navigate("/auth/signin");
        }
      }
    } finally {
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

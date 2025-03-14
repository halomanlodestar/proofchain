import { createContext, useContext, useState } from "react";
import { api } from "@/lib/api-client.ts";
import { SignInFormValues, SignUpFormValues } from "@/schemas/authForms.tsx";
import { useNavigate } from "react-router";

const useAuthProvider = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  const signUp = async (data: SignUpFormValues) => {
    return await api.auth.signUp(data);
  };

  const signIn = async (data: SignInFormValues) => {
    const response = await api.auth.signIn(data);
    await refreshToken();
    return response;
  };

  const signOut = async () => {
    return await api.auth.signOut();
  };

  const refreshToken = async () => {
    setIsLoading(true);
    const { data, status } = await api.auth.refreshToken();

    if (status === 401) {
      await signOut();
      return navigate("/auth/signin");
    }

    setIsAuthenticated(true);
    setToken(data.accessToken);
    setIsCheckingAuth(false);
    setIsLoading(false);
  };

  const me = async () => {
    return await api.auth.me();
  };

  return {
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

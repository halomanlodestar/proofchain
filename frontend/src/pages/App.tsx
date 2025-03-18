import { AuthProvider } from "@/hooks/use-auth.tsx";
import Navbar from "@/components/Navbar/Navbar.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Landing } from "@/pages/Landing.tsx";
import AuthLayout from "@/pages/auth/AuthLayout.tsx";
import SignInForm from "@/pages/auth/SignInForm.tsx";
import SignUpForm from "@/pages/auth/SignUpForm.tsx";
import ProtectedRoutes from "@/components/ProtectedRoutes.tsx";
import Transactions from "@/pages/transactions";
import NewTransaction from "@/pages/transactions/NewTransaction.tsx";
import Dashboard from "@/pages/dashboard/Dashboard.tsx";
import NotFound from "@/pages/NotFound.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Routes>
            <Route path={"/"} index element={<Landing />} />

            {/* Auth */}
            <Route path={"auth"} element={<AuthLayout />}>
              <Route path={"signin"} element={<SignInForm />} />
              <Route path={"signup"} element={<SignUpForm />} />
            </Route>

            {/* ProtectedRoutes */}
            <Route element={<ProtectedRoutes />}>
              <Route path={"/transactions"} element={<Transactions />} />
              <Route path={"/transactions/new"} element={<NewTransaction />} />
              <Route path={"dashboard"} element={<Dashboard />} />
            </Route>

            {/* Not Found */}
            <Route path={"*"} element={<NotFound />} />
          </Routes>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "@/components/Navbar/Navbar.tsx";
import AuthLayout from "@/pages/auth/AuthLayout.tsx";
import SignInForm from "@/pages/auth/SignInForm.tsx";
import SignUpForm from "@/pages/auth/SignUpForm.tsx";
import NotFound from "@/pages/NotFound.tsx";
import { AuthProvider } from "@/hooks/use-auth.tsx";
import ProtectedRoutes from "@/components/ProtectedRoutes.tsx";
import Transactions from "@/pages/transactions";
import { Landing } from "@/pages/Landing.tsx";
import NewTransaction from "@/pages/transactions/NewTransaction.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
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
            <Route path={"/transactions"} element={<Transactions />}>
              <Route path={"/transactions/new"} element={<NewTransaction />} />
            </Route>
            <Route path={"/dashboard"} element={<Dashboard />} />
          </Route>

          {/* Not Found */}
          <Route path={"*"} element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

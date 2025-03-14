import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/dashboard/Home.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "@/components/Navbar.tsx";
import AuthLayout from "@/pages/auth/AuthLayout.tsx";
import SignInForm from "@/pages/auth/SignInForm.tsx";
import SignUpForm from "@/pages/auth/SignUpForm.tsx";
import NotFound from "@/pages/NotFound.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path={"/"} index element={<Home />} />

        {/* Auth */}
        <Route path={"auth"} element={<AuthLayout />}>
          <Route path={"signin"} element={<SignInForm />} />
          <Route path={"signup"} element={<SignUpForm />} />
        </Route>

        {/* Not Found */}
        <Route path={"*"} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

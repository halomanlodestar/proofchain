import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./Home.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "@/components/Navbar.tsx";
import AuthLayout from "@/components/auth/AuthLayout.tsx";
import SignInForm from "@/components/auth/SignInForm.tsx";
import SignUpForm from "@/components/auth/SignUpForm.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"auth"} element={<AuthLayout />}>
          <Route path={"signin"} element={<SignInForm />} />
          <Route path={"signup"} element={<SignUpForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

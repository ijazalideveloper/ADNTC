"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import useAuth from "@/lib/hooks/useAuth";
import { LoginCredentials } from "@/lib/types";

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, loading, error } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Handle login form submission
  const handleLogin = async (credentials: LoginCredentials) => {
    await login(credentials);
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} isLoading={loading} error={error} />
    </div>
  );
};

export default LoginPage;

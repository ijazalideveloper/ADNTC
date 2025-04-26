"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import useAuth from "@/lib/hooks/useAuth";
import { LoginCredentials } from "@/lib/types";

export default function LoginPage() {
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
    const success = await login(credentials);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} isLoading={loading} error={error} />
    </div>
  );
}

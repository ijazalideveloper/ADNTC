"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/auth/SignupForm";
import useAuth from "@/lib/hooks/useAuth";
import { SignupCredentials } from "@/lib/types";

export default function SignupPage() {
  const { signup, isAuthenticated, loading, error } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Handle signup form submission
  const handleSignup = async (credentials: SignupCredentials) => {
    const success = await signup(credentials);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div>
      <SignupForm onSubmit={handleSignup} isLoading={loading} error={error} />
    </div>
  );
}

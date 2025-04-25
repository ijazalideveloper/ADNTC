"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/auth/SignupForm";
import useAuth from "@/lib/hooks/useAuth";
import { SignupCredentials } from "@/lib/types";

const SignupPage: React.FC = () => {
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
    await signup(credentials);
  };

  return (
    <div>
      <SignupForm onSubmit={handleSignup} isLoading={loading} error={error} />
    </div>
  );
};

export default SignupPage;

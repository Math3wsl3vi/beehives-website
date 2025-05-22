"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./Loader";

export default function ProtectedCartRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // You might want to store the current URL to redirect back after login
      router.push(`/login?redirect=${encodeURIComponent('/cart')}`);
    }
  }, [user, loading, router]);

  if (loading) return <div className="text-center text-gray-500 mt-20"><Loader/></div>;
  if (!user) return null;

  return <>{children}</>;
}
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./Loader";
import { useToast } from "@/hooks/use-toast";

export default function ProtectedCartRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Login Required",
        description: "Please login to access your shopping cart",
        variant: "default",
      });
      router.push(`/login?redirect=${encodeURIComponent('/cart')}`);
    }
  }, [user, loading, router, toast]);

  if (loading) return <div className="text-center text-gray-500 mt-20"><Loader/></div>;
  if (!user) return null;

  return <>{children}</>;
}
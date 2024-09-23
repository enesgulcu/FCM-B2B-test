"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useEmployeeRedirect(allowAccess = false) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Session yüklenene kadar bekle

    if (session?.user?.role === "employee" && !allowAccess) {
      router.push("/customer-orders-admin");
    }
  }, [session, status, router, allowAccess]);

  return { session, status };
}

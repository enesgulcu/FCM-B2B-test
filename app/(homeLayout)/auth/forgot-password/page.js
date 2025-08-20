"use client";

import dynamic from "next/dynamic";

const ResetPassword = dynamic(() => import("@/components/ResetPassword"), {
  ssr: false, // ⛔ SSR devre dışı!
});

export default function ResetPage() {
  return (
    <div>
      <ResetPassword />
    </div>
  );
}

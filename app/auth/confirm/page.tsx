"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase-client";

export default function ConfirmPage() {
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        window.location.href = "/auth/update-password";
      } else if (event === "SIGNED_IN") {
        window.location.href = "/";
      }
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center">
      <p className="text-zinc-400">Yönlendiriliyor...</p>
    </main>
  );
}

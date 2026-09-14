import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useApp } from "@/lib/store";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, hydrated } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/login" });
  }, [user, hydrated, navigate]);

  if (!hydrated || !user) return null;
  return <>{children}</>;
}

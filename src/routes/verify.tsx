import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthInput, AuthShell } from "@/components/AuthShell";
import { Button, Field } from "@/components/kit";
import { useApp } from "@/lib/store";

type Search = { email?: string };

export const Route = createFileRoute("/verify")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    email: typeof s.email === "string" ? s.email : "",
  }),
  head: () => ({ meta: [{ title: "Verify · SellMyAuto" }] }),
  component: VerifyScreen,
});

function VerifyScreen() {
  const { email } = Route.useSearch();
  const { completeVerification, pushToast } = useApp();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 280));
    completeVerification(email || "alex@sellmyauto.com");
    setLoading(false);
    pushToast("Verified", "Choose a plan to list your car.");
    navigate({ to: "/plans" });
  }

  return (
    <AuthShell
      title="Check your inbox"
      subtitle={`Enter the 6-digit code sent to ${email || "your email"}.`}
    >
      <form onSubmit={onSubmit}>
        <Field label="Verification code" tone="dark">
          <AuthInput
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />
        </Field>
        <Button type="submit" full loading={loading} className="mt-2">
          Verify & Continue
        </Button>
      </form>
    </AuthShell>
  );
}

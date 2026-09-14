import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthInput, AuthShell, PasswordField, SocialAuth } from "@/components/AuthShell";
import { Button, Field } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in · SellMyAuto" }] }),
  component: LoginScreen,
});

function LoginScreen() {
  const { login, socialLogin } = useApp();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function goHome() {
    navigate({ to: "/home" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 280));
    login(identifier, password);
    setLoading(false);
    goHome();
  }

  function onSocial(provider: "google" | "apple") {
    socialLogin(provider);
    goHome();
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your listings and offers.">
      <form onSubmit={onSubmit}>
        <Field label="Email or phone" tone="dark">
          <AuthInput
            value={identifier}
            autoComplete="username"
            placeholder="you@email.com"
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </Field>
        <PasswordField
          label="Password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="mb-6 text-right">
          <Link to="/forgot-password" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-[#7EB6FF]">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" full loading={loading}>
          Log In
        </Button>
      </form>
      <SocialAuth onContinue={onSocial} />
      <p className="mt-6 text-center text-[15px] leading-relaxed text-white/60">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold text-[#7EB6FF]">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}

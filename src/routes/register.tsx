import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthInput, AuthShell, PasswordField } from "@/components/AuthShell";
import { Button, Field } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account · SellMyAuto" }] }),
  component: RegisterScreen,
});

function RegisterScreen() {
  const { register, pushToast } = useApp();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 280));
    const result = register({ fullName, email, phone, password: password || confirm });
    setLoading(false);
    pushToast("Account created", "Verify to continue.");
    navigate({ to: "/verify", search: { email: result.email } });
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Buy and sell vehicles directly — no dealer in the middle."
    >
      <form onSubmit={onSubmit}>
        <Field label="Full name" tone="dark">
          <AuthInput value={fullName} autoComplete="name" placeholder="Alex Rivera" onChange={(e) => setFullName(e.target.value)} />
        </Field>
        <Field label="Email" tone="dark">
          <AuthInput type="email" value={email} autoComplete="email" placeholder="you@email.com" onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Phone" tone="dark">
          <AuthInput
            type="tel"
            value={phone}
            autoComplete="tel"
            placeholder="(555) 201-8844"
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
        <PasswordField
          label="Password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordField
          label="Confirm password"
          value={confirm}
          autoComplete="new-password"
          onChange={(e) => setConfirm(e.target.value)}
        />
        <label className="mb-6 flex min-h-12 items-start gap-3 text-[15px] leading-snug text-white/75">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 rounded-none accent-primary"
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" className="font-semibold text-[#7EB6FF]">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-semibold text-[#7EB6FF]">
              Privacy Policy
            </Link>
          </span>
        </label>
        <Button type="submit" full loading={loading}>
          Create Account
        </Button>
      </form>
      <p className="mt-6 text-center text-[15px] leading-relaxed text-white/60">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#7EB6FF]">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

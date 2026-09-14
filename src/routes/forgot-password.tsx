import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthInput, AuthShell, PasswordField } from "@/components/AuthShell";
import { Button, Field } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password · SellMyAuto" }] }),
  component: ForgotPasswordScreen,
});

function ForgotPasswordScreen() {
  const { pushToast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Enter the email or phone on your account.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    setError("");
    setStep(2);
    pushToast("Code sent", "Use 123456 for this demo.");
  }

  async function checkOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.trim() !== "123456") {
      setError("Invalid code. Try 123456.");
      return;
    }
    setError("");
    setStep(3);
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    pushToast("Password updated", "You can log in with your new password.");
    navigate({ to: "/login" });
  }

  return (
    <AuthShell
      title={step === 1 ? "Forgot Password" : step === 2 ? "Enter the code" : "Set a new password"}
      subtitle={
        step === 1
          ? "We’ll text or email a one-time code. This flow is stubbed until the reset API lands."
          : step === 2
            ? `Code sent to ${identifier}`
            : "Choose a password you haven’t used here before."
      }
    >
      {step === 1 && (
        <form onSubmit={sendCode}>
          <Field label="Email or Phone" tone="dark">
            <AuthInput value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          </Field>
          {error && <p className="mb-3 text-sm text-primary">{error}</p>}
          <Button type="submit" full loading={loading}>
            Send Code
          </Button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={checkOtp}>
          <Field label="One-time code" tone="dark">
            <AuthInput
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </Field>
          {error && <p className="mb-3 text-sm text-primary">{error}</p>}
          <Button type="submit" full>
            Verify Code
          </Button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={reset}>
          <PasswordField label="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <PasswordField label="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {error && <p className="mb-3 text-sm text-primary">{error}</p>}
          <Button type="submit" full loading={loading}>
            Update Password
          </Button>
        </form>
      )}
    </AuthShell>
  );
}

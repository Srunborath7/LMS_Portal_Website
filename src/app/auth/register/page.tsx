"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Public_Sans } from "next/font/google";

const font = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const perks = [
  {
    title: "Learn at your own pace",
    text: "Pick up any lesson on any device, and your progress follows you.",
  },
  {
    title: "Submit and track assignments",
    text: "See deadlines, feedback and grades without chasing emails.",
  },
  {
    title: "Earn certificates",
    text: "Finish a course and download proof of completion.",
  },
];

type Role = "student" | "instructor";

function scorePassword(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p) || p.length >= 14) s++;
  return s; // 0–4
}

const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"];
const strengthColor = [
  "bg-slate-300",
  "bg-red-500",
  "bg-[#F2B134]",
  "bg-emerald-500",
  "bg-emerald-600",
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => scorePassword(password), [password]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) return setError("Enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setError("Enter a valid email address.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    if (!agree)
      return setError("Accept the terms and privacy policy to continue.");

    setLoading(true);
    try {
      // TODO: replace with your real sign-up call, e.g. fetch("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, role, password }) })
      await new Promise((r) => setTimeout(r, 900));
      window.location.href = "/dashboard";
    } catch {
      setError("We couldn't create your account. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1E2A5A] focus:ring-4 focus:ring-[#1E2A5A]/15";
  const label = "text-sm font-medium text-slate-700";

  return (
    <main
      className={`${font.className} grid min-h-screen bg-white lg:grid-cols-[1.05fr_1fr]`}
    >
      {/* Brand panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-[#1E2A5A] p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#F2B134] text-[#1E2A5A]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M2 8l10-5 10 5-10 5L2 8z" />
              <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">Learnly</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Start learning in minutes.
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-white/70">
            Create a free account to join courses, hand in work and track your
            progress.
          </p>

          <ul className="mt-10 space-y-6">
            {perks.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#F2B134] text-[#1E2A5A]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-white/65">
                    {p.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Learnly. All rights reserved.
        </p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#1E2A5A] text-[#F2B134]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M2 8l10-5 10 5-10 5L2 8z" />
                <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-[#1E2A5A]">
              Learnly
            </span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-1.5 text-[15px] text-slate-500">
            It takes less than a minute.
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <fieldset>
              <legend className={label}>I am a</legend>
              <div className="mt-1.5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
                {(["student", "instructor"] as Role[]).map((r) => (
                  <label
                    key={r}
                    className={`cursor-pointer rounded-md px-3 py-2 text-center text-sm font-medium capitalize transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#1E2A5A]/20 ${
                      role === r
                        ? "bg-white text-[#1E2A5A] shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={role === r}
                      onChange={() => setRole(r)}
                      className="sr-only"
                    />
                    {r}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="name" className={label}>
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Sokha Chan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={input}
              />
            </div>

            <div>
              <label htmlFor="email" className={label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={input}
              />
            </div>

            <div>
              <label htmlFor="password" className={label}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${input} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-pressed={show}
                  className="absolute right-2 top-[calc(0.375rem+0.25rem)] rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A5A]/30"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>

              {password && (
                <div className="mt-2.5" aria-live="polite">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-colors ${i <= score ? strengthColor[score] : "bg-slate-200"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Strength: {strengthLabel[score]}. Use upper and lower case,
                    a number and a symbol.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirm" className={label}>
                Confirm password
              </label>
              <input
                id="confirm"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={input}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-slate-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#1E2A5A]"
              />
              <span>
                I agree to the{" "}
                <a
                  href="/terms"
                  className="font-medium text-[#1E2A5A] hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="font-medium text-[#1E2A5A] hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E2A5A] px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-[#16204a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1E2A5A]/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && (
                <svg
                  className="h-4 w-4 animate-spin motion-reduce:animate-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeOpacity=".3"
                    strokeWidth="3"
                  />
                  <path
                    d="M21 12a9 9 0 00-9-9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {loading ? "Creating account" : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="font-semibold text-[#1E2A5A] hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

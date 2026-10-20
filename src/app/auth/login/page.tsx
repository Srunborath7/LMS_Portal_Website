"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Public_Sans } from "next/font/google";

const font = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const courses = [
  { title: "Data Analysis with Python", done: 72 },
  { title: "Project Management Essentials", done: 45 },
  { title: "Business Writing", done: 18 },
];

export default function LoginPage() {
  const [year, setYear] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with your auth call, e.g. signIn("credentials", {...}) or fetch("/api/auth/login")
      await new Promise((r) => setTimeout(r, 900));
      window.location.href = "/dashboard";
    } catch {
      setError(
        "Email or password is incorrect. Try again or reset your password.",
      );
    } finally {
      setLoading(false);
    }
  }

  const input =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1E2A5A] focus:ring-4 focus:ring-[#1E2A5A]/15";

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
            Pick up where you left off.
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-white/70">
            Your courses, assignments and grades are waiting in one place.
          </p>

          <div className="mt-10 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
            <p className="text-sm font-medium text-white/60">In progress</p>
            <ul className="mt-4 space-y-5">
              {courses.map((c) => (
                <li key={c.title}>
                  <div className="flex items-baseline justify-between text-[15px]">
                    <span className="font-medium">{c.title}</span>
                    <span className="tabular-nums text-white/60">
                      {c.done}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#F2B134]"
                      style={{ width: `${c.done}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-sm text-white/50">
          © {year ?? ""} Learnly. All rights reserved.
        </p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[400px]">
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
            Sign in
          </h2>
          <p className="mt-1.5 text-[15px] text-slate-500">
            Use your school or work account.
          </p>

          <button
            type="button"
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-[15px] font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1E2A5A]/15"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path
                fill="#EA4335"
                d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"
              />
              <path
                fill="#FBBC05"
                d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.2C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.2z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.2C6.5 42.6 14.6 48 24 48z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4 text-sm text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or use email
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-[#1E2A5A] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
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
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-[#1E2A5A]"
              />
              Keep me signed in on this device
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
              {loading ? "Signing in" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            New to Learnly?{" "}
            <a
              href="/auth/register"
              className="font-semibold text-[#1E2A5A] hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/components/Auth";

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const switchToLogin = () => {
    setIsLogin(true);
    setRegErrors([]);
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setLoginError(null);
  };

  // login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // register state
  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regErrors, setRegErrors] = useState<string[]>([]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginLoading) return;
    setLoginError(null);
    setLoginLoading(true);

    try {
      await login(loginEmail, loginPassword);
      router.push("/");
    } catch (err: unknown) {
      if (typeof err === "string") {
        setLoginError(err);
      } else if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError("Invalid email or password");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regLoading) return;
    setRegErrors([]);
    setRegLoading(true);

    try {
      await register(regEmail, regPassword, regName);
      await login(regEmail, regPassword);
      router.push("/");
    } catch (err: unknown) {
      if (Array.isArray(err) && err.every((e) => typeof e === "string")) {
        setRegErrors(err as string[]);
      } else if (err instanceof Error) {
        setRegErrors([err.message]);
      } else {
        setRegErrors(["An unexpected error occurred"]);
      }
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="h-dvh w-full overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between h-full bg-bg2 border-r border-white/[0.07] p-12">
        {/* Logo */}
        <div className="font-display text-2xl font-bold tracking-tight text-ink">
          Aktie<span className="text-accent">Koll</span>
        </div>

        {/* Feature list */}
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink leading-tight mb-3">
              Track insider trading.<br />Stay ahead.
            </h2>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              Monitor insider transactions as they happen and gain an edge with
              real-time market intelligence.
            </p>
          </div>

          <div className="space-y-5">
            {[
              {
                title: "Real-time Insider Trades",
                desc: "Monitor insider transactions as they happen",
              },
              {
                title: "Detailed Analytics",
                desc: "Comprehensive charts and data-driven insights",
              },
              {
                title: "Company Profiles",
                desc: "Deep dive into individual stock performance",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-dim">
                  <svg
                    className="h-3 w-3 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-faint">
          Swedish insider data &mdash; updated continuously
        </p>
      </div>

      {/* Right: Auth Forms */}
      <div className="flex flex-col justify-center bg-bg p-8 lg:p-12 h-full overflow-y-auto dark-scrollbar">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <span className="font-display text-2xl font-bold tracking-tight text-ink">
              Aktie<span className="text-accent">Koll</span>
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-white/[0.07]">
            <button
              onClick={switchToLogin}
              className={`pb-3 px-3 font-display text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors relative cursor-pointer ${
                isLogin
                  ? "text-ink border-b-2 border-accent"
                  : "text-faint hover:text-muted"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={switchToRegister}
              className={`pb-3 px-3 font-display text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors relative cursor-pointer ${
                !isLogin
                  ? "text-ink border-b-2 border-accent"
                  : "text-faint hover:text-muted"
              }`}
            >
              Create Account
            </button>
          </div>

          {isLogin ? (
            /* Login Form */
            <div className="fade-up">
              <h2 className="font-display text-2xl font-bold text-ink mb-1">
                Welcome back
              </h2>
              <p className="text-muted text-sm mb-7">
                Sign in to continue to your dashboard
              </p>

              <form onSubmit={onLogin} className="space-y-4">
                <div>
                  <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                    placeholder="••••••••"
                  />
                </div>

                {loginError && (
                  <div className="bg-sell-dim border border-sell/20 text-sell px-4 py-3 rounded-xl text-sm">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full mt-2 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg font-display text-[13px] font-bold uppercase tracking-[0.06em] py-3 rounded-xl transition-colors cursor-pointer"
                >
                  {loginLoading ? "Signing in…" : "Sign in"}
                </button>

                <div className="text-center pt-1">
                  <a href="#" className="text-xs text-faint hover:text-muted transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </form>
            </div>
          ) : (
            /* Register Form */
            <div className="fade-up">
              <h2 className="font-display text-2xl font-bold text-ink mb-1">
                Create account
              </h2>
              <p className="text-muted text-sm mb-7">
                Start tracking insider trades today
              </p>

              <form onSubmit={onRegister} className="space-y-4">
                <div>
                  <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Display name{" "}
                    <span className="normal-case tracking-normal font-normal text-faint">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-muted mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/[0.07] bg-bg2 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition text-sm"
                    placeholder="••••••••"
                  />
                </div>

                {regErrors.length > 0 && (
                  <div className="bg-sell-dim border border-sell/20 text-sell px-4 py-3 rounded-xl text-sm space-y-1">
                    {regErrors.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full mt-2 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg font-display text-[13px] font-bold uppercase tracking-[0.06em] py-3 rounded-xl transition-colors cursor-pointer"
                >
                  {regLoading ? "Creating account…" : "Create account"}
                </button>

                <p className="text-xs text-faint text-center pt-1">
                  By creating an account you agree to our{" "}
                  <a href="#" className="text-muted hover:text-ink transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-muted hover:text-ink transition-colors">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

// pages/auth.tsx
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/components/Auth"; // adjust path if needed

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();

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
  const [regError, setRegError] = useState<string | null>(null);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      router.push("/"); // redirect after login
    } catch (err: any) {
      setLoginError(err?.message ?? "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegLoading(true);
    try {
      await register(regEmail, regPassword, regName);
      // optional: auto-login or go to login page
      router.push("/login");
    } catch (err: any) {
      setRegError(err?.message ?? "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign in / Register — AktieKoll</title>
      </Head>

      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Left: Login */}
        <div className="flex flex-col justify-center items-start bg-gradient-to-b from-[#0f1724] to-[#071324] p-10 text-white">
          <div className="max-w-md w-full">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-300 mb-6">Sign in to continue to your dashboard</p>

            <form onSubmit={onLogin} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-[#0b1220] border border-[#1f2937] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-[#0b1220] border border-[#1f2937] focus:outline-none"
                />
              </div>

              {loginError && <div className="text-red-400 text-sm">{loginError}</div>}

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="bg-green-500 hover:bg-green-600 transition text-white px-5 py-2 rounded-md font-semibold"
                >
                  {loginLoading ? "Signing in…" : "Sign in"}
                </button>
                <a href="/forgot" className="text-sm text-gray-300 hover:underline">Forgot password?</a>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Register */}
        <div className="flex flex-col justify-center items-start bg-white p-10">
          <div className="max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-2">Create account</h2>
            <p className="text-gray-600 mb-6">Start tracking insiders and get tailored insights.</p>

            <form onSubmit={onRegister} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Display name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none"
                  placeholder="How people will see you (optional)"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none"
                />
              </div>

              {regError && <div className="text-red-600 text-sm">{regError}</div>}

              <div className="mt-2">
                <button
                  type="submit"
                  disabled={regLoading}
                  className="border border-gray-300 px-5 py-2 rounded-md font-semibold hover:bg-gray-50"
                >
                  {regLoading ? "Creating…" : "Create account"}
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-400 mt-6">
              By creating an account you agree to our terms and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

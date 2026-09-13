"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export default function SignIn() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/marketplace");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/marketplace");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-6 py-14 text-[#171717]">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-gray-500">
            THRIFTMATCH / BUYERS
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            {isSignUp ? "Create account." : "Welcome back."}
          </h1>

          <p className="mt-4 text-gray-600">
            {isSignUp
              ? "Sign up to start discovering fashion and building your style."
              : "Sign in to discover fashion, save your favourites and build your personal style."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-4xl border border-black/10 bg-white p-8 shadow-sm"
          >
            {error && (
              <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-black/15 bg-[#f5f1e8] px-5 py-4 outline-none placeholder:text-gray-400 focus:border-[#171717]"
              />
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-black/15 bg-[#f5f1e8] px-5 py-4 outline-none placeholder:text-gray-400 focus:border-[#171717]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-full bg-[#171717] px-5 py-4 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-black/15 bg-white px-5 py-4 text-sm font-semibold text-[#171717] transition hover:bg-[#f5f1e8]"
            >
              <span aria-hidden="true">G</span>
              Continue with Google
            </button>

            <div className="mt-8 text-center text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp((prev) => !prev)}
                className="font-semibold text-[#171717] underline underline-offset-2"
              >
                {isSignUp ? "Sign in" : "Create one"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

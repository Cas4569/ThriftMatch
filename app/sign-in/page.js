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

  const [isSignUp, setIsSignUp] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /*
   * Small client-side cooldown.
   *
   * IMPORTANT:
   * This is NOT the real security protection.
   * Firebase Authentication itself provides
   * the actual abuse/throttling protection.
   */
  const [cooldown, setCooldown] =
    useState(false);

  function startCooldown() {
    setCooldown(true);

    setTimeout(() => {
      setCooldown(false);
    }, 2000);
  }

  /*
   * -------------------------------------------------------
   * ROUTE USER AFTER AUTHENTICATION
   * -------------------------------------------------------
   *
   * Approved sellers should go to:
   *
   * /seller/dashboard
   *
   * Everyone else goes to:
   *
   * /marketplace
   *
   * The seller check is done through our protected
   * server API route. We do NOT trust client-side
   * Firestore status checks here.
   */
  async function routeAfterAuthentication() {
    const user =
      auth.currentUser;

    if (!user) {
      router.push(
        "/marketplace"
      );

      return;
    }

    try {
      /*
       * Get the Firebase ID token for the
       * currently signed-in user.
       */
      const token =
        await user.getIdToken();

      /*
       * Ask our server whether this email belongs
       * to an approved seller.
       */
      const response =
        await fetch(
          "/api/seller/me",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      /*
       * Approved seller.
       */
      if (response.ok) {
        router.push(
          "/seller/dashboard"
        );

        return;
      }

      /*
       * Not an approved seller.
       *
       * This includes normal buyers,
       * pending sellers and rejected sellers.
       */
    } catch (routeError) {
      /*
       * Do not prevent normal users from entering
       * the marketplace if the seller check fails.
       */
      console.error(
        "SELLER REDIRECT CHECK ERROR:",
        routeError
      );
    }

    router.push(
      "/marketplace"
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      loading ||
      cooldown
    ) {
      return;
    }

    setError("");
    setLoading(true);
    startCooldown();

    try {
      const cleanEmail =
        email.trim();

      if (!cleanEmail) {
        throw new Error(
          "Please enter your email address."
        );
      }

      if (!password) {
        throw new Error(
          "Please enter your password."
        );
      }

      if (isSignUp) {
        /*
         * Create Firebase account.
         */
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );
      } else {
        /*
         * Existing Firebase account.
         */
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );
      }

      /*
       * Successful authentication.
       *
       * Approved sellers go to the seller dashboard.
       * Everyone else goes to the marketplace.
       */
      await routeAfterAuthentication();
    } catch (err) {
      console.error(
        "Authentication error:",
        err
      );

      /*
       * Firebase may throttle excessive
       * authentication activity.
       */
      if (
        err?.code ===
          "auth/too-many-requests" ||
        String(
          err?.message || ""
        )
          .toLowerCase()
          .includes(
            "too many requests"
          ) ||
        String(
          err?.message || ""
        )
          .toLowerCase()
          .includes(
            "too many attempts"
          )
      ) {
        setError(
          "Too many attempts right now. Please wait a little and try again."
        );
      }

      /*
       * Invalid credentials.
       *
       * This is intentionally generic because
       * email enumeration protection may be enabled.
       */
      else if (
        err?.code ===
        "auth/invalid-credential"
      ) {
        setError(
          "The email or password is incorrect."
        );
      }

      else if (
        err?.code ===
        "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );
      }

      else if (
        err?.code ===
        "auth/email-already-in-use"
      ) {
        setError(
          "An account with this email already exists. Try signing in instead."
        );
      }

      else if (
        err?.code ===
        "auth/weak-password"
      ) {
        setError(
          "Your password is too weak. Please choose a stronger password."
        );
      }

      else if (
        err?.code ===
        "auth/operation-not-allowed"
      ) {
        setError(
          "This sign-in method is currently disabled."
        );
      }

      else {
        setError(
          err?.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (
      loading ||
      cooldown
    ) {
      return;
    }

    setError("");
    setLoading(true);
    startCooldown();

    try {
      const provider =
        new GoogleAuthProvider();

      await signInWithPopup(
        auth,
        provider
      );

      /*
       * Same routing logic as normal
       * email/password authentication.
       */
      await routeAfterAuthentication();
    } catch (err) {
      console.error(
        "Google authentication error:",
        err
      );

      if (
        err?.code ===
          "auth/popup-closed-by-user" ||
        err?.code ===
          "auth/cancelled-popup-request"
      ) {
        setError(
          "The Google sign-in window was closed."
        );
      }

      else if (
        err?.code ===
        "auth/popup-blocked"
      ) {
        setError(
          "Your browser blocked the Google sign-in popup. Please allow popups for this site and try again."
        );
      }

      else if (
        err?.code ===
        "auth/too-many-requests"
      ) {
        setError(
          "Too many authentication attempts. Please wait a little and try again."
        );
      }

      else {
        setError(
          err?.message ||
            "Google sign-in failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setError("");

    setIsSignUp(
      (previous) =>
        !previous
    );
  }

  return (
    <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full">

          {/* Header */}
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#9A6051]">
            THRIFTMATCH / BUYERS
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            {isSignUp
              ? "Create account."
              : "Welcome back."}
          </h1>

          <p className="mt-4 text-[#a9958f]">
            {isSignUp
              ? "Sign up to start discovering fashion and building your style."
              : "Sign in to discover fashion, save your favourites and build your personal style."}
          </p>

          {/* Form */}
          <form
            onSubmit={
              handleSubmit
            }
            className="mt-10 rounded-4xl border border-[#3b2925] bg-[#211512] p-8 shadow-sm"
          >

            {/* Error */}
            {error && (
              <p className="mb-4 rounded-xl bg-[#2a1715] px-4 py-3 text-sm text-[#c98f82]">
                {error}
              </p>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email Address
              </label>

              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter your email"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

            {/* Password */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <input
                type="password"
                required
                autoComplete={
                  isSignUp
                    ? "new-password"
                    : "current-password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

            {/* Email/password button */}
            <button
              type="submit"
              disabled={
                loading ||
                cooldown
              }
              className="mt-8 w-full rounded-full bg-[#9A6051] px-5 py-4 text-sm font-semibold text-[#120b09] transition hover:bg-[#ad7060] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Please wait..."
                : isSignUp
                ? "Create account"
                : "Sign in"}
            </button>

            {/* Google */}
            <button
              type="button"
              onClick={
                handleGoogleSignIn
              }
              disabled={
                loading ||
                cooldown
              }
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-[#624038] bg-[#120b09] px-5 py-4 text-sm font-semibold text-[#f3e9e5] transition hover:bg-[#2a1915] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span
                aria-hidden="true"
                className="font-bold"
              >
                G
              </span>

              {loading
                ? "Please wait..."
                : "Continue with Google"}
            </button>

            {/* Mode toggle */}
            <div className="mt-8 text-center text-sm text-[#a9958f]">
              {isSignUp
                ? "Already have an account?"
                : "Need an account?"}{" "}

              <button
                type="button"
                onClick={
                  toggleMode
                }
                disabled={
                  loading
                }
                className="font-semibold text-[#9A6051] underline underline-offset-2 disabled:opacity-50"
              >
                {isSignUp
                  ? "Sign in"
                  : "Create one"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}

"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function SellerGuard({
  children,
}) {
  const router =
    useRouter();

  const [checking, setChecking] =
    useState(true);

  const [allowed, setAllowed] =
    useState(false);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          if (!user) {
            router.replace(
              "/sign-in"
            );
            return;
          }

          try {
            const token =
              await user.getIdToken();

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

            if (!response.ok) {
              router.replace(
                "/Sellers"
              );
              return;
            }

            setAllowed(true);
          } catch (error) {
            console.error(
              "SELLER ACCESS ERROR:",
              error
            );

            router.replace(
              "/Sellers"
            );
          } finally {
            setChecking(false);
          }
        }
      );

    return () =>
      unsubscribe();
  }, [router]);

  if (checking || !allowed) {
    return (
      <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
        <div className="mx-auto max-w-4xl">
          <p className="text-[#a9958f]">
            Checking seller access...
          </p>
        </div>
      </main>
    );
  }

  return children;
}
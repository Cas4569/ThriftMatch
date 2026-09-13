"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="flex items-center justify-between px-8 py-6">
      <a href="/" className="text-2xl font-bold tracking-tight">
        ThriftMatch
      </a>

      <div className="hidden items-center gap-8 text-sm font-medium md:flex">
        <a href="/discover" className="hover:opacity-60 transition">
          Discover
        </a>

        <a href="/Sellers" className="hover:opacity-60 transition">
          For Sellers
        </a>

        {checking ? null : user ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171717] text-sm font-bold text-white">
              {user.email?.[0]?.toUpperCase()}
            </div>
            <button
              onClick={() => signOut(auth)}
              className="text-sm font-medium hover:opacity-60"
            >
              Sign out
            </button>
          </div>
        ) : (
          <a
            href="/sign-in"
            className="rounded-full bg-[#171717] px-5 py-2.5 text-white hover:scale-105 transition"
          >
            Sign In
          </a>
        )}
      </div>
    </nav>
  );
}
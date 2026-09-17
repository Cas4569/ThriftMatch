"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { subscribeToCart } from "@/lib/cart";

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    /*
     * Do NOT subscribe to auth/cart on the homepage.
     * The homepage has its own header.
     */
    if (pathname === "/") {
      setUser(null);
      setCartCount(0);
      return;
    }

    let unsubscribeCart = null;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          if (!currentUser) {
            setUser(null);
            setCartCount(0);

            if (unsubscribeCart) {
              unsubscribeCart();
              unsubscribeCart = null;
            }

            return;
          }

          setUser(currentUser);

          if (unsubscribeCart) {
            unsubscribeCart();
          }

          unsubscribeCart =
            subscribeToCart(
              currentUser.uid,

              (cart) => {
                setCartCount(
                  cart.length
                );
              },

              (error) => {
                console.error(
                  "NAVBAR CART ERROR:",
                  error
                );

                setCartCount(0);
              }
            );
        }
      );

    return () => {
      unsubscribeAuth();

      if (unsubscribeCart) {
        unsubscribeCart();
      }
    };
  }, [pathname]);

  /*
   * The homepage already has its own custom header.
   */
  if (pathname === "/") {
    return null;
  }

  return (
    <header className="relative z-50 flex items-center justify-between bg-[#f7f3eb] px-8 py-4 text-[#171512]">

      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3"
      >
        <img
          src="/logo2.png"
          alt="ThriftMatch"
          className="h-12 w-12 object-contain"
        />

        <span className="text-2xl font-black">
          ThriftMatch
        </span>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-7">

        <Link
          href="/Discover"
          className="text-sm font-semibold transition hover:opacity-60"
        >
          Discover
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative flex items-center"
          aria-label={`Cart with ${cartCount} items`}
        >
          <img
            src="/cart.png"
            alt="Cart"
            className="h-7 w-7 object-contain"
          />

          {cartCount > 0 && (
            <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c6a15b] px-1 text-[10px] font-black text-[#171512]">
              {cartCount}
            </span>
          )}
        </Link>

        {/* User */}
        {user ? (
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171512] text-sm font-black text-white">
              {user.email?.[0]?.toUpperCase() ||
                "H"}
            </div>

            <button
              type="button"
              onClick={() =>
                signOut(auth)
              }
              className="text-sm font-semibold transition hover:opacity-60"
            >
              Sign out
            </button>

          </div>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-full bg-[#171512] px-6 py-3 text-sm font-bold text-white transition hover:opacity-80"
          >
            Sign In
          </Link>
        )}

      </div>

    </header>
  );
}
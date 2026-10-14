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
    <header className="relative z-50 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-[#f7f3eb] px-4 py-3 text-[#171512] sm:flex-nowrap sm:px-8 sm:py-4">

      {/* Logo */}
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2 sm:gap-3"
      >
        <img
          src="/logo2.png"
          alt="ThriftMatch"
          className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
        />

        <span className="whitespace-nowrap text-xl font-black sm:text-2xl">
          ThriftMatch
        </span>
      </Link>

      {/* Navigation */}
      <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-7">

        <Link
          href="/Discover"
          className="whitespace-nowrap text-xs font-semibold transition hover:opacity-60 sm:text-sm"
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
            className="h-6 w-6 object-contain sm:h-7 sm:w-7"
          />

          {cartCount > 0 && (
            <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c6a15b] px-1 text-[10px] font-black text-[#171512]">
              {cartCount}
            </span>
          )}
        </Link>

        {/* User */}
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171512] text-xs font-black text-white sm:h-10 sm:w-10 sm:text-sm">
              {user.email?.[0]?.toUpperCase() ||
                "H"}
            </div>

            <button
              type="button"
              onClick={() =>
                signOut(auth)
              }
              className="whitespace-nowrap text-xs font-semibold transition hover:opacity-60 sm:text-sm"
            >
              Sign out
            </button>

          </div>
        ) : (
          <Link
            href="/sign-in"
            className="whitespace-nowrap rounded-full bg-[#171512] px-4 py-2 text-xs font-bold text-white transition hover:opacity-80 sm:px-6 sm:py-3 sm:text-sm"
          >
            Sign In
          </Link>
        )}

      </div>

    </header>
  );
}
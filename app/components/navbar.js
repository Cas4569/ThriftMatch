"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const cartStorageKey = "thriftmatch-cart";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const isHomePage = pathname === "/";
  const isMarketplacePage =
    pathname === "/marketplace" ||
    pathname.startsWith("/marketplace/") ||
    pathname === "/stylist" ||
    pathname.startsWith("/stylist/") ||
    pathname === "/Discover" ||
    pathname.startsWith("/Discover/") ||
    pathname === "/cart";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function updateCartCount() {
      const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
      const cart = savedCart.filter(
        (item, index, items) => item?.id && items.findIndex((entry) => entry.id === item.id) === index,
      );
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
      setCartCount(cart.length);
    }

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("thriftmatch-cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("thriftmatch-cart-updated", updateCartCount);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between bg-[#f5f1e8] px-8 py-6 text-[#171717]">
      <a href="/" className="flex items-center gap-3 text-2xl font-bold tracking-tight">
        <img
          src="/logo.jpeg"
          alt="ThriftMatch logo"
          className="h-15 w-15 object-contain"
        />
        <span>ThriftMatch</span>
      </a>

      <div className="hidden items-center gap-8 text-sm font-medium md:flex">
        {!checking && user && isMarketplacePage && (
          <>
            <a href="/Discover" className="transition hover:opacity-60">
              Discover
            </a>

            <a
              href="/cart"
              aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`}
              title="Cart"
              className="relative transition hover:opacity-60"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c6a15b] px-1 text-[10px] font-bold text-[#171717]">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </a>
          </>
        )}

        {isHomePage && (
          <a href="/Sellers" className="transition hover:opacity-60">
            For Sellers
          </a>
        )}

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
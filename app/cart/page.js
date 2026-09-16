"use client";

import { useSyncExternalStore } from "react";

const cartStorageKey = "thriftmatch-cart";
let lastCartValue = "";
let cartSnapshot = [];
const emptyCartSnapshot = [];

function getCart() {
  const storedCart = localStorage.getItem(cartStorageKey) || "[]";
  if (storedCart !== lastCartValue) {
    lastCartValue = storedCart;
    const parsedCart = JSON.parse(storedCart);
    cartSnapshot = Array.isArray(parsedCart)
      ? parsedCart.filter(
          (item, index, items) => item?.id && items.findIndex((entry) => entry.id === item.id) === index,
        )
      : [];
  }
  return cartSnapshot;
}

function subscribeToCart(onChange) {
  window.addEventListener("storage", onChange);
  window.addEventListener("thriftmatch-cart-updated", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("thriftmatch-cart-updated", onChange);
  };
}

export default function CartPage() {
  const cart = useSyncExternalStore(subscribeToCart, getCart, () => emptyCartSnapshot);

  function removeItem(id) {
    const nextCart = cart.filter((item) => item.id !== id);
    localStorage.setItem(cartStorageKey, JSON.stringify(nextCart));
    window.dispatchEvent(new Event("thriftmatch-cart-updated"));
  }

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
          THRIFTMATCH / CART
        </p>
        <h1 className="text-5xl font-black tracking-tight">Your cart.</h1>

        {cart.length === 0 ? (
          <p className="mt-10 text-lg text-[#b9b2a7]">Your cart is empty.</p>
        ) : (
          <div className="mt-10 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-5 rounded-2xl border border-[#3b3832] bg-[#24221e] p-4"
              >
                <img src={item.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold">{item.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-sm font-bold text-[#d19a9a] underline underline-offset-4"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-[#c6a15b] px-6 py-4 text-sm font-bold text-[#171512]"
            >
              Continue to checkout
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

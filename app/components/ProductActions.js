"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductActions({ product }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  function saveToCart() {
    const existingCart = JSON.parse(localStorage.getItem("thriftmatch-cart") || "[]");
    const existingItem = existingCart.find((item) => item.id === product.id);
    const cart = existingItem
      ? existingCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...existingCart, { ...product, quantity: 1 }];

    localStorage.setItem("thriftmatch-cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("thriftmatch-cart-updated"));
    return cart;
  }

  function handleAddToCart() {
    saveToCart();
    setMessage("Added to cart.");
  }

  function handleBuyNow() {
    router.push(`/marketplace/buy-now?productId=${product.id}`);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 rounded-full border border-[#c6a15b] px-6 py-4 text-sm font-bold text-[#c6a15b] transition hover:bg-[#c6a15b] hover:text-[#171512]"
        >
          Add to cart
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 rounded-full bg-[#c6a15b] px-6 py-4 text-sm font-bold text-[#171512] transition hover:bg-[#e0bd75]"
        >
          Buy now
        </button>
      </div>
      {message && <p className="mt-4 text-sm font-semibold text-[#c6a15b]">{message}</p>}
    </div>
  );
}

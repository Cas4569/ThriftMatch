"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";
import { addCartItem } from "@/lib/cart";

export default function ProductActions({ product }) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    setMessage("");

    const user = auth.currentUser;

    /*
     * Cart is now tied to the Firebase user's account.
     */
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!product?.id) {
      setMessage("This product is unavailable.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Only the product ID is stored in:
       *
       * carts/{user.uid}/items/{product.id}
       *
       * The actual name, image, price, etc.
       * come directly from Firestore products.
       */
      await addCartItem(
        user.uid,
        product.id
      );

      setMessage("Added to cart.");
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      setMessage(
        error?.message ||
          "Couldn't add this item to your cart."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleBuyNow() {
    if (!product?.id) {
      return;
    }

    router.push(
      `/marketplace/buy-now?productId=${encodeURIComponent(
        product.id
      )}`
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">

        {/* Add to cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading}
          className="flex-1 rounded-full border border-[#c6a15b] px-6 py-4 text-sm font-bold text-[#c6a15b] transition hover:bg-[#c6a15b] hover:text-[#171512] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Adding..."
            : "Add to cart"}
        </button>

        {/* Buy now */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={loading}
          className="flex-1 rounded-full bg-[#c6a15b] px-6 py-4 text-sm font-bold text-[#171512] transition hover:bg-[#e0bd75] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Buy now
        </button>

      </div>

      {message && (
        <p className="mt-4 text-sm font-semibold text-[#c6a15b]">
          {message}
        </p>
      )}
    </div>
  );
}
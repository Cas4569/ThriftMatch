"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const PLATFORM_FEE = 10;

function getNumericPrice(price) {
  const numericPrice = Number(
    String(price || "").replace(/[^0-9.]/g, "")
  );

  return Number.isFinite(numericPrice)
    ? numericPrice
    : 0;
}

export default function BuyNowPage() {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentMode, setPaymentMode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /*
   * ------------------------------------------------
   * READ PRODUCT ID FROM THE BROWSER URL
   * ------------------------------------------------
   *
   * We intentionally do NOT use useSearchParams().
   *
   * Example:
   *
   * /marketplace/buy-now?productId=ABC123
   *
   * becomes:
   *
   * productId = "ABC123"
   *
   * This keeps the page safe during Next.js
   * production prerendering on Vercel.
   */

  useEffect(() => {
    try {
      const params = new URLSearchParams(
        window.location.search
      );

      const id = params.get("productId");

      if (!id) {
        setError("No product was selected.");
        setLoading(false);
        return;
      }

      setProductId(id);
    } catch (error) {
      console.error(
        "URL PARAMETER ERROR:",
        error
      );

      setError(
        "We couldn't read the selected product."
      );

      setLoading(false);
    }
  }, []);

  /*
   * ------------------------------------------------
   * LOAD PRODUCT FROM FIRESTORE
   * ------------------------------------------------
   */

  useEffect(() => {
    if (!productId) {
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const productRef = doc(
          db,
          "products",
          productId
        );

        const productSnapshot =
          await getDoc(productRef);

        if (cancelled) {
          return;
        }

        if (!productSnapshot.exists()) {
          setError(
            "This product is no longer available."
          );

          setProduct(null);
          return;
        }

        setProduct({
          id: productSnapshot.id,
          ...productSnapshot.data(),
        });
      } catch (loadError) {
        console.error(
          "BUY NOW PRODUCT ERROR:",
          loadError
        );

        if (!cancelled) {
          setError(
            "We couldn't load this product right now."
          );

          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  /*
   * ------------------------------------------------
   * SUBMIT ORDER
   * ------------------------------------------------
   */

  function handleSubmit(event) {
    event.preventDefault();

    if (!paymentMode) {
      return;
    }

    setSubmitted(true);
  }

  /*
   * ------------------------------------------------
   * LOADING STATE
   * ------------------------------------------------
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">

        <div className="mx-auto max-w-5xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
            THRIFTMATCH / CHECKOUT
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Complete your order.
          </h1>

          <div className="mt-10 rounded-2xl border border-[#3b3832] bg-[#24221e] p-8">

            <div className="flex items-center gap-3 text-[#b9b2a7]">

              <span className="h-2 w-2 animate-pulse rounded-full bg-[#c6a15b]" />

              Loading product details...

            </div>

          </div>

        </div>

      </main>
    );
  }

  /*
   * ------------------------------------------------
   * ERROR STATE
   * ------------------------------------------------
   */

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">

        <div className="mx-auto max-w-5xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
            THRIFTMATCH / CHECKOUT
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Complete your order.
          </h1>

          <div className="mt-10 rounded-2xl border border-red-900/50 bg-red-950/20 p-8">

            <p className="text-lg text-red-300">
              {error ||
                "This product could not be found."}
            </p>

          </div>

        </div>

      </main>
    );
  }

  /*
   * ------------------------------------------------
   * PRICE
   * ------------------------------------------------
   */

  const mrp = getNumericPrice(
    product.price
  );

  const total =
    mrp + PLATFORM_FEE;

  /*
   * ------------------------------------------------
   * ORDER RECEIVED
   * ------------------------------------------------
   */

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">

        <div className="mx-auto max-w-5xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
            THRIFTMATCH / CHECKOUT
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Order received.
          </h1>

          <div className="mt-10 rounded-2xl border border-[#c6a15b]/40 bg-[#24221e] p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              <img
                src={product.image}
                alt={product.name}
                className="h-28 w-28 rounded-xl object-cover"
              />

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c6a15b]">
                  ORDER CONFIRMED
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {product.name}
                </h2>

                <p className="mt-2 text-[#b9b2a7]">
                  Payment mode:{" "}
                  <span className="font-semibold text-[#f5f0e8]">
                    {paymentMode}
                  </span>
                </p>

                <p className="mt-2 text-lg font-bold text-[#c6a15b]">
                  Total: ₹{total}
                </p>

              </div>

            </div>

          </div>

        </div>

      </main>
    );
  }

  /*
   * ------------------------------------------------
   * CHECKOUT PAGE
   * ------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">

      <div className="mx-auto max-w-5xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
          THRIFTMATCH / CHECKOUT
        </p>

        <h1 className="text-5xl font-black tracking-tight">
          Complete your order.
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
        >

          {/* DELIVERY ADDRESS */}

          <section className="rounded-2xl border border-[#3b3832] bg-[#24221e] p-6">

            <h2 className="text-2xl font-black">
              Delivery address
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <input
                required
                name="name"
                placeholder="Full name"
                autoComplete="name"
                className="rounded-xl border border-[#5a5348] bg-[#171512] px-4 py-3 text-[#f5f0e8] outline-none placeholder:text-[#777168] focus:border-[#c6a15b]"
              />

              <input
                required
                name="phone"
                type="tel"
                placeholder="Phone number"
                autoComplete="tel"
                className="rounded-xl border border-[#5a5348] bg-[#171512] px-4 py-3 text-[#f5f0e8] outline-none placeholder:text-[#777168] focus:border-[#c6a15b]"
              />

              <input
                required
                name="address"
                placeholder="House / street address"
                autoComplete="street-address"
                className="rounded-xl border border-[#5a5348] bg-[#171512] px-4 py-3 text-[#f5f0e8] outline-none placeholder:text-[#777168] focus:border-[#c6a15b] sm:col-span-2"
              />

              <input
                required
                name="city"
                placeholder="City"
                autoComplete="address-level2"
                className="rounded-xl border border-[#5a5348] bg-[#171512] px-4 py-3 text-[#f5f0e8] outline-none placeholder:text-[#777168] focus:border-[#c6a15b]"
              />

              <input
                required
                name="postalCode"
                inputMode="numeric"
                placeholder="Postal code"
                autoComplete="postal-code"
                className="rounded-xl border border-[#5a5348] bg-[#171512] px-4 py-3 text-[#f5f0e8] outline-none placeholder:text-[#777168] focus:border-[#c6a15b]"
              />

            </div>

            {/* PAYMENT */}

            <h2 className="mt-10 text-2xl font-black">
              Payment mode
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">

              {[
                "UPI",
                "Card",
                "Cash on delivery",
              ].map((mode) => (
                <label
                  key={mode}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    paymentMode === mode
                      ? "border-[#c6a15b] bg-[#2b271f]"
                      : "border-[#5a5348] bg-[#171512]"
                  }`}
                >

                  <input
                    required
                    type="radio"
                    name="paymentMode"
                    value={mode}
                    checked={
                      paymentMode ===
                      mode
                    }
                    onChange={(event) =>
                      setPaymentMode(
                        event.target.value
                      )
                    }
                  />

                  <span className="text-sm font-semibold">
                    {mode}
                  </span>

                </label>
              ))}

            </div>

          </section>

          {/* ORDER SUMMARY */}

          <aside className="h-fit rounded-2xl border border-[#3b3832] bg-[#24221e] p-6">

            <h2 className="text-2xl font-black">
              Order summary
            </h2>

            <div className="mt-6 flex gap-4 border-b border-[#3b3832] pb-6">

              <img
                src={product.image}
                alt={product.name}
                className="h-20 w-20 rounded-xl object-cover"
              />

              <div className="min-w-0">

                <p className="font-bold">
                  {product.name}
                </p>

                <p className="mt-1 text-sm text-[#aaa399]">
                  {product.subcategory ||
                    product.category ||
                    "Fashion"}
                </p>

                <p className="mt-2 font-semibold text-[#c6a15b]">
                  ₹{mrp}
                </p>

              </div>

            </div>

            {/* PRICE */}

            <div className="mt-6 space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-[#aaa399]">
                  MRP
                </span>

                <span>
                  ₹{mrp}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#aaa399]">
                  Platform fee
                </span>

                <span>
                  ₹{PLATFORM_FEE}
                </span>
              </div>

              <div className="flex justify-between border-t border-[#3b3832] pt-4 text-lg font-bold">

                <span>
                  Total amount
                </span>

                <span className="text-[#c6a15b]">
                  ₹{total}
                </span>

              </div>

            </div>

            <button
              type="submit"
              disabled={!paymentMode}
              className="mt-8 w-full rounded-full bg-[#c6a15b] px-6 py-4 text-sm font-bold text-[#171512] transition hover:bg-[#e0bd75] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Place order
            </button>

          </aside>

        </form>

      </div>

    </main>
  );
}
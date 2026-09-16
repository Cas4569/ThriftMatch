"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const PLATFORM_FEE = 10;

function getNumericPrice(price) {
  const numericPrice = Number(String(price || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericPrice) ? numericPrice : 0;
}

export default function BuyNowPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setError("No product was selected.");
        setLoading(false);
        return;
      }

      try {
        const productSnapshot = await getDoc(doc(db, "products", productId));
        if (!productSnapshot.exists()) {
          setError("This product is no longer available.");
        } else {
          setProduct({ id: productSnapshot.id, ...productSnapshot.data() });
        }
      } catch {
        setError("We couldn't load this product right now.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (loading) {
    return <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]"><p>Loading checkout...</p></main>;
  }

  if (error || !product) {
    return <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]"><p>{error}</p></main>;
  }

  const mrp = getNumericPrice(product.price);
  const total = mrp + PLATFORM_FEE;

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">THRIFTMATCH / CHECKOUT</p>
        <h1 className="text-5xl font-black tracking-tight">Complete your order.</h1>

        {submitted ? (
          <div className="mt-10 rounded-2xl border border-[#c6a15b]/40 bg-[#24221e] p-8">
            <h2 className="text-2xl font-black">Order details received.</h2>
            <p className="mt-3 text-[#b9b2a7]">Your selected payment mode is {paymentMode}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-2xl border border-[#3b3832] bg-[#24221e] p-6">
              <h2 className="text-2xl font-black">Delivery address</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input required name="name" placeholder="Full name" className="rounded-xl border border-[#5a5348] bg-[#171512] px-4 py-3 outline-none focus:border-[#c6a15b]" />
                <input required name="phone" type="tel" placeholder="Phone number" className="rounded-xl border border-[#5a5348] bg-[#171512] px-4 py-3 outline-none focus:border-[#c6a15b]" />
                <input required name="address" placeholder="House / street address" className="rounded-xl border border-[#5a5348] bg-[#171512] px-4 py-3 outline-none focus:border-[#c6a15b] sm:col-span-2" />
                <input required name="city" placeholder="City" className="rounded-xl border border-[#5a5348] bg-[#171512] px-4 py-3 outline-none focus:border-[#c6a15b]" />
                <input required name="postalCode" inputMode="numeric" placeholder="Postal code" className="rounded-xl border border-[#5a5348] bg-[#171512] px-4 py-3 outline-none focus:border-[#c6a15b]" />
              </div>

              <h2 className="mt-10 text-2xl font-black">Payment mode</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["UPI", "Card", "Cash on delivery"].map((mode) => (
                  <label key={mode} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#5a5348] bg-[#171512] p-4">
                    <input required type="radio" name="paymentMode" value={mode} checked={paymentMode === mode} onChange={(event) => setPaymentMode(event.target.value)} />
                    <span className="text-sm font-semibold">{mode}</span>
                  </label>
                ))}
              </div>
            </section>

            <aside className="h-fit rounded-2xl border border-[#3b3832] bg-[#24221e] p-6">
              <h2 className="text-2xl font-black">Order summary</h2>
              <div className="mt-6 flex gap-4 border-b border-[#3b3832] pb-6">
                <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover" />
                <div className="min-w-0">
                  <p className="font-bold">{product.name}</p>
                  <p className="mt-1 text-sm text-[#aaa399]">{product.subcategory || product.category || "Fashion"}</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[#aaa399]">MRP</span><span>₹{mrp}</span></div>
                <div className="flex justify-between"><span className="text-[#aaa399]">Platform fee</span><span>₹{PLATFORM_FEE}</span></div>
                <div className="flex justify-between border-t border-[#3b3832] pt-4 text-lg font-bold"><span>Total amount</span><span className="text-[#c6a15b]">₹{total}</span></div>
              </div>
              <button type="submit" className="mt-8 w-full rounded-full bg-[#c6a15b] px-6 py-4 text-sm font-bold text-[#171512] transition hover:bg-[#e0bd75]">Place order</button>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}

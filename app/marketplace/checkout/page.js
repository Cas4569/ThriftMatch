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

import {
  subscribeToCart,
} from "@/lib/cart";

const PLATFORM_FEE = 10;

function getNumericPrice(price) {
  const numericPrice = Number(
    String(price || "").replace(
      /[^0-9.]/g,
      ""
    )
  );

  return Number.isFinite(numericPrice)
    ? numericPrice
    : 0;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);

  const [paymentMode, setPaymentMode] =
    useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] =
    useState(false);

  const [orderId, setOrderId] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    let unsubscribeCart = null;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          /*
           * User signed out.
           */
          if (!currentUser) {
            setUser(null);
            setCart([]);

            if (unsubscribeCart) {
              unsubscribeCart();
              unsubscribeCart = null;
            }

            router.replace("/sign-in");
            return;
          }

          /*
           * User signed in.
           */
          setUser(currentUser);
          setCart(null);
          setError("");

          /*
           * Remove any previous listener.
           */
          if (unsubscribeCart) {
            unsubscribeCart();
          }

          /*
           * IMPORTANT:
           * Checkout now listens to exactly the
           * same Firestore cart as /cart.
           */
          unsubscribeCart =
            subscribeToCart(
              currentUser.uid,

              (nextCart) => {
                setCart(nextCart);
              },

              (listenerError) => {
                console.error(
                  "CHECKOUT CART ERROR:",
                  listenerError
                );

                setError(
                  listenerError?.message ||
                    "We couldn't load your cart."
                );

                setCart([]);
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
  }, [router]);

  /*
   * Place the order.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    if (
      loading ||
      !user ||
      !cart ||
      cart.length === 0
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * Get Firebase user's current ID token.
       */
      const idToken =
        await user.getIdToken();

      /*
       * IMPORTANT:
       * We DO NOT send product prices from the browser.
       *
       * The server loads the actual products
       * from Firestore and calculates the total.
       */
      const response = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${idToken}`,
          },

          body: JSON.stringify({
            name,
            phone,
            address,
            city,
            postalCode,
            paymentMode,
          }),
        }
      );

      const responseText =
        await response.text();

      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(
            responseText
          );
        } catch {
          data = {
            error: responseText,
          };
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Server returned HTTP ${response.status}.`
        );
      }

      setOrderId(
        data.orderId || ""
      );

      setSubmitted(true);

      /*
       * The API clears the Firestore cart.
       * The live cart listener will update automatically.
       */
    } catch (err) {
      console.error(
        "CHECKOUT ERROR:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Loading.
   */
  if (
    !user ||
    cart === null
  ) {
    return (
      <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
        <div className="mx-auto max-w-5xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#9A6051]">
            THRIFTMATCH / CHECKOUT
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Complete your order.
          </h1>

          <p className="mt-10 text-[#a9958f]">
            Loading your cart...
          </p>

        </div>
      </main>
    );
  }

  /*
   * Empty cart.
   */
  if (
    cart.length === 0 &&
    !submitted
  ) {
    return (
      <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
        <div className="mx-auto max-w-5xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#9A6051]">
            THRIFTMATCH / CHECKOUT
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Complete your order.
          </h1>

          <p className="mt-10 text-[#a9958f]">
            Your cart is empty.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/marketplace"
              )
            }
            className="mt-6 rounded-full bg-[#9A6051] px-6 py-3 text-sm font-bold text-[#120b09] transition hover:bg-[#ad7060]"
          >
            Continue shopping
          </button>

        </div>
      </main>
    );
  }

  /*
   * Order successfully placed.
   */
  if (submitted) {
    return (
      <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
        <div className="mx-auto max-w-5xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#9A6051]">
            THRIFTMATCH / ORDER CONFIRMED
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Order received.
          </h1>

          <div className="mt-10 rounded-2xl border border-[#9A6051]/40 bg-[#211512] p-8">

            <h2 className="text-2xl font-black">
              Your order has been placed.
            </h2>

            <p className="mt-3 text-[#a9958f]">
              Payment mode:{" "}
              <span className="font-semibold text-[#f3e9e5]">
                {paymentMode}
              </span>
            </p>

            {orderId && (
              <p className="mt-2 text-sm text-[#806b64]">
                Order ID: {orderId}
              </p>
            )}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/marketplace"
                )
              }
              className="mt-8 rounded-full bg-[#9A6051] px-6 py-3 text-sm font-bold text-[#120b09] transition hover:bg-[#ad7060]"
            >
              Continue shopping
            </button>

          </div>
        </div>
      </main>
    );
  }

  /*
   * IMPORTANT:
   * These prices/images are coming from the
   * current Firestore products.
   */
  const mrp = cart.reduce(
    (sum, item) =>
      sum +
      getNumericPrice(
        item.price
      ),
    0
  );

  const total =
    mrp + PLATFORM_FEE;

  return (
    <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
      <div className="mx-auto max-w-5xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#9A6051]">
          THRIFTMATCH / CHECKOUT
        </p>

        <h1 className="text-5xl font-black tracking-tight">
          Complete your order.
        </h1>

        {error && (
          <div className="mt-6 rounded-xl border border-red-700/40 bg-red-950/20 px-4 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
        >

          {/* Delivery */}
          <section className="rounded-2xl border border-[#3b2925] bg-[#211512] p-6">

            <h2 className="text-2xl font-black">
              Delivery address
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <input
                required
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Full name"
                autoComplete="name"
                className="rounded-xl border border-[#624038] bg-[#120b09] px-4 py-3 outline-none transition focus:border-[#9A6051]"
              />

              <input
                required
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                type="tel"
                placeholder="Phone number"
                autoComplete="tel"
                className="rounded-xl border border-[#624038] bg-[#120b09] px-4 py-3 outline-none transition focus:border-[#9A6051]"
              />

              <input
                required
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                placeholder="House / street address"
                autoComplete="street-address"
                className="rounded-xl border border-[#624038] bg-[#120b09] px-4 py-3 outline-none transition focus:border-[#9A6051] sm:col-span-2"
              />

              <input
                required
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
                placeholder="City"
                autoComplete="address-level2"
                className="rounded-xl border border-[#624038] bg-[#120b09] px-4 py-3 outline-none transition focus:border-[#9A6051]"
              />

              <input
                required
                value={postalCode}
                onChange={(e) =>
                  setPostalCode(
                    e.target.value
                  )
                }
                inputMode="numeric"
                placeholder="Postal code"
                autoComplete="postal-code"
                className="rounded-xl border border-[#624038] bg-[#120b09] px-4 py-3 outline-none transition focus:border-[#9A6051]"
              />

            </div>

            <h2 className="mt-10 text-2xl font-black">
              Payment mode
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">

              {[
                "UPI",
                "Card",
                "Cash on delivery",
              ].map(
                (mode) => (
                  <label
                    key={mode}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      paymentMode ===
                      mode
                        ? "border-[#9A6051] bg-[#2a1915]"
                        : "border-[#624038] bg-[#120b09]"
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
                          event.target
                            .value
                        )
                      }
                    />

                    <span className="text-sm font-semibold">
                      {mode}
                    </span>

                  </label>
                )
              )}

            </div>

          </section>

          {/* Order summary */}
          <aside className="h-fit rounded-2xl border border-[#3b2925] bg-[#211512] p-6">

            <h2 className="text-2xl font-black">
              Order summary
            </h2>

            <div className="mt-6 space-y-4 border-b border-[#3b2925] pb-6">

              {cart.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="flex gap-4"
                  >

                    <img
                      src={
                        item.image
                      }
                      alt={
                        item.name
                      }
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="min-w-0">

                      <p className="font-bold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-[#a9958f]">
                        ₹
                        {
                          getNumericPrice(
                            item.price
                          )
                        }
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

            <div className="mt-6 space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-[#a9958f]">
                  MRP
                </span>
                <span>
                  ₹{mrp}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#a9958f]">
                  Platform fee
                </span>
                <span>
                  ₹{PLATFORM_FEE}
                </span>
              </div>

              <div className="flex justify-between border-t border-[#3b2925] pt-4 text-lg font-bold">
                <span>
                  Total amount
                </span>

                <span className="text-[#9A6051]">
                  ₹{total}
                </span>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-full bg-[#9A6051] px-6 py-4 text-sm font-bold text-[#120b09] transition hover:bg-[#ad7060] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Placing order..."
                : "Place order"}
            </button>

          </aside>

        </form>
      </div>
    </main>
  );
}
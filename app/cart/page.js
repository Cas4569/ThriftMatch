"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  auth,
} from "@/lib/firebase";

import {
  removeCartItem,
  subscribeToCart,
} from "@/lib/cart";

function getNumericPrice(
  price
) {
  const numericPrice =
    Number(
      String(
        price || ""
      ).replace(
        /[^0-9.]/g,
        ""
      )
    );

  return Number.isFinite(
    numericPrice
  )
    ? numericPrice
    : 0;
}

export default function CartPage() {
  const router =
    useRouter();

  const [user, setUser] =
    useState(null);

  const [cart, setCart] =
    useState(null);

  const [error, setError] =
    useState("");

  const [
    removingId,
    setRemovingId,
  ] = useState(null);

  useEffect(() => {
    let unsubscribeCart =
      null;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          /*
           * Not signed in.
           */
          if (!currentUser) {
            setUser(null);
            setCart([]);

            if (
              unsubscribeCart
            ) {
              unsubscribeCart();
              unsubscribeCart =
                null;
            }

            router.replace(
              "/sign-in"
            );

            return;
          }

          /*
           * Signed in.
           */
          setUser(
            currentUser
          );

          setCart(null);
          setError("");

          /*
           * Clean up any previous listener.
           */
          if (
            unsubscribeCart
          ) {
            unsubscribeCart();
          }

          /*
           * Subscribe to the user's Firestore cart.
           */
          unsubscribeCart =
            subscribeToCart(
              currentUser.uid,

              (nextCart) => {
                setCart(
                  nextCart
                );
              },

              (listenerError) => {
                console.error(
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

      if (
        unsubscribeCart
      ) {
        unsubscribeCart();
      }
    };
  }, [router]);

  /*
   * Remove item.
   */
  async function removeItem(
    productId
  ) {
    if (
      !user ||
      removingId
    ) {
      return;
    }

    try {
      setRemovingId(
        productId
      );

      setError("");

      await removeCartItem(
        user.uid,
        productId
      );
    } catch (error) {
      console.error(
        "REMOVE CART ITEM ERROR:",
        error
      );

      setError(
        error?.message ||
          "Couldn't remove this item."
      );
    } finally {
      setRemovingId(
        null
      );
    }
  }

  /*
   * Checkout.
   */
  function continueToCheckout() {
    if (
      !cart ||
      cart.length === 0
    ) {
      return;
    }

    router.push(
      "/marketplace/checkout"
    );
  }

  /*
   * Loading state.
   */
  if (
    !user ||
    cart === null
  ) {
    return (
      <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
        <div className="mx-auto max-w-4xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#9A6051]">
            THRIFTMATCH / CART
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Your cart.
          </h1>

          <p className="mt-10 text-[#a9958f]">
            Loading your cart...
          </p>

        </div>
      </main>
    );
  }

  /*
   * Total.
   */
  const subtotal =
    cart.reduce(
      (
        sum,
        item
      ) =>
        sum +
        getNumericPrice(
          item.price
        ),
      0
    );

  return (
    <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
      <div className="mx-auto max-w-4xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#9A6051]">
          THRIFTMATCH / CART
        </p>

        <h1 className="text-5xl font-black tracking-tight">
          Your cart.
        </h1>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-700/40 bg-red-950/20 px-4 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Empty */}
        {cart.length === 0 ? (
          <div className="mt-10">

            <p className="text-lg text-[#a9958f]">
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
        ) : (
          <>

            {/* Items */}
            <div className="mt-10 space-y-4">

              {cart.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="flex items-center gap-5 rounded-2xl border border-[#3b2925] bg-[#211512] p-4"
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

                    <div className="min-w-0 flex-1">

                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9A6051]">
                        {
                          item.subcategory ||
                          item.category ||
                          "THRIFTMATCH"
                        }
                      </p>

                      <h2 className="mt-1 font-bold">
                        {
                          item.name
                        }
                      </h2>

                      <p className="mt-1 text-sm text-[#c9b6b0]">
                        ₹
                        {
                          getNumericPrice(
                            item.price
                          )
                        }
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                      disabled={
                        removingId ===
                        item.id
                      }
                      className="text-sm font-bold text-[#9A6051] underline underline-offset-4 transition hover:text-[#ad7060] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingId ===
                      item.id
                        ? "Removing..."
                        : "Remove"}
                    </button>

                  </div>
                )
              )}

            </div>

            {/* Bottom */}
            <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-[#3b2925] bg-[#211512] p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm text-[#a9958f]">
                  {cart.length}{" "}
                  {cart.length === 1
                    ? "item"
                    : "items"}
                </p>

                <p className="mt-1 text-2xl font-black">
                  ₹{subtotal}
                </p>

              </div>

              <button
                type="button"
                onClick={
                  continueToCheckout
                }
                className="rounded-full bg-[#9A6051] px-6 py-4 text-sm font-bold text-[#120b09] transition hover:bg-[#ad7060]"
              >
                Continue to checkout
              </button>

            </div>

          </>
        )}

      </div>
    </main>
  );
}
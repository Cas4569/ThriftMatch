"use client";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

const CATEGORIES = [
  "outerwear",
  "upperwear",
  "lowerwear",
  "footwear",
  "accessories",
];

const cartStorageKey =
  "thriftmatch-cart";

const LAYOUT = [
  {
    tilt: -5,
    offsetY: 0,
    width: "w-44 md:w-52",
  },
  {
    tilt: 3,
    offsetY: 36,
    width: "w-36 md:w-44",
  },
  {
    tilt: -2,
    offsetY: -12,
    width: "w-44 md:w-56",
  },
  {
    tilt: 5,
    offsetY: 20,
    width: "w-36 md:w-40",
  },
  {
    tilt: -3,
    offsetY: 4,
    width: "w-40 md:w-48",
  },
];

export default function StylistPage() {
  const [prompt, setPrompt] =
    useState("");

  const [catalog, setCatalog] =
    useState(null);

  const [loadError, setLoadError] =
    useState("");

  const [aiError, setAiError] =
    useState("");

  const [generating, setGenerating] =
    useState(false);

  const [styleIntent, setStyleIntent] =
    useState(null);

  const [styleReason, setStyleReason] =
    useState("");

  const [locked, setLocked] =
    useState({
      outerwear: false,
      upperwear: false,
      lowerwear: false,
      footwear: false,
      accessories: false,
    });

  const [outfit, setOutfit] =
    useState({});

  const stageRef =
    useRef(null);

  const [tilt, setTilt] =
    useState({
      x: 0,
      y: 0,
    });

  const [cart, setCart] =
    useState([]);

  const [orderMessage, setOrderMessage] =
    useState("");

  /*
   * ---------------------------------------
   * PARALLAX
   * ---------------------------------------
   */

  function handleStageMouseMove(e) {
    if (!stageRef.current) {
      return;
    }

    const rect =
      stageRef.current.getBoundingClientRect();

    setTilt({
      x:
        (e.clientX - rect.left) /
          rect.width -
        0.5,

      y:
        (e.clientY - rect.top) /
          rect.height -
        0.5,
    });
  }

  function handleStageMouseLeave() {
    setTilt({
      x: 0,
      y: 0,
    });
  }

  /*
   * ---------------------------------------
   * CART
   * ---------------------------------------
   */

  useEffect(() => {
    try {
      const savedCart =
        JSON.parse(
          localStorage.getItem(
            cartStorageKey
          ) || "[]"
        );

      const uniqueCart =
        Array.isArray(savedCart)
          ? savedCart.filter(
              (item, index, items) =>
                item?.id &&
                items.findIndex(
                  (entry) =>
                    entry.id ===
                    item.id
                ) === index
            )
          : [];

      setCart(uniqueCart);

      localStorage.setItem(
        cartStorageKey,
        JSON.stringify(
          uniqueCart
        )
      );

      window.dispatchEvent(
        new Event(
          "thriftmatch-cart-updated"
        )
      );
    } catch {
      setCart([]);
    }
  }, []);

  function syncCart(nextCart) {
    localStorage.setItem(
      cartStorageKey,
      JSON.stringify(nextCart)
    );

    window.dispatchEvent(
      new Event(
        "thriftmatch-cart-updated"
      )
    );

    setCart(nextCart);
  }

  /*
   * ---------------------------------------
   * FIRESTORE PRODUCTS
   * ---------------------------------------
   */

  useEffect(() => {
    async function loadProducts() {
      try {
        const snapshot =
          await getDocs(
            collection(
              db,
              "products"
            )
          );

        const nextCatalog =
          Object.fromEntries(
            CATEGORIES.map(
              (category) => [
                category,
                [],
              ]
            )
          );

        snapshot.docs.forEach(
          (productSnapshot) => {
            const product =
              productSnapshot.data();

            const category =
              String(
                product.subcategory ||
                  ""
              )
                .trim()
                .toLowerCase();

            if (
              !nextCatalog[
                category
              ] ||
              !product.name ||
              !product.image
            ) {
              return;
            }

            const numericPrice =
              Number(
                String(
                  product.price ||
                    ""
                ).replace(
                  /[^0-9.]/g,
                  ""
                )
              );

            let keywords = [];

            if (
              Array.isArray(
                product.keywords
              )
            ) {
              keywords =
                product.keywords;
            } else if (
              typeof product.keywords ===
              "string"
            ) {
              keywords =
                product.keywords
                  .split(",")
                  .map((item) =>
                    item.trim()
                  )
                  .filter(Boolean);
            }

            nextCatalog[
              category
            ].push({
              id:
                productSnapshot.id,

              name:
                product.name,

              price:
                Number.isFinite(
                  numericPrice
                )
                  ? numericPrice
                  : 0,

              image:
                product.image,

              occasions:
                Array.isArray(
                  product.occasions
                )
                  ? product.occasions
                  : [],

              keywords,

              /*
               * These optional fields are
               * useful to Gemini if they exist
               * in your Firestore documents.
               */
              color:
                product.color ||
                "",

              material:
                product.material ||
                "",

              brand:
                product.brand ||
                "",

              description:
                product.description ||
                "",
            });
          }
        );

        setCatalog(
          nextCatalog
        );

        /*
         * Initial display.
         * These will be replaced when the AI
         * generates the first actual look.
         */
        const initial = {};

        CATEGORIES.forEach(
          (category) => {
            initial[category] =
              nextCatalog[
                category
              ]?.[0] || null;
          }
        );

        setOutfit(initial);
      } catch (error) {
        console.error(error);

        setLoadError(
          "We couldn't load products from the marketplace."
        );
      }
    }

    loadProducts();
  }, []);

  /*
   * ---------------------------------------
   * CONVERT FIRESTORE CATALOG INTO AI DATA
   * ---------------------------------------
   */

  function buildAICatalog() {
    if (!catalog) {
      return [];
    }

    return CATEGORIES.flatMap(
      (category) =>
        (
          catalog[
            category
          ] || []
        ).map((item) => ({
          id: item.id,
          name: item.name,
          category,
          price: item.price,
          occasions:
            item.occasions || [],
          keywords:
            item.keywords || [],
          color:
            item.color || "",
          material:
            item.material || "",
          brand:
            item.brand || "",
          description:
            item.description || "",
        }))
    );
  }

  /*
   * ---------------------------------------
   * GEMINI GENERATION
   * ---------------------------------------
   */

  async function generateOutfit() {
    if (
      !catalog ||
      generating
    ) {
      return;
    }

    setGenerating(true);
    setAiError("");
    setOrderMessage("");

    try {
      const aiCatalog =
        buildAICatalog();

      /*
       * Currently locked pieces.
       */
      const lockedItems =
        CATEGORIES.map(
          (category) => {
            if (
              !locked[category]
            ) {
              return null;
            }

            const item =
              outfit[category];

            if (!item) {
              return null;
            }

            return {
              category,

              productId:
                item.id,

              name:
                item.name,
            };
          }
        ).filter(Boolean);

      /*
       * Previously displayed items.
       *
       * Gemini uses these to create variety
       * on "Reveal a new look".
       */
      const avoidItems =
        CATEGORIES.map(
          (category) => {
            if (
              locked[category]
            ) {
              return null;
            }

            const item =
              outfit[category];

            if (!item) {
              return null;
            }

            return {
              category,

              productId:
                item.id,
            };
          }
        ).filter(Boolean);

      const response =
        await fetch(
          "/api/style",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              prompt,

              catalog:
                aiCatalog,

              lockedItems,

              avoidItems,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Gemini could not generate an outfit."
        );
      }

      /*
       * Map AI product IDs back to the
       * actual Firestore product objects.
       */
      const itemMap =
        new Map();

      CATEGORIES.forEach(
        (category) => {
          (
            catalog[
              category
            ] || []
          ).forEach(
            (item) => {
              itemMap.set(
                item.id,
                item
              );
            }
          );
        }
      );

      setOutfit(
        (previous) => {
          const next = {
            ...previous,
          };

          /*
           * Never let AI replace a piece
           * that the user explicitly locked.
           */
          for (const selection of
            data.selections ||
            []) {
            const category =
              selection.category;

            if (
              locked[category]
            ) {
              continue;
            }

            const item =
              itemMap.get(
                selection.productId
              );

            if (!item) {
              continue;
            }

            next[category] =
              item;
          }

          return next;
        }
      );

      setStyleIntent(
        data.intent || null
      );

      setStyleReason(
        data.overallReason ||
          ""
      );
    } catch (error) {
      console.error(
        "AI styling error:",
        error
      );

      setAiError(
        error?.message ||
          "Something went wrong with the AI stylist."
      );
    } finally {
      setGenerating(
        false
      );
    }
  }

  /*
   * ---------------------------------------
   * ENTER TO GENERATE
   * ---------------------------------------
   */

  function handlePromptKeyDown(e) {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      generateOutfit();
    }
  }

  /*
   * ---------------------------------------
   * LOCK / UNLOCK
   * ---------------------------------------
   */

  function toggleLock(
    category
  ) {
    setLocked((prev) => ({
      ...prev,

      [category]:
        !prev[category],
    }));
  }

  /*
   * ---------------------------------------
   * TOTALS
   * ---------------------------------------
   */

  const total =
    CATEGORIES.reduce(
      (sum, category) =>
        sum +
        (outfit[
          category
        ]?.price || 0),
      0
    );

  const heldCategories =
    CATEGORIES.filter(
      (category) =>
        locked[category]
    );

  const heldCount =
    heldCategories.length;

  const fullOutfit =
    heldCount ===
    CATEGORIES.length;

  const heldTotal =
    heldCategories.reduce(
      (sum, category) =>
        sum +
        (outfit[
          category
        ]?.price || 0),
      0
    );

  /*
   * ---------------------------------------
   * CART
   * ---------------------------------------
   */

  function handleAddToCart() {
    const itemsToAdd =
      heldCategories
        .map(
          (category) =>
            outfit[
              category
            ]
        )
        .filter(Boolean);

    const savedCart =
      JSON.parse(
        localStorage.getItem(
          cartStorageKey
        ) || "[]"
      );

    const nextCart = [
      ...savedCart,
      ...itemsToAdd,
    ].filter(
      (item, index, items) =>
        item?.id &&
        items.findIndex(
          (entry) =>
            entry.id ===
            item.id
        ) === index
    );

    syncCart(
      nextCart
    );

    setOrderMessage(
      `Added ${itemsToAdd.length} piece${
        itemsToAdd.length ===
        1
          ? ""
          : "s"
      } to cart.`
    );
  }

  /*
   * ---------------------------------------
   * BUY NOW
   * ---------------------------------------
   */

  function handleBuyNow() {
    setOrderMessage(
      `Buying the full outfit — ₹${total}.`
    );
  }

  /*
   * ---------------------------------------
   * PAGE
   * ---------------------------------------
   */

  return (
    <>
      {loadError ? (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 py-16 font-mono text-[#7CFF9C]">
          <p>
            {loadError}
          </p>
        </main>
      ) : !catalog ? (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 py-16 font-mono text-[#7CFF9C]">
          <p>
            Loading marketplace pieces...
          </p>
        </main>
      ) : (
        <main className="relative min-h-screen overflow-hidden bg-black px-6 py-16 text-[#DFFFE6] md:px-12">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,500&display=swap');

            .stylist-serif {
              font-family: 'Fraunces', Georgia, serif;
            }

            @keyframes scan {
              0% {
                background-position: 0 0;
              }

              100% {
                background-position: 0 40px;
              }
            }

            @keyframes metalShimmer {
              0% {
                background-position: 0% 50%;
              }

              100% {
                background-position: 100% 50%;
              }
            }

            @keyframes aiPulse {
              0%,
              100% {
                opacity: 0.45;
              }

              50% {
                opacity: 1;
              }
            }

            .ai-pulse {
              animation: aiPulse 1.4s ease-in-out infinite;
            }
          `}</style>

          {/* Scanlines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(124,255,156,0.55) 0px, rgba(124,255,156,0.55) 1px, transparent 1px, transparent 4px)",
              animation:
                "scan 6s linear infinite",
            }}
          />

          {/* Radial background */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(10,45,20,0.7) 0%, rgba(0,0,0,0.96) 58%)",
            }}
          />

          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#26E600]/10 blur-[160px]" />

          <div className="relative mx-auto max-w-6xl">
            {/* HEADER */}
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-lg">
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#7CFF9C]/70">
                  System initialized: a private styling session, run by the machine.
                </p>

                <h1 className="stylist-serif relative inline-block text-5xl italic leading-[1.05] text-[#DFFFE6] [text-shadow:0_0_18px_rgba(124,255,156,0.35)] md:text-6xl">
                  Tell it what you're feeling.
                </h1>

                {/* AI STYLE PROFILE */}
                {styleIntent && (
                  <div className="mt-5 rounded-md border border-[#7CFF9C]/20 bg-black/30 px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7CFF9C]/50">
                      AI STYLE PROFILE
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[#7CFF9C]/30 px-3 py-1 font-mono text-xs text-[#7CFF9C]">
                        {styleIntent.occasion}
                      </span>

                      <span className="rounded-full border border-[#7CFF9C]/30 px-3 py-1 font-mono text-xs text-[#7CFF9C]">
                        {styleIntent.vibe}
                      </span>

                      <span className="rounded-full border border-[#7CFF9C]/30 px-3 py-1 font-mono text-xs text-[#7CFF9C]">
                        {styleIntent.formality}
                      </span>

                      <span className="rounded-full border border-[#7CFF9C]/30 px-3 py-1 font-mono text-xs text-[#7CFF9C]">
                        {styleIntent.colorDirection}
                      </span>
                    </div>

                    <p className="mt-3 font-mono text-xs leading-5 text-[#DFFFE6]/70">
                      {styleIntent.summary}
                    </p>

                    {styleReason && (
                      <p className="mt-2 font-mono text-xs leading-5 text-[#7CFF9C]/70">
                        {styleReason}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* AI PROMPT */}
              <div
                className="relative w-full rounded-md p-[3px] md:w-80"
                style={{
                  background:
                    "linear-gradient(135deg, #d0d0d0 0%, #6d6d6d 12%, #1d1d1d 30%, #7e7e7e 46%, #191919 60%, #a5a5a5 75%, #2d2d2d 100%)",

                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -3px 10px rgba(0,0,0,0.8), 0 0 18px rgba(74,222,128,0.14)",

                  backgroundSize:
                    "200% 200%",

                  animation:
                    "metalShimmer 9s linear infinite",
                }}
              >
                <div className="rounded-[5px] bg-black/85 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                  <input
                    value={prompt}
                    onChange={(e) =>
                      setPrompt(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handlePromptKeyDown
                    }
                    placeholder="rainy college day, vintage energy, but still clean..."
                    className="w-full bg-transparent font-mono text-base text-[#7CFF9C] placeholder:text-[#7CFF9C]/40 focus:outline-none"
                  />

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-mono text-xs text-[#7CFF9C]/70">
                      &gt; sensing:{" "}
                      {generating ? (
                        <span className="ai-pulse">
                          interpreting request...
                        </span>
                      ) : (
                        styleIntent?.occasion ||
                        "AI ready"
                      )}
                    </p>

                    <button
                      onClick={
                        generateOutfit
                      }
                      disabled={
                        generating
                      }
                      title="Generate from this"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#4ADE80]/60 bg-black text-[#7CFF9C] shadow-[0_0_12px_rgba(74,222,128,0.5)] transition hover:bg-[#0f2b16] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {generating ? (
                        <span className="text-[10px]">
                          ...
                        </span>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12 H19 M13 6 L19 12 L13 18" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI ERROR */}
            {aiError && (
              <div className="mt-8 rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 font-mono text-xs text-red-300">
                {aiError}
              </div>
            )}

            {/* MOODBOARD */}
            <div
              ref={stageRef}
              onMouseMove={
                handleStageMouseMove
              }
              onMouseLeave={
                handleStageMouseLeave
              }
              className="relative mt-16 flex flex-wrap items-start justify-center gap-x-5 gap-y-8 [perspective:1400px] md:justify-start"
            >
              {CATEGORIES.map(
                (cat, i) => {
                  const item =
                    outfit[cat];

                  const isLocked =
                    locked[cat];

                  const {
                    tilt: staticTilt,
                    offsetY,
                    width,
                  } =
                    LAYOUT[i];

                  if (!item) {
                    return null;
                  }

                  const depth =
                    8 + i * 4;

                  return (
                    <div
                      key={cat}
                      className={`group relative flex-shrink-0 rounded-sm border p-3 pb-4 transition-transform duration-150 ease-out ${width} ${
                        isLocked
                          ? "border-[#7CFF9C] bg-[#0b1a0f]/80"
                          : "border-[#b0b0b0]/80 bg-[#0e0e0e]/90"
                      }`}
                      style={{
                        transform: `translateY(${offsetY}px) rotate3d(${-tilt.y}, ${tilt.x}, 0, 10deg) rotate(${staticTilt}deg) translate3d(${tilt.x * depth}px, ${tilt.y * depth}px, ${depth}px)`,

                        background:
                          "linear-gradient(135deg, #eeeeee 0%, #9a9a9a 12%, #3a3a3a 26%, #cfcfcf 40%, #4a4a4a 55%, #1a1a1a 70%, #b5b5b5 85%, #2e2e2e 100%)",

                        boxShadow:
                          isLocked
                            ? "inset 0 2px 1px rgba(255,255,255,0.85), inset 0 -3px 8px rgba(0,0,0,0.8), 0 0 0 2px rgba(124,255,156,0.85), 0 0 28px rgba(124,255,156,0.5), 0 20px 35px -15px rgba(0,0,0,0.85)"
                            : "inset 0 2px 1px rgba(255,255,255,0.85), inset 0 -3px 8px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.3), 0 0 16px rgba(124,255,156,0.25), 0 20px 35px -15px rgba(0,0,0,0.85)",
                      }}
                    >
                      <div className="absolute -top-2.5 left-1/2 h-3 w-8 -translate-x-1/2 rounded-sm bg-[#7CFF9C]/80 shadow-[0_0_8px_rgba(124,255,156,0.8)]" />

                      {isLocked && (
                        <span className="absolute right-3 top-3 z-10 text-[#7CFF9C] [text-shadow:0_0_6px_rgba(124,255,156,0.8)]">
                          ✦
                        </span>
                      )}

                      <div
                        className="aspect-[3/4] w-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url('${item.image}')`,

                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 8px rgba(0,0,0,0.5)",

                          border:
                            "1px solid rgba(255,255,255,0.45)",
                        }}
                      />

                      <div className="mt-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7CFF9C]/70">
                          {cat}
                        </p>

                        <p className="mt-1 text-sm leading-tight text-[#DFFFE6]">
                          {item.name}
                        </p>

                        <p className="mt-1 font-mono text-sm text-[#7CFF9C]">
                          ₹{item.price}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          toggleLock(
                            cat
                          )
                        }
                        className={`mt-3 w-full rounded-sm border py-1.5 font-mono text-xs font-medium transition ${
                          isLocked
                            ? "border-[#7CFF9C] bg-[#7CFF9C]/15 text-[#7CFF9C] shadow-[0_0_10px_rgba(124,255,156,0.25)]"
                            : "border-[#b1b1b1] bg-[#171717] text-[#DFFFE6] hover:border-[#7CFF9C] hover:bg-[#0e1c12]"
                        }`}
                      >
                        {isLocked
                          ? "Held for this look"
                          : "Hold this piece"}
                      </button>
                    </div>
                  );
                }
              )}
            </div>

            {/* BOTTOM BAR */}
            <div
              className="relative mt-14 overflow-hidden rounded-[24px] border border-[#d7d7d7]/70"
              style={{
                background:
                  "linear-gradient(120deg, #b9b9b9 0%, #7a7a7a 12%, #3a3a3a 28%, #d6d6d6 42%, #4f4f4f 58%, #1e1e1e 74%, #a9a9a9 100%)",

                boxShadow:
                  "inset 0 2px 2px rgba(255,255,255,0.9), inset 0 -5px 12px rgba(0,0,0,0.8), 0 20px 50px -15px rgba(0,0,0,0.8)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-y-0 left-[16%] w-[28%] bg-black/35"
                style={{
                  clipPath:
                    "polygon(18% 0, 100% 0, 75% 100%, 0 100%)",
                }}
              />

              <div className="relative flex flex-wrap items-center justify-between gap-6 px-8 py-7">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-[#0a3d1a]">
                    {fullOutfit
                      ? "full outfit"
                      : `${heldCount} of ${CATEGORIES.length} held`}
                  </p>

                  <p className="stylist-serif text-4xl italic text-[#7CFF9C] [text-shadow:0_0_16px_rgba(124,255,156,0.7)] md:text-5xl">
                    ₹
                    {fullOutfit
                      ? total
                      : heldTotal ||
                        total}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={
                      generateOutfit
                    }
                    disabled={
                      generating
                    }
                    className="rounded-full border border-[#4ADE80]/60 bg-black/45 px-6 py-3 font-mono text-sm text-[#DFFFE6] transition hover:border-[#4ADE80] hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {generating
                      ? "Styling..."
                      : "Reveal a new look"}
                  </button>

                  {fullOutfit ? (
                    <button
                      onClick={
                        handleBuyNow
                      }
                      className="rounded-full bg-[#4ADE80] px-8 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(74,222,128,0.6)] transition hover:-translate-y-0.5 hover:bg-[#7CFF9C]"
                    >
                      Buy now — full outfit
                    </button>
                  ) : (
                    <button
                      onClick={
                        handleAddToCart
                      }
                      disabled={
                        heldCount ===
                        0
                      }
                      className="rounded-full border-2 border-[#4ADE80] bg-black/45 px-8 py-3.5 font-semibold text-[#7CFF9C] transition hover:bg-[#0e1c12] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Add held pieces to cart
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ORDER MESSAGE */}
            {orderMessage && (
              <p className="mt-4 text-center font-mono text-xs text-[#7CFF9C]">
                {orderMessage}
              </p>
            )}
          </div>
        </main>
      )}
    </>
  );
}
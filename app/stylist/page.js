"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CATEGORIES = [
  "outerwear",
  "upperwear",
  "lowerwear",
  "footwear",
  "accessories",
];

const cartStorageKey = "thriftmatch-cart";

const LAYOUT = [
  { tilt: -5, offsetY: 0, width: "w-44 md:w-52" },
  { tilt: 3, offsetY: 36, width: "w-36 md:w-44" },
  { tilt: -2, offsetY: -12, width: "w-44 md:w-56" },
  { tilt: 5, offsetY: 20, width: "w-36 md:w-40" },
  { tilt: -3, offsetY: 4, width: "w-40 md:w-48" },
];

// words the "AI" reads to infer what occasion the prompt is describing
const KEYWORD_MAP = {
  wedding: [
    "wedding",
    "bride",
    "groom",
    "ceremony",
    "reception",
    "ethnic",
  ],

  interview: [
    "interview",
    "job",
    "office",
    "professional",
    "formal",
    "meeting",
    "boardroom",
  ],

  date: [
    "date",
    "romantic",
    "dinner",
    "evening",
    "charm",
    "confident",
    "candlelit",
  ],

  festival: [
    "festival",
    "fest",
    "party",
    "dance",
    "vibrant",
    "colorful",
    "concert",
    "carnival",
  ],

  casual: [
    "casual",
    "everyday",
    "chill",
    "relax",
    "weekend",
    "cozy",
    "rainy",
    "grandmother",
    "lazy",
  ],
};

function inferVibe(text) {
  const lower = text.toLowerCase();
  const scores = {};

  Object.entries(KEYWORD_MAP).forEach(([vibe, words]) => {
    scores[vibe] = words.reduce(
      (n, w) => (lower.includes(w) ? n + 1 : n),
      0
    );
  });

  const best = Object.entries(scores).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return best && best[1] > 0 ? best[0] : null;
}

function hashString(str) {
  let h = 0;

  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }

  return h;
}

function mulberry32(seed) {
  let a = seed;

  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;

    let t = Math.imul(a ^ (a >>> 15), 1 | a);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return (
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}

function pickItem(catalog, category, vibe, rng) {
  const pool = catalog[category] || [];

  const matching = vibe
    ? pool.filter((item) =>
        item.occasions.includes(vibe)
      )
    : [];

  const source = matching.length ? matching : pool;

  return source.length
    ? source[Math.floor(rng() * source.length)]
    : null;
}

export default function StylistPage() {
  const [prompt, setPrompt] = useState("");
  const [nonce, setNonce] = useState(0);
  const [catalog, setCatalog] = useState(null);
  const [loadError, setLoadError] = useState("");

  const [locked, setLocked] = useState({
    outerwear: false,
    upperwear: false,
    lowerwear: false,
    footwear: false,
    accessories: false,
  });

  const [outfit, setOutfit] = useState({});

  // Cursor-driven 3D parallax for the floating cards.
  const stageRef = useRef(null);
  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
  });

  function handleStageMouseMove(e) {
    if (!stageRef.current) return;

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

  // Cart state
  const [cart, setCart] = useState([]);
  const [orderMessage, setOrderMessage] = useState("");

  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem(cartStorageKey) || "[]"
      );

      const uniqueCart = Array.isArray(savedCart)
        ? savedCart.filter(
            (item, index, items) =>
              item?.id &&
              items.findIndex(
                (entry) =>
                  entry.id === item.id
              ) === index
          )
        : [];

      setCart(uniqueCart);

      localStorage.setItem(
        cartStorageKey,
        JSON.stringify(uniqueCart)
      );

      window.dispatchEvent(
        new Event("thriftmatch-cart-updated")
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
      new Event("thriftmatch-cart-updated")
    );

    setCart(nextCart);
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const snapshot = await getDocs(
          collection(db, "products")
        );

        const nextCatalog = Object.fromEntries(
          CATEGORIES.map((category) => [
            category,
            [],
          ])
        );

        snapshot.docs.forEach(
          (productSnapshot) => {
            const product =
              productSnapshot.data();

            const category = String(
              product.subcategory || ""
            ).toLowerCase();

            if (
              !nextCatalog[category] ||
              !product.name ||
              !product.image
            ) {
              return;
            }

            const numericPrice = Number(
              String(product.price || "").replace(
                /[^0-9.]/g,
                ""
              )
            );

            nextCatalog[category].push({
              id: productSnapshot.id,
              name: product.name,
              price: Number.isFinite(
                numericPrice
              )
                ? numericPrice
                : 0,
              image: product.image,
              occasions: Array.isArray(
                product.occasions
              )
                ? product.occasions
                : [],
            });
          }
        );

        setCatalog(nextCatalog);

        const rng = mulberry32(
          hashString("start-0")
        );

        const initial = {};

        CATEGORIES.forEach((category) => {
          initial[category] = pickItem(
            nextCatalog,
            category,
            null,
            rng
          );
        });

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

  const vibe = useMemo(
    () => inferVibe(prompt),
    [prompt]
  );

  function generateOutfit() {
    if (!catalog) return;

    const rng = mulberry32(
      hashString(`${prompt}-${nonce}`)
    );

    setOutfit((prev) => {
      const next = { ...prev };

      CATEGORIES.forEach((cat) => {
        if (!locked[cat]) {
          next[cat] = pickItem(
            catalog,
            cat,
            vibe,
            rng
          );
        }
      });

      return next;
    });

    setNonce((n) => n + 1);
  }

  function handlePromptKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateOutfit();
    }
  }

  function toggleLock(category) {
    setLocked((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }

  const total = CATEGORIES.reduce(
    (sum, cat) =>
      sum + (outfit[cat]?.price || 0),
    0
  );

  const heldCategories = CATEGORIES.filter(
    (cat) => locked[cat]
  );

  const heldCount = heldCategories.length;

  const fullOutfit =
    heldCount === CATEGORIES.length;

  const heldTotal = heldCategories.reduce(
    (sum, cat) =>
      sum + (outfit[cat]?.price || 0),
    0
  );

  function handleAddToCart() {
    const itemsToAdd = heldCategories
      .map((cat) => outfit[cat])
      .filter(Boolean);

    const savedCart = JSON.parse(
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
            entry.id === item.id
        ) === index
    );

    syncCart(nextCart);

    setOrderMessage(
      `Added ${itemsToAdd.length} piece${
        itemsToAdd.length === 1
          ? ""
          : "s"
      } to cart.`
    );
  }

  function handleBuyNow() {
    setOrderMessage(
      `Buying the full outfit — ₹${total}.`
    );

    // Connect this to your checkout flow later.
  }

  return (
    <>
      {loadError ? (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 py-16 font-mono text-[#7CFF9C]">
          <p>{loadError}</p>
        </main>
      ) : !catalog ? (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 py-16 font-mono text-[#7CFF9C]">
          <p>Loading marketplace pieces...</p>
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
          `}</style>

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(124,255,156,0.55) 0px, rgba(124,255,156,0.55) 1px, transparent 1px, transparent 4px)",
              animation:
                "scan 6s linear infinite",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(10,45,20,0.7) 0%, rgba(0,0,0,0.96) 58%)",
            }}
          />

          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#26E600]/10 blur-[160px]" />

          <div className="relative mx-auto max-w-6xl">

            {/* Header row */}
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-lg">
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#7CFF9C]/70">
                  System initialized: a private styling session, run by the machine.
                </p>

                <h1 className="stylist-serif relative inline-block text-5xl italic leading-[1.05] text-[#DFFFE6] [text-shadow:0_0_18px_rgba(124,255,156,0.35)] md:text-6xl">
                  Tell it what you're feeling.
                </h1>
              </div>

              <div
                className="relative w-full rounded-md p-[3px] md:w-80"
                style={{
                  background:
                    "linear-gradient(135deg, #d0d0d0 0%, #6d6d6d 12%, #1d1d1d 30%, #7e7e7e 46%, #191919 60%, #a5a5a5 75%, #2d2d2d 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -3px 10px rgba(0,0,0,0.8), 0 0 18px rgba(74,222,128,0.14)",
                  backgroundSize: "200% 200%",
                  animation:
                    "metalShimmer 9s linear infinite",
                }}
              >
                <div className="rounded-[5px] bg-black/85 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                  <input
                    value={prompt}
                    onChange={(e) =>
                      setPrompt(e.target.value)
                    }
                    onKeyDown={
                      handlePromptKeyDown
                    }
                    placeholder="rainy day, my grandmother's cardigan, confident energy..."
                    className="w-full bg-transparent font-mono text-base text-[#7CFF9C] placeholder:text-[#7CFF9C]/40 focus:outline-none"
                  />

                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-mono text-xs text-[#7CFF9C]/70">
                      &gt; sensing:{" "}
                      {vibe ||
                        "open to anything"}
                    </p>

                    <button
                      onClick={generateOutfit}
                      title="Generate from this"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#4ADE80]/60 bg-black text-[#7CFF9C] shadow-[0_0_12px_rgba(74,222,128,0.5)] transition hover:bg-[#0f2b16]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12 H19 M13 6 L19 12 L13 18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Moodboard */}
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
                  const item = outfit[cat];
                  const isLocked =
                    locked[cat];

                  const {
                    tilt: staticTilt,
                    offsetY,
                    width,
                  } = LAYOUT[i];

                  if (!item) return null;

                  const depth = 8 + i * 4;

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

                        boxShadow: isLocked
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
                          toggleLock(cat)
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

            {/* Bottom bar */}
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
                      : heldTotal || total}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={generateOutfit}
                    className="rounded-full border border-[#4ADE80]/60 bg-black/45 px-6 py-3 font-mono text-sm text-[#DFFFE6] transition hover:border-[#4ADE80] hover:bg-black/70"
                  >
                    Reveal a new look
                  </button>

                  {fullOutfit ? (
                    <button
                      onClick={handleBuyNow}
                      className="rounded-full bg-[#4ADE80] px-8 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(74,222,128,0.6)] transition hover:-translate-y-0.5 hover:bg-[#7CFF9C]"
                    >
                      Buy now — full outfit
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={heldCount === 0}
                      className="rounded-full border-2 border-[#4ADE80] bg-black/45 px-8 py-3.5 font-semibold text-[#7CFF9C] transition hover:bg-[#0e1c12] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Add held pieces to cart
                    </button>
                  )}
                </div>
              </div>
            </div>

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
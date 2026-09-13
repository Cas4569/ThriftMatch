"use client";

import { useState, useMemo } from "react";

const CATALOG = {
  outerwear: [
    { id: "o1", name: "Olive Field Jacket", price: 1450, image: "/products/outer1.jpg", occasions: ["casual", "festival"] },
    { id: "o2", name: "Denim Trucker", price: 1200, image: "/products/outer2.jpg", occasions: ["casual", "date"] },
    { id: "o3", name: "Wool Overcoat", price: 2100, image: "/products/outer3.jpg", occasions: ["interview", "wedding"] },
    { id: "o4", name: "Embroidered Bomber", price: 1750, image: "/products/outer4.jpg", occasions: ["festival", "date"] },
  ],
  upperwear: [
    { id: "u1", name: "Brown Knit Vest", price: 650, image: "/products/top1.jpg", occasions: ["casual", "date"] },
    { id: "u2", name: "Plaid Button-Up", price: 780, image: "/products/top2.jpg", occasions: ["casual", "interview"] },
    { id: "u3", name: "White Tee", price: 320, image: "/products/top3.jpg", occasions: ["casual", "festival"] },
    { id: "u4", name: "Silk Blouse", price: 1100, image: "/products/top4.jpg", occasions: ["interview", "wedding", "date"] },
  ],
  lowerwear: [
    { id: "l1", name: "Cargo Pants", price: 950, image: "/products/bottom1.jpg", occasions: ["casual", "festival"] },
    { id: "l2", name: "Faded Denim", price: 890, image: "/products/bottom2.jpg", occasions: ["casual", "date"] },
    { id: "l3", name: "Corduroy Trousers", price: 760, image: "/products/bottom3.jpg", occasions: ["interview", "casual"] },
    { id: "l4", name: "Tailored Palazzo", price: 1250, image: "/products/bottom4.jpg", occasions: ["wedding", "interview"] },
  ],
  footwear: [
    { id: "f1", name: "White Sneakers", price: 1600, image: "/products/shoes1.jpg", occasions: ["casual", "festival"] },
    { id: "f2", name: "Leather Boots", price: 2400, image: "/products/shoes2.jpg", occasions: ["date", "casual"] },
    { id: "f3", name: "Canvas High-Tops", price: 1350, image: "/products/shoes3.jpg", occasions: ["casual", "festival"] },
    { id: "f4", name: "Heeled Mules", price: 1900, image: "/products/shoes4.jpg", occasions: ["wedding", "interview", "date"] },
  ],
  accessories: [
    { id: "a1", name: "Silver Chain", price: 420, image: "/products/acc1.jpg", occasions: ["date", "festival"] },
    { id: "a2", name: "Beanie", price: 280, image: "/products/acc2.jpg", occasions: ["casual", "festival"] },
    { id: "a3", name: "Crossbody Bag", price: 980, image: "/products/acc3.jpg", occasions: ["casual", "interview"] },
    { id: "a4", name: "Pearl Studs", price: 540, image: "/products/acc4.jpg", occasions: ["wedding", "interview"] },
  ],
};

const CATEGORIES = ["outerwear", "upperwear", "lowerwear", "footwear", "accessories"];

const LAYOUT = [
  { tilt: -5, offsetY: 0, width: "w-44 md:w-52" },
  { tilt: 3, offsetY: 36, width: "w-36 md:w-44" },
  { tilt: -2, offsetY: -12, width: "w-44 md:w-56" },
  { tilt: 5, offsetY: 20, width: "w-36 md:w-40" },
  { tilt: -3, offsetY: 4, width: "w-40 md:w-48" },
];

// words the "AI" reads to infer what occasion the prompt is describing
const KEYWORD_MAP = {
  wedding: ["wedding", "bride", "groom", "ceremony", "reception", "ethnic"],
  interview: ["interview", "job", "office", "professional", "formal", "meeting", "boardroom"],
  date: ["date", "romantic", "dinner", "evening", "charm", "confident", "candlelit"],
  festival: ["festival", "fest", "party", "dance", "vibrant", "colorful", "concert", "carnival"],
  casual: ["casual", "everyday", "chill", "relax", "weekend", "cozy", "rainy", "grandmother", "lazy"],
};

function inferVibe(text) {
  const lower = text.toLowerCase();
  const scores = {};
  Object.entries(KEYWORD_MAP).forEach(([vibe, words]) => {
    scores[vibe] = words.reduce((n, w) => (lower.includes(w) ? n + 1 : n), 0);
  });
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
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
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickItem(category, vibe, rng) {
  const pool = CATALOG[category];
  const matching = vibe ? pool.filter((item) => item.occasions.includes(vibe)) : [];
  const source = matching.length ? matching : pool;
  return source[Math.floor(rng() * source.length)];
}

export default function StylistPage() {
  const [prompt, setPrompt] = useState("");
  const [nonce, setNonce] = useState(0);
  const [locked, setLocked] = useState({
    outerwear: false,
    upperwear: false,
    lowerwear: false,
    footwear: false,
    accessories: false,
  });
  const [outfit, setOutfit] = useState(() => {
    const rng = mulberry32(hashString("start-0"));
    const initial = {};
    CATEGORIES.forEach((cat) => {
      initial[cat] = pickItem(cat, null, rng);
    });
    return initial;
  });

  const vibe = useMemo(() => inferVibe(prompt), [prompt]);

  function generateOutfit() {
    const rng = mulberry32(hashString(`${prompt}-${nonce}`));
    setOutfit((prev) => {
      const next = { ...prev };
      CATEGORIES.forEach((cat) => {
        if (!locked[cat]) next[cat] = pickItem(cat, vibe, rng);
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
    setLocked((prev) => ({ ...prev, [category]: !prev[category] }));
  }

  const total = CATEGORIES.reduce((sum, cat) => sum + outfit[cat].price, 0);

  return (
    <main className="min-h-screen bg-[#120D1B] px-6 py-16 text-[#F3EEE7] md:px-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,500&display=swap');
        .stylist-serif { font-family: 'Fraunces', Georgia, serif; }
      `}</style>

      <div className="mx-auto max-w-6xl">

        {/* Header row: headline left, prompt box right */}
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="pointer-events-none absolute -left-16 -top-20 h-72 w-72 rounded-full bg-[#C6A15B]/10 blur-3xl" />

          <div className="max-w-lg">
            <p className="mb-3 text-sm text-[#9C90AF]">A private styling session, run by the machine.</p>
            <h1 className="stylist-serif relative inline-block text-5xl italic leading-[1.05] text-[#F3EEE7] md:text-6xl">
              Tell it what you're feeling.
            </h1>
            <svg className="mt-2 h-3 w-64 text-[#C6A15B]/70" viewBox="0 0 260 12" fill="none">
              <path d="M2 8 Q 40 2, 80 7 T 160 6 T 258 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 7" />
            </svg>
          </div>

          <div className="relative w-full rotate-1 md:w-80">
            <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 bg-[#C6A15B]" />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              placeholder="rainy day, my grandmother's cardigan, confident energy..."
              rows={3}
              className="w-full resize-none rounded-md border border-[#C6A15B]/30 bg-[#1D1530] p-4 pr-14 text-sm text-[#F3EEE7] placeholder:text-[#9C90AF] focus:border-[#C6A15B] focus:outline-none"
            />
            <button
              onClick={generateOutfit}
              title="Generate from this"
              className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#C6A15B] text-[#120D1B] transition hover:bg-[#E4C989]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12 H19 M13 6 L19 12 L13 18" />
              </svg>
            </button>
            <p className="mt-2 text-xs text-[#9C90AF]">
              {vibe ? `sensing: ${vibe}` : "sensing: open to anything"}
            </p>
          </div>
        </div>

        {/* Moodboard — asymmetric */}
        <div className="mt-16 flex flex-wrap items-start justify-center gap-x-5 gap-y-8 md:justify-start">
          {CATEGORIES.map((cat, i) => {
            const item = outfit[cat];
            const isLocked = locked[cat];
            const { tilt, offsetY, width } = LAYOUT[i];
            return (
              <div
                key={cat}
                style={{ transform: `translateY(${offsetY}px) rotate(${tilt}deg)` }}
                className={`group relative flex-shrink-0 rounded-sm border p-3 pb-4 transition hover:z-10 hover:rotate-0 hover:scale-105 ${width} ${
                  isLocked ? "border-[#C6A15B] bg-[#271D3D]" : "border-[#C6A15B]/25 bg-[#1D1530]"
                }`}
              >
                <div className="absolute -top-2.5 left-1/2 h-3 w-8 -translate-x-1/2 rounded-sm bg-[#C6A15B]/70" />

                {isLocked && <span className="absolute right-3 top-3 z-10 text-[#E4C989]">✦</span>}

                <div
                  className="aspect-[3/4] w-full bg-cover bg-center bg-gradient-to-b from-[#241C38] to-[#0E0916]"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />

                <div className="mt-3">
                  <p className="text-[11px] capitalize text-[#9C90AF]">{cat}</p>
                  <p className="mt-0.5 text-sm font-medium leading-tight text-[#F3EEE7]">{item.name}</p>
                  <p className="mt-1 text-sm text-[#C6A15B]">₹{item.price}</p>
                </div>

                <button
                  onClick={() => toggleLock(cat)}
                  className={`mt-3 w-full rounded-sm py-1.5 text-xs font-medium transition ${
                    isLocked
                      ? "bg-[#C6A15B] text-[#120D1B]"
                      : "border border-[#C6A15B]/40 text-[#F3EEE7] hover:border-[#C6A15B] hover:bg-[#C6A15B]/10"
                  }`}
                >
                  {isLocked ? "Held for this look" : "Hold this piece"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Total bar — bigger, cleaner */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-[#C6A15B]/25 bg-[#1D1530] px-8 py-7">
          <p className="stylist-serif text-4xl italic text-[#F3EEE7] md:text-5xl">₹{total}</p>

          <button
            onClick={generateOutfit}
            className="rounded-full bg-[#C6A15B] px-8 py-3.5 text-base font-medium text-[#120D1B] transition hover:bg-[#E4C989]"
          >
            Reveal a new look
          </button>
        </div>

      </div>
    </main>
  );
}
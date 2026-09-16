"use client";

import { useState } from "react";
import { menswearProducts } from "../menswearProducts";

export default function Menswear() {
  const [search, setSearch] = useState("");

  const categories = [
    {
      name: "Footwear",
      description: "Sneakers, boots, loafers & more.",
      image: "/menfootcover.jpeg",
    },
    {
      name: "Upperwear",
      description: "Tees, shirts, polos & sweatshirts.",
      image: "/menupcover.jpeg",
    },
    {
      name: "Lowerwear",
      description: "Denim, cargos, trousers & more.",
      image: "/menlowcover.jpeg",
    },
    {
      name: "Accessories",
      description: "Watches, bags, caps & finishing touches.",
      image: "/menacccover.jpeg",
    },
    {
      name: "Outerwear",
      description: "Jackets, coats & statement layers.",
      image: "/menoutcover.jpeg",
    },
  ];

  const legacyProducts = [
    {
      name: "Black Solid Ankle-High Shaft Chelsea Boots",
      category: "Footwear",
      image: "/menfoot5.jpeg",
      keywords: "black chelsea boots solid",
    },
    {
      name: "Vintage Black Runners",
      category: "Footwear",
      price: "₹1,199",
      keywords: "black runners sneakers shoes vintage sporty streetwear",
    },
    {
      name: "Retro Court Sneakers",
      category: "Footwear",
      price: "₹999",
      keywords: "white sneakers shoes retro court casual classic",
    },
    {
      name: "Leather Chelsea Boots",
      category: "Footwear",
      price: "₹1,499",
      image:
        "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=85",
      keywords: "black leather boots chelsea formal classic smart",
    },
    {
      name: "Classic Brown Loafers",
      category: "Footwear",
      price: "₹1,299",
      keywords: "brown loafers shoes leather formal classic smart",
    },
    {
      name: "Everyday Black Sneakers",
      category: "Footwear",
      price: "₹1,099",
      keywords: "black sneakers shoes everyday casual minimal",
    },

    {
      name: "Classic White T-Shirt",
      category: "Upperwear",
      price: "₹599",
      keywords: "white t shirt tshirt cotton classic basic casual minimal",
    },
    {
      name: "Oversized Black T-Shirt",
      category: "Upperwear",
      price: "₹699",
      keywords: "black t shirt tshirt oversized cotton relaxed streetwear",
    },
    {
      name: "Relaxed Blue Shirt",
      category: "Upperwear",
      price: "₹899",
      keywords: "blue shirt relaxed casual cotton everyday",
    },
    {
      name: "Classic Polo",
      category: "Upperwear",
      price: "₹749",
      keywords: "polo shirt classic cotton smart casual",
    },
    {
      name: "Relaxed Cream Shirt",
      category: "Upperwear",
      price: "₹999",
      keywords: "cream shirt relaxed cotton neutral casual minimal",
    },
    {
      name: "Minimal Grey Sweatshirt",
      category: "Upperwear",
      price: "₹1,099",
      keywords: "grey sweatshirt minimal cotton relaxed casual winter",
    },

    {
      name: "Classic Blue Jeans",
      category: "Lowerwear",
      price: "₹899",
      keywords: "blue jeans denim classic straight casual everyday",
    },
    {
      name: "Relaxed Black Jeans",
      category: "Lowerwear",
      price: "₹999",
      keywords: "black jeans denim relaxed casual streetwear",
    },
    {
      name: "Straight Fit Beige Trousers",
      category: "Lowerwear",
      price: "₹1,099",
      keywords: "beige trousers straight fit formal smart casual neutral",
    },
    {
      name: "Olive Cargo Pants",
      category: "Lowerwear",
      price: "₹1,199",
      keywords: "olive cargo pants green utility relaxed streetwear",
    },
    {
      name: "Classic Grey Trousers",
      category: "Lowerwear",
      price: "₹949",
      keywords: "grey trousers classic formal smart neutral",
    },
    {
      name: "Relaxed Cream Pants",
      category: "Lowerwear",
      price: "₹1,049",
      keywords: "cream pants relaxed neutral casual minimal",
    },

    {
      name: "Classic Leather Watch",
      category: "Accessories",
      price: "₹899",
      keywords: "leather watch brown black classic formal accessory",
    },
    {
      name: "Minimal Black Backpack",
      category: "Accessories",
      price: "₹1,099",
      keywords: "black backpack minimal bag everyday college casual",
    },
    {
      name: "Classic Sunglasses",
      category: "Accessories",
      price: "₹699",
      keywords: "sunglasses black classic accessory summer",
    },
    {
      name: "Leather Belt",
      category: "Accessories",
      price: "₹499",
      keywords: "leather belt black brown formal classic accessory",
    },
    {
      name: "Everyday Cap",
      category: "Accessories",
      price: "₹399",
      keywords: "cap black casual everyday streetwear accessory",
    },
    {
      name: "Classic Crossbody Bag",
      category: "Accessories",
      price: "₹799",
      keywords: "crossbody bag black brown casual everyday accessory",
    },

    {
      name: "Classic Denim Jacket",
      category: "Outerwear",
      price: "₹1,299",
      keywords: "denim jacket blue classic vintage casual streetwear",
    },
    {
      name: "Black Bomber Jacket",
      category: "Outerwear",
      price: "₹1,499",
      keywords: "black bomber jacket streetwear casual winter",
    },
    {
      name: "Classic Brown Jacket",
      category: "Outerwear",
      price: "₹1,399",
      keywords: "brown jacket leather classic vintage smart casual",
    },
    {
      name: "Relaxed Overshirt",
      category: "Outerwear",
      price: "₹999",
      keywords: "overshirt relaxed shirt casual cotton layering",
    },
    {
      name: "Minimal Puffer Jacket",
      category: "Outerwear",
      price: "₹1,599",
      keywords: "puffer jacket black winter minimal casual",
    },
    {
      name: "Classic Wool Coat",
      category: "Outerwear",
      price: "₹1,799",
      keywords: "wool coat black brown winter formal classic smart",
    },
  ];

  const products = menswearProducts;

  const normalizedSearch = search.toLowerCase().trim();

  const matchingProducts = normalizedSearch
    ? products.filter((product) => {
        const searchableText = `
          ${product.name}
          ${product.category}
          ${product.keywords}
        `.toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
    : [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09040f] px-6 py-14 text-[#f7efff]">

      {/* Ambient Russian Violet glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#32174D] opacity-50 blur-[130px]" />

      <div className="pointer-events-none absolute right-[-120px] top-[35%] h-[500px] w-[500px] rounded-full bg-[#6d2394] opacity-25 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-150px] left-[35%] h-[400px] w-[400px] rounded-full bg-[#a21caf] opacity-20 blur-[140px]" />

      {/* Cyber grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(180,100,255,0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,100,255,0.22) 1px, transparent 1px)
          `,
          backgroundSize: "55px 55px",
          maskImage:
            "linear-gradient(to bottom, black 0%, transparent 85%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 85%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Top HUD */}

        {/* Header */}
        <div className="mb-10">

          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-[#a855f7]" />

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#c084fc]">
              THRIFTMATCH / MENSWEAR
            </p>

            <span className="h-px flex-1 bg-gradient-to-r from-[#a855f7] to-transparent" />
          </div>

          <div className="relative">
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              <span className="bg-gradient-to-r from-white via-[#e9d5ff] to-[#c084fc] bg-clip-text text-transparent">
                Menswear.
              </span>
            </h1>

            {/* Purple → Gold accent */}
            <div className="mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-[#7e22ce] via-[#c6a15b] to-transparent shadow-[0_0_18px_rgba(198,161,91,0.55)]" />
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9a7c7]">
            Build your look from timeless essentials, vintage finds and
            standout pieces.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-14">

          <form
            action="/marketplace/search"
            method="get"
            className="group relative flex w-full items-center overflow-hidden rounded-2xl border border-[#5b3180] bg-[#160b20]/90 shadow-[0_0_30px_rgba(126,34,206,0.12)] backdrop-blur-xl transition duration-300 focus-within:border-[#c6a15b] focus-within:shadow-[0_0_35px_rgba(168,85,247,0.25)]"
          >

            {/* Search scan line */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c6a15b] to-transparent opacity-0 transition duration-500 group-focus-within:opacity-100" />

            <div className="flex h-14 w-14 shrink-0 items-center justify-center border-r border-[#32174D] text-[#c6a15b]">
              <span aria-hidden="true" className="text-xl">
                ⌕
              </span>
            </div>

            <input
              type="text"
              name="query"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search men's fashion..."
              className="min-w-0 flex-1 bg-transparent px-5 py-5 text-lg text-[#f7efff] outline-none placeholder:text-[#705a7f]"
            />

            <input type="hidden" name="gender" value="menswear" />

            <button
              type="submit"
              aria-label="Search menswear"
              title="Search"
              className="mr-2 shrink-0 rounded-xl border border-[#8b6b38] bg-[#32174D] px-5 py-3 text-sm font-bold text-[#f3e8ff] shadow-[0_0_18px_rgba(126,34,206,0.25)] transition duration-300 hover:border-[#c6a15b] hover:bg-[#4a3150] hover:shadow-[0_0_25px_rgba(198,161,91,0.25)]"
            >
              SEARCH
            </button>
          </form>

          {/* Search dropdown */}
          {search.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-[#5b3180] bg-[#13091b]/95 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_35px_rgba(126,34,206,0.15)] backdrop-blur-2xl">

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c6a15b] to-transparent" />

              {matchingProducts.length > 0 ? (
                <div className="p-3">

                  <p className="px-4 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8b6aa5]">
                    Related Men's Searches
                  </p>

                  {matchingProducts.slice(0, 8).map((product) => (
                    <a
                      key={product.name}
                      href={`/marketplace/search?query=${encodeURIComponent(
                        product.name
                      )}&gender=menswear`}
                      className="group flex items-center gap-4 rounded-xl border border-transparent px-5 py-4 transition duration-200 hover:border-[#4c1d68] hover:bg-[#24112f]"
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt=""
                          className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-[#4c1d68] transition duration-300 group-hover:ring-[#c6a15b]"
                        />

                        <div className="absolute inset-0 rounded-lg bg-[#a855f7]/10 opacity-0 transition group-hover:opacity-100" />
                      </div>

                      <div>
                        <p className="font-bold text-[#f7efff] transition group-hover:text-[#d8b4fe]">
                          {product.name}
                        </p>

                        <p className="mt-1 text-sm text-[#9278a5]">
                          {product.category}
                        </p>
                      </div>

                      <span className="ml-auto text-[#6b3d87] transition group-hover:translate-x-1 group-hover:text-[#c6a15b]">
                        →
                      </span>
                    </a>
                  ))}

                </div>
              ) : (
                <div className="p-6">
                  <p className="font-bold">
                    No matching men's products found.
                  </p>

                  <p className="mt-2 text-sm text-[#9278a5]">
                    Try a color, style, material, category or product name.
                  </p>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Category HUD */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b6aa5]">
              AVAILABLE CATEGORIES
            </p>

            <div className="mt-2 h-px w-20 bg-gradient-to-r from-[#a855f7] to-[#c6a15b]" />
          </div>

          <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#68477d] sm:block">
            05 MODULES DETECTED
          </p>
        </div>

        {/* Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {categories.map((category, index) => (
            <a
              key={category.name}
              href={`/marketplace/menswear/${category.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-[2rem] border border-[#45245d] bg-[#140a1c]/90 shadow-[0_15px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-[#a855f7] hover:shadow-[0_25px_70px_rgba(126,34,206,0.3)]"
            >

              {/* Neon edge */}
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-transparent transition duration-500 group-hover:border-[#c6a15b]/35" />

              {/* Category number */}
              <div className="absolute left-5 top-5 z-30 rounded-full border border-[#c6a15b]/50 bg-[#13091b]/80 px-3 py-1.5 text-[9px] font-black tracking-[0.2em] text-[#d6b56f] backdrop-blur-md">
                0{index + 1}
              </div>

              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-[#32174D]">

                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110 group-hover:rotate-[1deg]"
                />

                {/* Purple image wash */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#140a1c] via-transparent to-[#32174D]/20 opacity-70 transition duration-500 group-hover:opacity-50" />

                {/* Scanlines */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.08) 5px)",
                  }}
                />

                {/* Hover glow */}
                <div className="absolute inset-0 bg-[#a855f7]/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                {/* Image HUD */}
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
                  <span>TM // {category.name.toUpperCase()}</span>

                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c6a15b] shadow-[0_0_10px_#c6a15b]" />
                    READY
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h2 className="text-3xl font-black tracking-tight transition duration-300 group-hover:text-[#d8b4fe]">
                      {category.name}
                    </h2>

                    <p className="mt-3 text-[#9278a5]">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#4c1d68] text-[#8b5cf6] transition duration-500 group-hover:rotate-45 group-hover:border-[#c6a15b] group-hover:bg-[#32174D] group-hover:text-[#e0bd73]">
                    ↗
                  </div>

                </div>

                <div className="mt-6 flex items-center justify-between">

                  <div className="flex gap-1">
                    <span className="h-1 w-5 rounded-full bg-[#7e22ce]" />
                    <span className="h-1 w-2 rounded-full bg-[#c6a15b]" />
                    <span className="h-1 w-2 rounded-full bg-[#45245d]" />
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#76518b]">
                    ACCESS MODULE
                  </span>

                </div>

                <div className="mt-5 inline-flex rounded-full border border-[#5b3180] px-5 py-2.5 text-sm font-bold text-[#d8b4fe] transition duration-300 group-hover:border-[#c6a15b] group-hover:bg-[#32174D] group-hover:text-[#f1d28a] group-hover:shadow-[0_0_20px_rgba(198,161,91,0.18)]">
                  Explore →
                </div>

              </div>
            </a>
          ))}

        </div>

        {/* Bottom HUD */}
        <div className="mt-14 flex flex-col gap-3 border-t border-[#32174D] pt-5 text-[9px] font-bold uppercase tracking-[0.25em] text-[#65477a] sm:flex-row sm:items-center sm:justify-between">

          <span>THRIFTMATCH // MENSWEAR_DATABASE</span>

          <span className="flex items-center gap-2 text-[#927b56]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c6a15b] shadow-[0_0_10px_#c6a15b]" />
            CONNECTION_STABLE
          </span>

          <span>TM_OS v1.0</span>

        </div>

      </div>
    </main>
  );
}
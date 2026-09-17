"use client";

import { useState } from "react";
import { womenswearProducts } from "../womenswearProducts";

export default function Womenswear() {
  const [search, setSearch] = useState("");

  const categories = [
    {
      name: "Footwear",
      description: "Sneakers, heels, boots & more.",
      image: "/womenfootcover.jpeg",
    },
    {
      name: "Upperwear",
      description: "Tops, shirts, blouses & knitwear.",
      image: "/womenupcover.jpeg",
    },
    {
      name: "Lowerwear",
      description: "Jeans, skirts, trousers & more.",
      image: "/womenlowcover.jpeg",
    },
    {
      name: "Accessories",
      description: "Bags, jewellery, watches & finishing touches.",
      image: "/womenaccover.jpeg",
    },
    {
      name: "Outerwear",
      description: "Jackets, coats & statement layers.",
      image: "/womenoutcover.jpeg",
    },
  ];

  const filteredSuggestions = search.trim()
    ? womenswearProducts.filter((product) =>
        `${product.name} ${product.category} ${product.keywords}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
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
        <div className="mb-8 flex items-center justify-between border-b border-[#32174D] pb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f09acb]">
          

          

          
        </div>

        {/* Header */}
        <div className="mb-10">

          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-[#a855f7]" />

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#c084fc]">
              THRIFTMATCH / WOMENSWEAR
            </p>

            <span className="h-px flex-1 bg-gradient-to-r from-[#a855f7] to-transparent" />
          </div>

          <div className="relative">
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              <span className="bg-gradient-to-r from-white via-[#f5d5e8] to-[#f09acb] bg-clip-text text-transparent">
                Womenswear.
              </span>
            </h1>

            {/* Purple → Pink accent */}
            <div className="mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-[#7e22ce] via-[#f09acb] to-transparent shadow-[0_0_18px_rgba(240,154,203,0.55)]" />
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9a7c7]">
            Discover expressive pieces, timeless finds and looks made to
            stand out.
          </p>
        </div>

        {/* Womenswear Search */}
        <div className="relative mb-14">

         
          <form
            action="/marketplace/search"
            method="get"
            className="group relative flex w-full items-center overflow-hidden rounded-2xl border border-[#5b3180] bg-[#160b20]/90 shadow-[0_0_30px_rgba(126,34,206,0.12)] backdrop-blur-xl transition duration-300 focus-within:border-[#f09acb] focus-within:shadow-[0_0_35px_rgba(240,154,203,0.22)]"
          >

            {/* Search scan line */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f09acb] to-transparent opacity-0 transition duration-500 group-focus-within:opacity-100" />

            <div className="flex h-14 w-14 shrink-0 items-center justify-center border-r border-[#32174D] text-[#f09acb]">
              <span aria-hidden="true" className="text-xl">
                ⌕
              </span>
            </div>

            <input
              type="text"
              name="query"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search women's fashion..."
              className="min-w-0 flex-1 bg-transparent px-5 py-5 text-lg text-[#f7efff] outline-none placeholder:text-[#705a7f]"
            />

            <input type="hidden" name="gender" value="womenswear" />

            <button
              type="submit"
              aria-label="Search womenswear"
              title="Search"
              className="mr-2 shrink-0 rounded-xl border border-[#9d527d] bg-[#32174D] px-5 py-3 text-sm font-bold text-[#f8e8f1] shadow-[0_0_18px_rgba(126,34,206,0.25)] transition duration-300 hover:border-[#f09acb] hover:bg-[#4a1f4b] hover:shadow-[0_0_25px_rgba(240,154,203,0.25)]"
            >
              SEARCH
            </button>
          </form>

          {/* Search dropdown */}
          {search.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-[#5b3180] bg-[#13091b]/95 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_35px_rgba(126,34,206,0.15)] backdrop-blur-2xl">

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#f09acb] to-transparent" />

              {filteredSuggestions.length > 0 ? (
                <div className="p-3">

                  <p className="px-4 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8b6aa5]">
                    Related Women's Searches
                  </p>

                  {filteredSuggestions.slice(0, 8).map((product) => (
                    <a
                      key={product.name}
                      href={`/marketplace/search?query=${encodeURIComponent(
                        product.name
                      )}&gender=womenswear`}
                      className="group flex items-center gap-4 rounded-xl border border-transparent px-5 py-4 transition duration-200 hover:border-[#4c1d68] hover:bg-[#24112f]"
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt=""
                          className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-[#4c1d68] transition duration-300 group-hover:ring-[#f09acb]"
                        />

                        <div className="absolute inset-0 rounded-lg bg-[#ec4899]/10 opacity-0 transition group-hover:opacity-100" />
                      </div>

                      <div>
                        <p className="font-bold text-[#f7efff] transition group-hover:text-[#f5b4d7]">
                          {product.name}
                        </p>

                        <p className="mt-1 text-sm text-[#9278a5]">
                          {product.category}
                        </p>
                      </div>

                      <span className="ml-auto text-[#6b3d87] transition group-hover:translate-x-1 group-hover:text-[#f09acb]">
                        →
                      </span>
                    </a>
                  ))}

                </div>
              ) : (
                <div className="p-6">
                  <p className="font-bold">
                    No related women's searches found.
                  </p>

                  <p className="mt-2 text-sm text-[#9278a5]">
                    Try tops, dresses, jeans, sneakers, jackets or accessories.
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

            <div className="mt-2 h-px w-20 bg-gradient-to-r from-[#a855f7] to-[#f09acb]" />
          </div>

          

        </div>

        {/* Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {categories.map((category, index) => (
            <a
              key={category.name}
              href={`/marketplace/womenswear/${category.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-[2rem] border border-[#45245d] bg-[#140a1c]/90 shadow-[0_15px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-[#a855f7] hover:shadow-[0_25px_70px_rgba(126,34,206,0.3)]"
            >

              {/* Neon edge */}
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-transparent transition duration-500 group-hover:border-[#f09acb]/35" />

              {/* Category number */}
              <div className="absolute left-5 top-5 z-30 rounded-full border border-[#f09acb]/50 bg-[#13091b]/80 px-3 py-1.5 text-[9px] font-black tracking-[0.2em] text-[#f3afd0] backdrop-blur-md">
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
                <div className="absolute inset-0 bg-[#ec4899]/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                {/* Image HUD */}
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">

                  

                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f09acb] shadow-[0_0_10px_#f09acb]" />
                    READY
                  </span>

                </div>
              </div>

              {/* Content */}
              <div className="p-7">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h2 className="text-3xl font-black tracking-tight transition duration-300 group-hover:text-[#f5b4d7]">
                      {category.name}
                    </h2>

                    <p className="mt-3 text-[#9278a5]">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#4c1d68] text-[#8b5cf6] transition duration-500 group-hover:rotate-45 group-hover:border-[#f09acb] group-hover:bg-[#32174D] group-hover:text-[#f5b4d7]">
                    ↗
                  </div>

                </div>

                <div className="mt-6 flex items-center justify-between">

                  <div className="flex gap-1">
                    <span className="h-1 w-5 rounded-full bg-[#7e22ce]" />
                    <span className="h-1 w-2 rounded-full bg-[#f09acb]" />
                    <span className="h-1 w-2 rounded-full bg-[#45245d]" />
                  </div>

                  

                </div>

                <div className="mt-5 inline-flex rounded-full border border-[#5b3180] px-5 py-2.5 text-sm font-bold text-[#d8b4fe] transition duration-300 group-hover:border-[#f09acb] group-hover:bg-[#32174D] group-hover:text-[#f5b4d7] group-hover:shadow-[0_0_20px_rgba(240,154,203,0.2)]">
                  Explore →
                </div>

              </div>
            </a>
          ))}

        </div>

        {/* Bottom HUD */}
        <div className="mt-14 flex flex-col gap-3 border-t border-[#32174D] pt-5 text-[9px] font-bold uppercase tracking-[0.25em] text-[#65477a] sm:flex-row sm:items-center sm:justify-between">

     

          

          

        </div>

      </div>
    </main>
  );
}
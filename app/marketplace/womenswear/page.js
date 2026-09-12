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
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#d19a9a]">
            THRIFTMATCH / WOMENSWEAR
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Womenswear.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
            Discover expressive pieces, timeless finds and looks made to
            stand out.
          </p>
        </div>

        {/* Womenswear Search */}
        <div className="relative mb-12">
          <form action="/marketplace/search" method="get">
            <input
              type="text"
              name="query"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search women's fashion..."
              className="w-full rounded-full border border-[#5a5348] bg-[#24221e] px-7 py-5 text-lg text-[#f5f0e8] outline-none transition placeholder:text-[#777168] focus:border-[#d19a9a]"
            />
            <input type="hidden" name="gender" value="womenswear" />
          </form>

          {search.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-[1.5rem] border border-[#3b3832] bg-[#24221e] shadow-2xl">

              {filteredSuggestions.length > 0 ? (
                <div className="p-3">

                  <p className="px-4 pb-2 pt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#777168]">
                    Related Women's Searches
                  </p>

                  {filteredSuggestions.slice(0, 8).map((product) => (
                    <a
                      key={product.name}
                      href={`/marketplace/search?query=${encodeURIComponent(
                        product.name
                      )}&gender=womenswear`}
                      className="flex items-center gap-4 rounded-xl px-5 py-4 transition hover:bg-[#302d28]"
                    >
                      <img
                        src={product.image}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />

                      <div>
                        <p className="font-bold">
                          {product.name}
                        </p>

                        <p className="mt-1 text-sm text-[#aaa399]">
                          {product.category}
                        </p>
                      </div>
                    </a>
                  ))}

                </div>
              ) : (
                <div className="p-6">
                  <p className="font-bold">
                    No related women's searches found.
                  </p>

                  <p className="mt-2 text-sm text-[#aaa399]">
                    Try tops, dresses, jeans, sneakers, jackets or accessories.
                  </p>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`/marketplace/womenswear/${category.name.toLowerCase()}`}
              className="group overflow-hidden rounded-[2rem] border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#d19a9a] hover:shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-7">
                <h2 className="text-3xl font-black">
                  {category.name}
                </h2>

                <p className="mt-3 text-[#aaa399]">
                  {category.description}
                </p>

                <div className="mt-6 inline-flex rounded-full border border-[#5a5348] px-5 py-2.5 text-sm font-bold transition group-hover:bg-[#d19a9a] group-hover:text-[#171512]">
                  Explore →
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </main>
  );
}
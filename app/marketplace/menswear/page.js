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
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
            THRIFTMATCH / MENSWEAR
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Menswear.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
            Build your look from timeless essentials, vintage finds and
            standout pieces.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-12">
          <form
            action="/marketplace/search"
            method="get"
            className="flex w-full items-center overflow-hidden rounded-full border border-[#5a5348] bg-[#24221e] transition focus-within:border-[#c6a15b]"
          >
            <input
              type="text"
              name="query"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search men's fashion..."
              className="min-w-0 flex-1 bg-transparent px-6 py-5 text-lg text-[#f5f0e8] outline-none placeholder:text-[#777168]"
            />
            <input type="hidden" name="gender" value="menswear" />
            <button
              type="submit"
              aria-label="Search menswear"
              title="Search"
              className="mr-2 shrink-0 rounded-full bg-[#c6a15b] px-5 py-3 text-sm font-bold text-[#171512] transition hover:bg-[#dfbd78]"
            >
              <span aria-hidden="true" className="text-lg leading-none">🔍</span>
            </button>
          </form>

          {search.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-[1.5rem] border border-[#3b3832] bg-[#24221e] shadow-2xl">

              {matchingProducts.length > 0 ? (
                <div className="p-3">

                  <p className="px-4 pb-2 pt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#777168]">
                    Related Men's Searches
                  </p>

                  {matchingProducts.slice(0, 8).map((product) => (
                    <a
                      key={product.name}
                      href={`/marketplace/search?query=${encodeURIComponent(
                        product.name
                      )}&gender=menswear`}
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
                    No matching men's products found.
                  </p>

                  <p className="mt-2 text-sm text-[#aaa399]">
                    Try a color, style, material, category or product name.
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
              href={`/marketplace/menswear/${category.name.toLowerCase()}`}
              className="group overflow-hidden rounded-[2rem] border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#c6a15b] hover:shadow-2xl"
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

                <div className="mt-6 inline-flex rounded-full border border-[#5a5348] px-5 py-2.5 text-sm font-bold transition group-hover:bg-[#c6a15b] group-hover:text-[#171512]">
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
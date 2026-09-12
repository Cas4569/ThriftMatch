"use client";

import { useEffect, useState } from "react";

const clothes = [
  {
    name: "Classic White T-Shirt",
    category: "Men's Upperwear",
    price: "₹599",
    image: "/menupcover.jpeg",
  },
  {
    name: "Classic White Top",
    category: "Women's Upperwear",
    price: "₹599",
    image: "/womenupcover.jpeg",
  },
  {
    name: "Classic Blue Jeans",
    category: "Men's Lowerwear",
    price: "₹899",
    image: "/menlowcover.jpeg",
  },
  {
    name: "Relaxed Black Jeans",
    category: "Women's Lowerwear",
    price: "₹999",
    image: "/womenlowcover.jpeg",
  },
  {
    name: "Classic Denim Jacket",
    category: "Men's Outerwear",
    price: "₹1,299",
    image: "/menoutcover.jpeg",
  },
  {
    name: "Classic Denim Jacket",
    category: "Women's Outerwear",
    price: "₹1,299",
    image: "/womenoutcover.jpeg",
  },
  {
    name: "Classic White Sneakers",
    category: "Men's Footwear",
    price: "₹899",
    image: "/menfootcover.jpeg",
  },
  {
    name: "Minimal Black Sneakers",
    category: "Women's Footwear",
    price: "₹1,099",
    image: "/womenfootcover.jpeg",
  },
  {
    name: "Classic Leather Watch",
    category: "Men's Accessories",
    price: "₹899",
    image: "/menacccover.jpeg",
  },
  {
    name: "Classic Black Handbag",
    category: "Women's Accessories",
    price: "₹1,099",
    image: "/womenaccover.jpeg",
  },
];

export default function Discover() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const shuffled = [...clothes].sort(() => Math.random() - 0.5);
    setFeed(shuffled);
  }, []);

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
            THRIFTMATCH / DISCOVER
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Discover.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
            Explore fashion without limits. Men's, women's, vintage,
            streetwear and everything in between.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {feed.map((item, index) => (
            <div
              key={`${item.name}-${item.category}-${index}`}
              className="group overflow-hidden rounded-[2rem] border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#c6a15b] hover:shadow-2xl"
            >
              <div className="relative h-[380px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c6a15b]">
                  {item.category}
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {item.name}
                </h2>

                <p className="mt-3 text-lg font-semibold">
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Discover() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const snapshot = await getDocs(collection(db, "products"));

        const products = snapshot.docs.map((productSnapshot) => ({
          id: productSnapshot.id,
          ...productSnapshot.data(),
        }));

        for (let index = products.length - 1; index > 0; index -= 1) {
          const randomIndex = Math.floor(Math.random() * (index + 1));

          [products[index], products[randomIndex]] = [
            products[randomIndex],
            products[index],
          ];
        }

        setFeed(products.slice(0, 27));
      } catch (loadError) {
        setError("We couldn't load discover products right now.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0d0807] px-6 py-14 text-[#f4ece8]">

      {/* Ambient copper glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#6b3f35] opacity-35 blur-[140px]" />

      <div className="pointer-events-none absolute right-[-150px] top-[30%] h-[500px] w-[500px] rounded-full bg-[#9A6051] opacity-15 blur-[160px]" />

      <div className="pointer-events-none absolute bottom-[-180px] left-[35%] h-[450px] w-[450px] rounded-full bg-[#4b2924] opacity-25 blur-[150px]" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(154,96,81,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(154,96,81,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage:
            "linear-gradient(to bottom, black 0%, transparent 85%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 85%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Top HUD */}
        <div className="mb-8 flex items-center justify-between border-b border-[#3b2723] pb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#9A6051]">

          

        </div>

        {/* Header */}
        <div className="mb-12">

          <div className="mb-4 flex items-center gap-3">

            <span className="h-px w-10 bg-[#9A6051]" />

            

            <span className="h-px flex-1 bg-gradient-to-r from-[#9A6051] to-transparent" />

          </div>

          <div className="relative">

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              <span className="bg-gradient-to-r from-white via-[#eadbd6] to-[#9A6051] bg-clip-text text-transparent">
                Discover.
              </span>
            </h1>

            {/* Copper accent */}
            <div className="mt-3 h-1 w-32 rounded-full bg-gradient-to-r from-[#633d34] via-[#9A6051] to-transparent shadow-[0_0_18px_rgba(154,96,81,0.4)]" />

          </div>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#a99892]">
            Explore fashion without limits. Men's, women's, vintage,
            streetwear and everything in between.
          </p>

        </div>

        {/* Feed HUD */}
        <div className="mb-6 flex items-end justify-between">

          <div>
            

            <div className="mt-2 h-px w-24 bg-gradient-to-r from-[#633d34] to-[#9A6051]" />
          </div>

          <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A6051] sm:block">
            {feed.length} PIECES IN FEED
          </p>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center gap-3 text-lg text-[#a99892]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#9A6051] shadow-[0_0_12px_#9A6051]" />
            Loading discover products...
          </div>

        ) : error ? (

          <div className="rounded-2xl border border-[#59352f] bg-[#1a0e0c] px-6 py-5 text-lg text-[#c98d7c]">
            {error}
          </div>

        ) : feed.length === 0 ? (

          <p className="text-lg text-[#a99892]">
            No products are available yet.
          </p>

        ) : (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {feed.map((item, index) => (
              <a
                key={item.id}
                href={`/marketplace/product/${item.id}`}
                className="group relative overflow-hidden rounded-[2rem] border border-[#3b2723] bg-[#170d0b]/90 shadow-[0_15px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-[#9A6051] hover:shadow-[0_25px_70px_rgba(154,96,81,0.18)]"
              >

                {/* Neon/copper edge */}
                <div className="pointer-events-none absolute inset-0 z-20 rounded-[2rem] border border-transparent transition duration-500 group-hover:border-[#9A6051]/40" />

                {/* Number */}
                <div className="absolute left-5 top-5 z-30 rounded-full border border-[#9A6051]/50 bg-[#100807]/85 px-3 py-1.5 text-[9px] font-black tracking-[0.2em] text-[#c48b7a] backdrop-blur-md">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Image */}
                <div className="relative h-[380px] overflow-hidden bg-[#2b1714]">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110 group-hover:rotate-[1deg]"
                  />

                  {/* Image gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#170d0b] via-transparent to-[#3b211c]/20 opacity-75 transition duration-500 group-hover:opacity-50" />

                  {/* Scanlines */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.07) 5px)",
                    }}
                  />

                  {/* Copper hover wash */}
                  <div className="absolute inset-0 bg-[#9A6051]/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                  {/* Image HUD */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">

                    

                  </div>

                </div>

                {/* Content */}
                <div className="p-7">

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9A6051]">
                    {item.category || item.subcategory || "Fashion"}
                  </p>

                  <h2 className="mt-3 text-2xl font-black tracking-tight transition duration-300 group-hover:text-[#c48b7a]">
                    {item.name}
                  </h2>

                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex gap-1">
                      <span className="h-1 w-5 rounded-full bg-[#633d34]" />
                      <span className="h-1 w-2 rounded-full bg-[#9A6051]" />
                      <span className="h-1 w-2 rounded-full bg-[#3b2723]" />
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#70544c]">
                      ITEM VERIFIED ✔️
                    </span>

                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4">

                    <p className="text-xl font-black text-[#b87967]">
                      {item.price}
                    </p>

                    <span className="rounded-full border border-[#59352f] px-5 py-2.5 text-sm font-bold text-[#b87967] transition duration-300 group-hover:border-[#9A6051] group-hover:bg-[#3b211c] group-hover:text-[#e0b0a1] group-hover:shadow-[0_0_20px_rgba(154,96,81,0.18)]">
                      View →
                    </span>

                  </div>

                </div>

              </a>
            ))}

          </div>

        )}

        {/* Bottom HUD */}
        <div className="mt-14 flex flex-col gap-3 border-t border-[#3b2723] pt-5 text-[9px] font-bold uppercase tracking-[0.25em] text-[#5f4740] sm:flex-row sm:items-center sm:justify-between">

          

          

        </div>

      </div>
    </main>
  );
}
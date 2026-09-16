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

        {loading ? (
          <p className="text-lg text-[#b9b2a7]">Loading discover products...</p>
        ) : error ? (
          <p className="text-lg text-[#d19a9a]">{error}</p>
        ) : feed.length === 0 ? (
          <p className="text-lg text-[#b9b2a7]">No products are available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feed.map((item) => (
              <a
                key={item.id}
                href={`/marketplace/product/${item.id}`}
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
                    {item.category || item.subcategory || "Fashion"}
                  </p>

                  <h2 className="mt-2 text-2xl font-black">{item.name}</h2>

                  <p className="mt-3 text-lg font-semibold">{item.price}</p>
                </div>
              </a>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
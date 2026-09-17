"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SearchResults() {
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";
  const gender = searchParams.get("gender") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const snapshot = await getDocs(
          collection(db, "products")
        );

        const allProducts = snapshot.docs.map(
          (productSnapshot) => ({
            id: productSnapshot.id,
            ...productSnapshot.data(),
          })
        );

        setProducts(allProducts);
      } catch (loadError) {
        console.error(
          "SEARCH PRODUCT LOAD ERROR:",
          loadError
        );

        setError(
          "We couldn't load products right now."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const normalizedQuery =
    query.toLowerCase().trim();

  const results = products.filter((product) => {
    const productGender = String(
      product.category || ""
    ).toLowerCase();

    const matchesGender = gender
      ? productGender === gender.toLowerCase()
      : true;

    const keywords = Array.isArray(
      product.keywords
    )
      ? product.keywords.join(" ")
      : product.keywords || "";

    const searchableText = `
      ${product.name || ""}
      ${product.category || ""}
      ${product.subcategory || ""}
      ${product.tag || ""}
      ${keywords}
      ${product.description || ""}
      ${product.color || ""}
      ${product.material || ""}
      ${product.brand || ""}
    `.toLowerCase();

    return (
      matchesGender &&
      searchableText.includes(
        normalizedQuery
      )
    );
  });

  return (
    <main className="min-h-screen bg-[#0f0616] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
          THRIFTMATCH / SEARCH
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          {query
            ? `"${query}"`
            : "Search"}
        </h1>

        {loading ? (
          <p className="mt-8 text-lg text-[#b9b2a7]">
            Loading products...
          </p>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/20 px-6 py-5 text-lg text-red-300">
            {error}
          </div>
        ) : (
          <>
            <p className="mt-5 text-lg text-[#b9b2a7]">
              {results.length}{" "}
              {results.length === 1
                ? "piece"
                : "pieces"}{" "}
              found across Menswear and
              Womenswear.
            </p>

            {results.length > 0 ? (
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {results.map(
                  (product) => (
                    <div
                      key={product.id}
                      className="group overflow-hidden rounded-[2rem] border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#c6a15b] hover:shadow-2xl"
                    >

                      {/* Product header */}
                      <div className="relative flex h-16 items-center justify-between border-b border-[#3b3832] px-6">

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#aaa399]">
                          {product.category ||
                            "THRIFTMATCH"}
                        </p>

                        <span className="rounded-full bg-[#171512] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#c6a15b]">
                          {product.subcategory ||
                            ""}
                        </span>

                      </div>

                      {/* Product content */}
                      <div className="p-7">

                        {product.tag && (
                          <p className="text-xs font-bold uppercase tracking-widest text-[#c6a15b]">
                            {product.tag}
                          </p>
                        )}

                        <div className="mt-3 flex items-center gap-4">

                          {product.image && (
                            <img
                              src={product.image}
                              alt={
                                product.name ||
                                "Product"
                              }
                              className="h-16 w-16 shrink-0 rounded-xl object-cover"
                            />
                          )}

                          <h2 className="text-2xl font-black">
                            {product.name}
                          </h2>

                        </div>

                        {/* View button */}
                        <div className="mt-7 flex justify-end">

                          <a
                            href={`/marketplace/product/${product.id}`}
                            className="rounded-full border border-[#5a5348] px-5 py-2.5 text-sm font-bold transition hover:bg-[#c6a15b] hover:text-[#171512]"
                          >
                            View →
                          </a>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="mt-14 rounded-[2rem] border border-[#3b3832] bg-[#24221e] p-10">

                <h2 className="text-2xl font-black">
                  No matching pieces found.
                </h2>

                <p className="mt-3 text-[#aaa399]">
                  Try another search such as
                  white t-shirts, sneakers,
                  jeans or jackets.
                </p>

              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}
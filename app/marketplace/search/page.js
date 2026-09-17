"use client";

import { useSearchParams } from "next/navigation";
import { menswearProducts } from "../menswearProducts";
import { womenswearProducts } from "../womenswearProducts";

function createProductId(name) {
  return encodeURIComponent(name);
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const gender = searchParams.get("gender") || "";

  const legacyProducts = [
    {
      name: "Black Solid Ankle-High Shaft Chelsea Boots",
      price: "₹1,299",
      gender: "Menswear",
      category: "Footwear",
      tag: "",
      image: "/menfoot5.jpeg",
      keywords: "black chelsea boots solid ankle high shaft footwear",
    },
    {
      name: "Leather Chelsea Boots",
      price: "₹1,499",
      gender: "Menswear",
      category: "Footwear",
      tag: "",
      image:
        "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=85",
      keywords: "black leather boots chelsea formal classic smart footwear",
    },
    {
      name: "Classic White T-Shirt",
      price: "₹599",
      gender: "Menswear",
      category: "Upperwear",
      tag: "",
      image: "",
      keywords: "white t shirt tshirt cotton classic basic casual minimal",
    },
    {
      name: "Oversized Black T-Shirt",
      price: "₹699",
      gender: "Menswear",
      category: "Upperwear",
      tag: "",
      image: "",
      keywords: "black t shirt tshirt oversized cotton relaxed streetwear",
    },
    {
      name: "Classic White Top",
      price: "₹599",
      gender: "Womenswear",
      category: "Upperwear",
      tag: "",
      image: "",
      keywords: "white top womenswear",
    },
    {
      name: "Soft Pink Shirt",
      price: "₹999",
      gender: "Womenswear",
      category: "Upperwear",
      tag: "",
      image: "",
      keywords: "pink shirt womenswear",
    },
    {
      name: "Classic White Sneakers",
      price: "₹899",
      gender: "Menswear",
      category: "Footwear",
      tag: "",
      image: "",
      keywords: "white sneakers shoes retro court casual classic",
    },
    {
      name: "Minimal Black Sneakers",
      price: "₹1,099",
      gender: "Womenswear",
      category: "Footwear",
      tag: "",
      image: "",
      keywords: "black sneakers shoes womenswear",
    },
    {
      name: "Classic Blue Jeans",
      price: "₹899",
      gender: "Menswear",
      category: "Lowerwear",
      tag: "",
      image: "",
      keywords: "blue jeans denim classic straight casual everyday",
    },
    {
      name: "Relaxed Black Jeans",
      price: "₹999",
      gender: "Womenswear",
      category: "Lowerwear",
      tag: "",
      image: "",
      keywords: "black jeans denim womenswear",
    },
    {
      name: "Classic Denim Jacket",
      price: "₹1,299",
      gender: "Menswear",
      category: "Outerwear",
      tag: "",
      image: "",
      keywords: "denim jacket blue classic vintage casual streetwear",
    },
    {
      name: "Black Bomber Jacket",
      price: "₹1,499",
      gender: "Menswear",
      category: "Outerwear",
      tag: "",
      image: "",
      keywords: "black bomber jacket streetwear casual winter",
    },
    {
      name: "Classic Brown Jacket",
      price: "₹1,399",
      gender: "Womenswear",
      category: "Outerwear",
      tag: "",
      image: "",
      keywords:
        "brown jacket leather classic vintage smart casual womenswear",
    },
    {
      name: "Classic Black Handbag",
      price: "₹1,099",
      gender: "Womenswear",
      category: "Accessories",
      tag: "",
      image: "",
      keywords: "black handbag womenswear accessories",
    },
  ];

  const products = [
    ...menswearProducts.map((product) => ({
      ...product,
      gender: "Menswear",
      tag: "",
    })),
    ...womenswearProducts.map((product) => ({
      ...product,
      gender: "Womenswear",
      tag: "",
    })),
  ];

  const normalizedQuery = query.toLowerCase().trim();

  const results = products.filter((product) => {
    const matchesGender = gender
      ? product.gender.toLowerCase() === gender.toLowerCase()
      : true;

    const searchableText = `
      ${product.name}
      ${product.gender}
      ${product.category}
      ${product.tag}
      ${product.keywords}
    `.toLowerCase();

    return matchesGender && searchableText.includes(normalizedQuery);
  });

  return (
    <main className="min-h-screen bg-[#0f0616] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
          THRIFTMATCH / SEARCH
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          {query ? `"${query}"` : "Search"}
        </h1>

        <p className="mt-5 text-lg text-[#b9b2a7]">
          {results.length}{" "}
          {results.length === 1 ? "piece" : "pieces"} found across
          Menswear and Womenswear.
        </p>

        {results.length > 0 ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {results.map((product, index) => (
              <div
                key={`${product.name}-${index}`}
                className="group overflow-hidden rounded-[2rem] border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#c6a15b] hover:shadow-2xl"
              >

                <div className="relative flex h-16 items-center justify-between border-b border-[#3b3832] px-6">

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#aaa399]">
                    {product.gender}
                  </p>

                  <span className="rounded-full bg-[#171512] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#c6a15b]">
                    {product.category}
                  </span>

                </div>

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
                        alt={product.name}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                    )}

                    <h2 className="text-2xl font-black">
                      {product.name}
                    </h2>

                  </div>

                  <div className="mt-7 flex justify-end">

                    <a
                      href={`/marketplace/product/${createProductId(
                        product.name
                      )}`}
                      className="rounded-full border border-[#5a5348] px-5 py-2.5 text-sm font-bold transition hover:bg-[#c6a15b] hover:text-[#171512]"
                    >
                      View →
                    </a>

                  </div>

                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="mt-14 rounded-[2rem] border border-[#3b3832] bg-[#24221e] p-10">

            <h2 className="text-2xl font-black">
              No matching pieces found.
            </h2>

            <p className="mt-3 text-[#aaa399]">
              Try another search such as white t-shirts, sneakers,
              jeans or jackets.
            </p>

          </div>
        )}

      </div>
    </main>
  );
}
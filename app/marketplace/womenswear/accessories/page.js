export default function WomenswearAccessories() {
  const products = [
    {
      name: "Minimal Gold Watch",
      price: "₹899",
      tag: "TOP RATED",
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Classic Black Handbag",
      price: "₹1,099",
      tag: "TRENDING",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Minimal Sunglasses",
      price: "₹699",
      tag: "BEST SELLER",
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Classic Leather Belt",
      price: "₹499",
      tag: "",
      image:
        "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Everyday Shoulder Bag",
      price: "₹799",
      tag: "NEW FIND",
      image:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Minimal Hair Clip Set",
      price: "₹399",
      tag: "",
      image:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#d19a9a]">
          THRIFTMATCH / WOMENSWEAR / ACCESSORIES
        </p>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Accessories.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
              Watches, bags, sunglasses and finishing touches curated for effortless style.
            </p>
          </div>

          <p className="text-sm font-bold uppercase tracking-widest text-[#aaa399]">
            6 pieces
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.name}
              className="group overflow-hidden rounded-[2rem] border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#d19a9a] hover:shadow-2xl"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {product.tag && (
                  <div className="absolute left-4 top-4 rounded-full bg-[#171512]/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f5f0e8] backdrop-blur">
                    {product.tag}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-black">
                  {product.name}
                </h2>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xl font-bold text-[#d19a9a]">
                    {product.price}
                  </p>

                  <button className="rounded-full border border-[#5a5348] px-5 py-2.5 text-sm font-bold transition hover:bg-[#d19a9a] hover:text-[#171512]">
                    View →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
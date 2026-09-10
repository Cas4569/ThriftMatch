export default function WomenswearFootwear() {
  const products = [
    {
      name: "Classic White Sneakers",
      price: "₹899",
      tag: "TRENDING",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Minimal Black Sneakers",
      price: "₹1,099",
      tag: "TOP RATED",
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Classic Beige Loafers",
      price: "₹1,199",
      tag: "BEST SELLER",
      image:
        "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Retro Court Sneakers",
      price: "₹999",
      tag: "",
      image:
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Classic Brown Boots",
      price: "₹1,499",
      tag: "NEW FIND",
      image:
        "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Everyday Black Flats",
      price: "₹799",
      tag: "",
      image:
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#d19a9a]">
          THRIFTMATCH / WOMENSWEAR / FOOTWEAR
        </p>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Footwear.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
              Sneakers, loafers, boots and everyday footwear curated for effortless style.
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
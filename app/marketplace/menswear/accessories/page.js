export default function MenswearAccessories() {
  const products = [
    {
      name: "Classic Leather Watch",
      price: "₹899",
      tag: "TOP RATED",
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Minimal Black Backpack",
      price: "₹1,099",
      tag: "TRENDING",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Classic Sunglasses",
      price: "₹699",
      tag: "BEST SELLER",
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Leather Belt",
      price: "₹499",
      tag: "",
      image:
        "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Everyday Cap",
      price: "₹399",
      tag: "NEW FIND",
      image:
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Classic Crossbody Bag",
      price: "₹799",
      tag: "",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
          THRIFTMATCH / MENSWEAR / ACCESSORIES
        </p>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Accessories.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
              Watches, bags, sunglasses, caps and finishing touches for your
              everyday look.
            </p>
          </div>

          <p className="text-sm font-bold uppercase tracking-widest text-[#aaa399]">
            6 pieces
          </p>
        </div>

        <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-2xl border border-[#3a342b] bg-[#211e1a]"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-80 w-full object-cover"
              />
              <div className="p-5">
                {product.tag && (
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#c6a15b]">
                    {product.tag}
                  </p>
                )}
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold">{product.name}</h2>
                  <p className="shrink-0 text-lg font-bold text-[#c6a15b]">
                    {product.price}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
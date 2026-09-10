export default function MenswearOuterwear() {
  const products = [
    {
      name: "Washed Denim Fur Hooded Jacket with Faux-Fur Lining and Hood",
      price: "₹1,299",
      tag: "TRENDING",
      image:
        "/menout1.jpeg",
    },
    {
      name: "Black Boxy Oversized Faux Leather Jacket with Spread Collar",
      price: "₹1,499",
      tag: "BEST SELLER",
      image:
        "/menout2.jpeg",
    },
    {
      name: "Grey Washed Denim Bomber Jacket with Elasticized Waistband",
      price: "₹1,399",
      tag: "TOP RATED",
      image:
        "/menout3.jpeg",
    },
    {
      name: "Navy Blue and White Letterman-Style Varsity Jacket",
      price: "₹999",
      tag: "",
      image:
        "/menout4.jpeg",
    },
    {
      name: "Classic Blue Denim Trucker Jacket",
      price: "₹1,599",
      tag: "NEW FIND",
      image:
        "/menout5.jpeg",
    },
    {
      name: "Colorblocked Patchwork Canvas Work Jacket",
      price: "₹1,799",
      tag: "",
      image:
        "/menout6.jpeg",
    },
    {
      name: "Brown Faux-Suede and Faux-Fur Lined Jacket with Chinese-Knot Buttons",
      price: "₹1,799",
      tag: "",
      image:
        "/menout7.jpeg",
    },
    {
      name: "Vintage Style Japanese Souvenir Jacket with Reversible Style",
      price: "₹1,799",
      tag: "",
      image:
        "/menout8.jpeg",
    },
    {
      name: "Brown Distressed Faux-Leather Bomber Jacket",
      price: "₹1,799",
      tag: "",
      image:
        "/menout9.jpeg",
    },
  ];

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
          THRIFTMATCH / MENSWEAR / OUTERWEAR
        </p>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Outerwear.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
              Jackets, coats and statement layers to finish your look.
            </p>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b9b2a7]">
            {products.length} pieces
          </p>
        </div>

        <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-2xl border border-[#3a342c] bg-[#211e1a]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
                {product.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-[#c6a15b] px-3 py-1 text-xs font-bold tracking-wider text-[#171512]">
                    {product.tag}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 p-5">
                <h2 className="text-lg font-bold">{product.name}</h2>
                <p className="shrink-0 font-semibold text-[#c6a15b]">
                  {product.price}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
export default function WomenswearLowerwear() {
  const products = [
    {
      name: "Y2K Brown Low-Rise Skirt",
      price: "₹899",
      tag: "BEST SELLER",
      image:
        "/womenlow1.jpeg",
    },
    {
      name: "Brown Wide-Wale Corduroy Super-Flare Pants",
      price: "₹999",
      tag: "TRENDING",
      image:
        "/womenlow2.jpeg",
    },
    {
      name: "Floral-Printed Mermaid Skirt with Asymmetrical Ruffled Hem",
      price: "₹1,099",
      tag: "TOP RATED",
      image:
        "/womenlow3.jpeg",
    },
    {
      name: "Dark Wash Flared Denim Jeans featuring Floral Embroidery",
      price: "₹1,049",
      tag: "",
      image:
        "/womenlow4.jpeg",
    },
    {
      name: "Vintage Charcoal-Grey Denim Midi Skirt",
      price: "₹949",
      tag: "NEW FIND",
      image:
        "/womenlow5.jpeg",
    },
    {
      name: "High-Waist Denim Fishtail Midi Skirt",
      price: "₹1,199",
      tag: "",
      image:
        "/womenlow6.jpeg",
    },
    {
      name: "Y2K Low-Rise Blue Denim Jeans",
      price: "₹1,199",
      tag: "",
      image:
        "/womenlow7.jpeg",
    },
    {
      name: "Brown Wide-Leg Trousers featuring a Folded High Waistband",
      price: "₹1,199",
      tag: "",
      image:
        "/womenlow8.jpeg",
    },
    {
      name: "Brown Corduroy Wide-Leg Trousers with a Low-Rise Waist",
      price: "₹1,199",
      tag: "",
      image:
        "/womenlow9.jpeg",
    },
  ];

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#d19a9a]">
          THRIFTMATCH / WOMENSWEAR / LOWERWEAR
        </p>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Lowerwear.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
              Jeans, trousers and relaxed bottoms curated for effortless style.
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
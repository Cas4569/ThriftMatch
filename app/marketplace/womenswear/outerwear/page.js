export default function WomenswearOuterwear() {
  const products = [
    {
      name: "Grey Shearling and Leather Double-Breasted Winter Coat",
      price: "₹1,299",
      tag: "TRENDING",
      image:
        "/womenout1.jpeg",
    },
    {
      name: "Black Bomber Jacket",
      price: "₹1,499",
      tag: "BEST SELLER",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Brown Oversized Trench Overcoat",
      price: "₹1,399",
      tag: "TOP RATED",
      image:
        "/shakira.jpeg",
    },
    {
      name: "Brown Fur-Trim Shearling Jacket",
      price: "₹999",
      tag: "",
      image:
        "/womenout3.jpeg",
    },
    {
      name: "Y2K Brown and Green Gradient Knit Cardigan",
      price: "₹1,599",
      tag: "NEW FIND",
      image:
        "/womenout4.jpeg",
    },
    {
      name: "Brown Faux-Suede Jacket",
      price: "₹1,799",
      tag: "",
      image:
        "/womenout5.jpeg",
    },
    {
      name: "Open Crochet Tie-Front Cardigan with V-neckline",
      price: "₹1,799",
      tag: "",
      image:
        "/womenout6.jpeg",
    },
    {
      name: "Dark Wash Denim Cape Jacket",
      price: "₹1,799",
      tag: "",
      image:
        "/womenout7.jpeg",
    },
    {
      name: "Brown Distressed Leather Moto Jacket with Stand Collar",
      price: "₹1,799",
      tag: "",
      image:
        "/womenout8.jpeg",
    },
    {
      name: "Grey Cable-Knit V-neck Button-Down Cardigan with Dropped Shoulders",
      price: "₹1,799",
      tag: "",
      image:
        "/womenout9.jpeg",
    },
    {
      name: "Faux Suede and Faux-Fur Winter Jacket",
      price: "₹1,799",
      tag: "",
      image:
        "/womenout10.jpeg",
    },
    {
      name: "Y2K Styled Babydoll Cardigan Hoodie",
      price: "₹1,799",
      tag: "",
      image:
        "/womenout11.jpeg",
    },

  ];

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#d19a9a]">
          THRIFTMATCH / WOMENSWEAR / OUTERWEAR
        </p>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Outerwear.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
              Jackets, coats and layering pieces curated for effortless style.
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
              <div className="relative h-[-28rem] overflow-hidden">
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
export default function WomenswearUpperwear() {
  const products = [
    {
      name: "Black Satin Long-Sleeve Top",
      price: "₹599",
      tag: "BEST SELLER",
      image:
        "/womenup1.jpeg",
    },
    {
      name: "Grey Short-Sleeve Cable-Knit Button-Up Cardigan",
      price: "₹699",
      tag: "TRENDING",
      image:
        "/womenup2.jpeg", 
    },
    {
      name: "Burgundy Long-Sleeve Y2K Henley Top",
      price: "₹899",
      tag: "TOP RATED",
      image:
        "/womenup3.jpeg",
    },
    {
      name: "Layered Vintage-Style Brown Camisole",
      price: "₹749",
      tag: "",
      image:
        "/womenup4.jpeg",
    },
    {
      name: "Bollywood-Style Hand-Embroidered Georgette Tunic",
      price: "₹999",
      tag: "NEW FIND",
      image:
        "/bolly.jpeg",
    },
    {
      name: "White Short-Sleeve Oversized Graphic T-shirt",
      price: "₹1,099",
      tag: "",
      image:
        "/womenup6.jpeg",
    },
     {
      name: "Y2K Brown Boho Glam Camisole",
      price: "₹1,099",
      tag: "",
      image:
        "/womenup7.jpeg",
    },
     {
      name: "Distressed Acid-Washed Black Oversized T-Shirt",
      price: "₹1,099",
      tag: "",
      image:
        "/womenup8.jpeg",
    },
     {
      name: "Black and White Striped Sweetheart-Neck Top",
      price: "₹1,099",
      tag: "",
      image:
        "/womenup9.jpeg",
    },
  ];

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#d19a9a]">
          THRIFTMATCH / WOMENSWEAR / UPPERWEAR
        </p>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Upperwear.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
              Tops, shirts, blouses and knitwear curated for effortless style.
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
export default function UpperwearPage() {
  const products = [
    {
      name: "Brown and beige Plaid Checked Casual Shirt",
      price: "₹599",
      tag: "BEST SELLER",
      image:
        "/menup1.jpeg",
    },
    {
      name: "Vintage Maroon Marvel Spider-Man Graphic T-shirt",
      price: "₹699",
      tag: "TRENDING",
      image:
        "/menup2.jpeg",
    },
    {
      name: "Black and White Pinstripe Short-Sleeve Button-Down Shirt",
      price: "₹899",
      tag: "TOP RATED",
      image:
        "/menup3.jpeg",
    },
    {
      name: "Dark Navy Blue Long-Sleeve Henley T-shirt with Buttoned Placket",
      price: "₹749",
      tag: "",
      image:
        "/henley.jpeg",
    },
    {
      name: "Mandarin-Style Embroidered Linen Shirt",
      price: "₹999",
      tag: "NEW FIND",
      image:
        "/menup5.jpeg",
    },
    {
      name: "Short-Sleeve Navy Layered Graphics T-shirt",
      price: "₹1,099",
      tag: "",
      image:
        "/menup6.jpeg", 
    },
    {
      name: "Relaxed-Fit Street Style Long-Sleeve",
      price: "₹1,099",
      tag: "",
      image:
        "/menup7.jpeg", 
    },
    {
      
      name: "Short-Sleeve Casual Button-down Shirt",
      price: "₹1,099",
      tag: "",
      image:
        "/menup8.jpeg", 
    },
  ];

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
          THRIFTMATCH / MENSWEAR / UPPERWEAR
        </p>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Upperwear.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
              Tees, shirts, polos and sweatshirts curated for everyday style.
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
              className="group overflow-hidden rounded-[2rem] border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#c6a15b] hover:shadow-2xl"
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
                  <p className="text-xl font-bold text-[#c6a15b]">
                    {product.price}
                  </p>

                  <button className="rounded-full border border-[#5a5348] px-5 py-2.5 text-sm font-bold transition hover:bg-[#c6a15b] hover:text-[#171512]">
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
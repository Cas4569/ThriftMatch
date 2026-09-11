export default function Womenswear() {
  const categories = [
    {
      name: "Footwear",
      description: "Sneakers, heels, boots & more.",
      image:
        "/womenfootcover.jpeg",
    },
    {
      name: "Upperwear",
      description: "Tops, shirts, blouses & knitwear.",
      image:
        "/womenupcover.jpeg",
    },
    {
      name: "Lowerwear",
      description: "Jeans, skirts, trousers & more.",
      image:
  "/womenlowcover.jpeg",
    },
    {
      name: "Accessories",
      description: "Bags, jewellery, watches & finishing touches.",
      image:
        "/womenaccover.jpeg",
    },
    {
      name: "Outerwear",
      description: "Jackets, coats & statement layers.",
      image:
  "/womenoutcover.jpeg",
    },
  ];

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <div className="mb-14">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#d19a9a]">
            THRIFTMATCH / WOMENSWEAR
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Womenswear.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
            Discover expressive pieces, timeless finds and looks made to
            stand out.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.name}
              href={
                category.name === "Footwear" ||
                category.name === "Upperwear" ||
                category.name === "Lowerwear" ||
                category.name === "Accessories" ||
                category.name === "Outerwear"
                  ? `/marketplace/womenswear/${category.name.toLowerCase()}`
                  : undefined
              }
              className="group overflow-hidden rounded-[2rem] border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#d19a9a] hover:shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-7">
                <h2 className="text-3xl font-black">
                  {category.name}
                </h2>

                <p className="mt-3 text-[#aaa399]">
                  {category.description}
                </p>

                <div className="mt-6 inline-flex rounded-full border border-[#5a5348] px-5 py-2.5 text-sm font-bold transition group-hover:bg-[#d19a9a] group-hover:text-[#171512]">
                  Explore →
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </main>
  );
}
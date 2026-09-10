export default function MenswearAccessories() {
  const products = [
    {
      name: "Washed Denim Brown Faux-Suede Baseball Cap",
      price: "₹899",
      tag: "TOP RATED",
      image:
        "/menac1.jpeg",
    },
    {
      name: "Brown Leather Messenger Bag With Flap Front",
      price: "₹1,099",
      tag: "TRENDING",
      image:
        "/menac2.jpeg",
    },
    {
      name: "Y2K Aesthetic Layering Necklace Set",
      price: "₹699",
      tag: "BEST SELLER",
      image:
        "/menac3.jpeg",
    },
    {
      name: "Steampunk Analog Wristwatch with Bronze-Toned Circular Case",
      price: "₹499",
      tag: "",
      image:
        "/menac4.jpeg",
    },
    {
      name: "Brown Canvas and Leather Shoulder Bag",
      price: "₹399",
      tag: "NEW FIND",
      image:
        "/menac5.jpeg",
    },
    {
      name: "Multi-Piece Punk Rock Studded Bracelet Set",
      price: "₹799",
      tag: "",
      image:
        "/menac6.jpeg",
    },
    {
      name: "Silver-Toned Chain Necklace Set",
      price: "₹799",
      tag: "",
      image:
        "/menac7.jpeg",
    },
    {
      name: "6 Piece Gothic Style Metal Ring Set",
      price: "₹799",
      tag: "",
      image:
        "/menac8.jpeg",
    },
    {
      name: "Distressed Brown Leather Belts Sett",
      price: "₹799",
      tag: "",
      image:
        "/menac9.jpeg",
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
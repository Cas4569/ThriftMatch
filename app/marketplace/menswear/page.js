export default function Menswear() {
  const categories = [
    {
      name: "Footwear",
      description: "Sneakers, boots, loafers & more.",
      image:
        "/menfootcover.jpeg",
    },
    {
      name: "Upperwear",
      description: "Tees, shirts, polos & sweatshirts.",
      image:
        "/menupcover.jpeg",
    },
    {
      name: "Lowerwear",
      description: "Denim, cargos, trousers & more.",
      image:
        "/menlowcover.jpeg",
    },
    {
      name: "Accessories",
      description: "Watches, bags, caps & finishing touches.",
      image:
        "/menacccover.jpeg",
    },
    {
      name: "Outerwear",
      description: "Jackets, coats & statement layers.",
      image:
        "/menoutcover.jpeg",
    }
    
  ];

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <div className="mb-14">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
            THRIFTMATCH / MENSWEAR
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Menswear.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
            Build your look from timeless essentials, vintage finds and
            standout pieces.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {categories.map((category) => (
    <a
      key={category.name}
      href={`/marketplace/menswear/${category.name.toLowerCase()}`}
      className="group overflow-hidden rounded-[2rem] border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#c6a15b] hover:shadow-2xl"
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

        <div className="mt-6 inline-flex rounded-full border border-[#5a5348] px-5 py-2.5 text-sm font-bold transition group-hover:bg-[#c6a15b] group-hover:text-[#171512]">
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
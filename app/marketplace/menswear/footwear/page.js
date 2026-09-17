import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function MenswearFootwear() {
  const q = query(
    collection(db, "products"),
    where("category", "==", "menswear"),
    where("subcategory", "==", "footwear")
  );

  const snapshot = await getDocs(q);
  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09040f] px-6 py-14 text-[#f7efff]">

      {/* Ambient Russian Violet glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#32174D] opacity-50 blur-[130px]" />

      <div className="pointer-events-none absolute right-[-120px] top-[30%] h-[500px] w-[500px] rounded-full bg-[#6d2394] opacity-25 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-150px] left-[35%] h-[400px] w-[400px] rounded-full bg-[#a21caf] opacity-20 blur-[140px]" />

      {/* Cyber grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(180,100,255,0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,100,255,0.22) 1px, transparent 1px)
          `,
          backgroundSize: "55px 55px",
          maskImage:
            "linear-gradient(to bottom, black 0%, transparent 85%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 85%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Top HUD */}
        <div className="mb-8 flex items-center justify-between border-b border-[#32174D] pb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c6a15b]">

          

        </div>

        {/* Header */}
        <div className="mb-12">

          <div className="mb-4 flex items-center gap-3">

            <span className="h-px w-10 bg-[#a855f7]" />

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#c084fc]">
              THRIFTMATCH / MENSWEAR / FOOTWEAR
            </p>

            <span className="h-px flex-1 bg-gradient-to-r from-[#a855f7] to-transparent" />

          </div>

          <div className="relative">

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              <span className="bg-gradient-to-r from-white via-[#eee4f5] to-[#c6a15b] bg-clip-text text-transparent">
                Footwear.
              </span>
            </h1>

            {/* Purple → Gold accent */}
            <div className="mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-[#7e22ce] via-[#c6a15b] to-transparent shadow-[0_0_18px_rgba(198,161,91,0.45)]" />

          </div>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9a7c7]">
            Step into your style with pre-loved sneakers, boots, loafers and
            everyday essentials.
          </p>

        </div>

        {/* Database HUD */}
        <div className="mb-6 flex items-end justify-between">

          <div>
            

            <div className="mt-2 h-px w-24 bg-gradient-to-r from-[#a855f7] to-[#c6a15b]" />
          </div>

          <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#c6a15b] sm:block">
            {products.length} PIECES DETECTED
          </p>

        </div>

        {/* Products */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-[2rem] border border-[#45245d] bg-[#140a1c]/90 shadow-[0_15px_45px_rgba(0,0,0,0.4)] backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-[#c6a15b] hover:shadow-[0_25px_70px_rgba(126,34,206,0.3)]"
            >

              {/* Neon edge */}
              <div className="pointer-events-none absolute inset-0 z-20 rounded-[2rem] border border-transparent transition duration-500 group-hover:border-[#c6a15b]/40" />

              {/* Product number */}
              <div className="absolute left-5 top-5 z-30 rounded-full border border-[#c6a15b]/50 bg-[#13091b]/85 px-3 py-1.5 text-[9px] font-black tracking-[0.2em] text-[#e0c486] backdrop-blur-md">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Image */}
              <div className="relative h-80 overflow-hidden bg-[#32174D]">

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110 group-hover:rotate-[1deg]"
                />

                {/* Image gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#140a1c] via-transparent to-[#32174D]/20 opacity-75 transition duration-500 group-hover:opacity-50" />

                {/* Scanlines */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.08) 5px)",
                  }}
                />

                {/* Gold hover wash */}
                <div className="absolute inset-0 bg-[#c6a15b]/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                {/* Product tag */}
                {product.tag && (
                  <div className="absolute left-5 top-16 rounded-full border border-[#c6a15b]/50 bg-[#13091b]/85 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#e0c486] backdrop-blur-md">
                    {product.tag}
                  </div>
                )}

                {/* Image HUD */}
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">

                  

                  

                </div>

              </div>

              {/* Content */}
              <div className="p-7">

                <h2 className="text-2xl font-black tracking-tight transition duration-300 group-hover:text-[#e0c486]">
                  {product.name}
                </h2>

                {/* Product metadata */}
                <div className="mt-6 flex items-center justify-between">

                  <div className="flex gap-1">
                    <span className="h-1 w-5 rounded-full bg-[#7e22ce]" />
                    <span className="h-1 w-2 rounded-full bg-[#c6a15b]" />
                    <span className="h-1 w-2 rounded-full bg-[#45245d]" />
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#76518b]">
                    ITEM VERIFIED ✔️
                  </span>

                </div>

                {/* Price + View */}
                <div className="mt-5 flex items-center justify-between gap-4">

                  <p className="text-xl font-black text-[#c6a15b]">
                    {product.price}
                  </p>

                  <a
                    href={`/marketplace/product/${product.id}`}
                    className="rounded-full border border-[#5b3180] px-5 py-2.5 text-sm font-bold text-[#d8b4fe] transition duration-300 hover:border-[#c6a15b] hover:bg-[#32174D] hover:text-[#e0c486] hover:shadow-[0_0_20px_rgba(198,161,91,0.2)]"
                  >
                    View →
                  </a>

                </div>

              </div>

            </div>
          ))}

        </section>

        {/* Bottom HUD */}
        <div className="mt-14 flex flex-col gap-3 border-t border-[#32174D] pt-5 text-[9px] font-bold uppercase tracking-[0.25em] text-[#65477a] sm:flex-row sm:items-center sm:justify-between">

          

          

          

        </div>

      </div>
    </main>
  );
}
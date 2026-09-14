import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function UpperwearPage() {
  const q = query(
    collection(db, "products"),
    where("category", "==", "menswear"),
    where("subcategory", "==", "upperwear")
  );
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

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
            {products.length} pieces
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-4xl border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#c6a15b] hover:shadow-2xl"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

              </div>

              <div className="p-6">
                <h2 className="text-2xl font-black">
                  {product.name}
                </h2>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xl font-bold text-[#c6a15b]">
                    {product.price}
                  </p>

                  <a href={`/marketplace/product/${product.id}`} className="rounded-full border border-[#5a5348] px-5 py-2.5 text-sm font-bold transition hover:bg-[#c6a15b] hover:text-[#171512]">
                    View →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
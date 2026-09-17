import { notFound } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductActions from "../../../components/ProductActions";

async function findProduct(id) {
  const directRef = doc(db, "products", id);
  const directSnap = await getDoc(directRef);

  if (directSnap.exists()) {
    return { id: directSnap.id, ...directSnap.data() };
  }

  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch {
    decodedId = id;
  }

  if (decodedId !== id) {
    const decodedRef = doc(db, "products", decodedId);
    const decodedSnap = await getDoc(decodedRef);

    if (decodedSnap.exists()) {
      return { id: decodedSnap.id, ...decodedSnap.data() };
    }
  }

  const nameQuery = query(
    collection(db, "products"),
    where("name", "==", decodedId),
    limit(1)
  );

  const nameSnapshot = await getDocs(nameQuery);

  if (!nameSnapshot.empty) {
    const nameDoc = nameSnapshot.docs[0];
    return { id: nameDoc.id, ...nameDoc.data() };
  }

  return null;
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  const product = await findProduct(id);

  if (!product) {
    notFound();
  }

  const description =
    product.description ||
    `A pre-loved ${product.name.toLowerCase()} selected for the ThriftMatch ${
      product.subcategory || product.category || "fashion"
    } collection.`;

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <div className="overflow-hidden rounded-4xl border border-[#3b3832] bg-[#24221e]">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
            THRIFTMATCH / {product.category || "PRODUCT"}
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            {product.name}
          </h1>

          <p className="mt-6 text-3xl font-bold text-[#c6a15b]">
            {product.price || "Price available at checkout"}
          </p>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#b9b2a7]">
            {description}
          </p>

          <div className="mt-10">
            <ProductActions product={product} />
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#777168]">
            Product ID: {product.id}
          </p>
        </div>
      </div>
    </main>
  );
}
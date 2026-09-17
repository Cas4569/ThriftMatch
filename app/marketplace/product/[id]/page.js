import { notFound } from "next/navigation";
import { menswearProducts } from "../../menswearProducts";
import { womenswearProducts } from "../../womenswearProducts";
import ProductActions from "../../../components/ProductActions";

function decodeProductId(id) {
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  const productName = decodeProductId(id);

  const allProducts = [
    ...menswearProducts.map((product) => ({
      ...product,
      gender: "Menswear",
    })),
    ...womenswearProducts.map((product) => ({
      ...product,
      gender: "Womenswear",
    })),
  ];

  const foundProduct = allProducts.find(
    (product) => product.name === productName
  );

  if (!foundProduct) {
    notFound();
  }

  const product = {
    id: encodeURIComponent(foundProduct.name),
    ...foundProduct,
  };

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
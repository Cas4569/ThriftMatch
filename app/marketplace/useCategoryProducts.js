"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function useCategoryProducts(category, subcategory) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const productsQuery = query(
          collection(db, "products"),
          where("category", "==", category),
          where("subcategory", "==", subcategory)
        );
        const snapshot = await getDocs(productsQuery);
        const loadedProducts = snapshot.docs.map((productDoc) => ({
          id: productDoc.id,
          ...productDoc.data(),
        }));

        if (active) {
          setProducts(loadedProducts);
        }
      } catch (loadError) {
        console.error("CATEGORY PRODUCT LOAD ERROR:", loadError);
        if (active) {
          setError("Couldn't load products. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [category, subcategory]);

  return { products, loading, error };
}

export function CategoryProductsStatus({ loading, error, count }) {
  if (!loading && !error && count > 0) {
    return null;
  }

  return (
    <div className="mb-6" aria-live="polite">
      {loading && (
        <p className="text-sm text-[#b9a7c7]">
          Loading products...
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      {!loading && !error && count === 0 && (
        <p className="text-sm text-[#b9a7c7]">
          No products found in this category yet.
        </p>
      )}
    </div>
  );
}

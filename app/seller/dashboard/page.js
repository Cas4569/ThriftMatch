"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

const CATEGORIES = [
  {
    value:
      "menswear:upperwear",
    label:
      "Men's — Upperwear",
  },
  {
    value:
      "menswear:lowerwear",
    label:
      "Men's — Lowerwear",
  },
  {
    value:
      "menswear:footwear",
    label:
      "Men's — Footwear",
  },
  {
    value:
      "menswear:accessories",
    label:
      "Men's — Accessories",
  },
  {
    value:
      "menswear:outerwear",
    label:
      "Men's — Outerwear",
  },
  {
    value:
      "womenswear:upperwear",
    label:
      "Women's — Upperwear",
  },
  {
    value:
      "womenswear:lowerwear",
    label:
      "Women's — Lowerwear",
  },
  {
    value:
      "womenswear:footwear",
    label:
      "Women's — Footwear",
  },
  {
    value:
      "womenswear:accessories",
    label:
      "Women's — Accessories",
  },
  {
    value:
      "womenswear:outerwear",
    label:
      "Women's — Outerwear",
  },
];

export default function SellerDashboard() {
  const [user, setUser] =
    useState(null);

  const [seller, setSeller] =
    useState(null);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          if (!currentUser) {
            return;
          }

          setUser(
            currentUser
          );

          try {
            const token =
              await currentUser.getIdToken();

            const response =
              await fetch(
                "/api/seller/me",
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              );

            const data =
              await response.json();

            if (response.ok) {
              setSeller(
                data.seller
              );
            }
          } catch (loadError) {
            console.error(
              "SELLER PROFILE ERROR:",
              loadError
            );
          } finally {
            setLoading(false);
          }
        }
      );

    return () =>
      unsubscribe();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      submitting ||
      !user
    ) {
      return;
    }

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const files =
        event.currentTarget
          .querySelector(
            'input[name="photos"]'
          )
          ?.files;

      if (
        !files ||
        !files.length
      ) {
        throw new Error(
          "Please choose at least one photo."
        );
      }

      const formData =
        new FormData();

      formData.append(
        "title",
        title
      );

      formData.append(
        "description",
        description
      );

      formData.append(
        "price",
        price
      );

      formData.append(
        "category",
        category
      );

      for (
        const file of files
      ) {
        formData.append(
          "photos",
          file
        );
      }

      const token =
        await user.getIdToken();

      const response =
        await fetch(
          "/api/seller/listings",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Couldn't create the listing."
        );
      }

      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");

      event.currentTarget.reset();

      setMessage(
        "Listing added successfully. It is now live in the marketplace."
      );
    } catch (submitError) {
      console.error(
        "SELLER LISTING SUBMIT ERROR:",
        submitError
      );

      setError(
        submitError?.message ||
          "Couldn't add this listing."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
        <div className="mx-auto max-w-5xl">
          <p className="text-[#a9958f]">
            Loading seller dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
      <div className="mx-auto max-w-5xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#9A6051]">
          THRIFTMATCH / SELLER
        </p>

        <h1 className="text-5xl font-black tracking-tight">
          Add a product.
        </h1>

        <p className="mt-4 text-lg text-[#a9958f]">
          {seller?.storeName
            ? `Your store, ${seller.storeName}, is approved. Add a product for shoppers to discover.`
            : "Add a product for shoppers to discover."}
        </p>

        <div className="mt-10 rounded-3xl border border-[#3b2925] bg-[#211512] p-8">

          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#776b67]">
                APPROVED SELLER
              </p>

              <p className="mt-2 font-semibold">
                {user?.email}
              </p>
            </div>

            <span className="rounded-full border border-[#9A6051]/50 bg-[#9A6051]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#c98d7c]">
              VERIFIED
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
          >

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Product name
              </label>

              <input
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="e.g. Vintage oversized denim jacket"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 outline-none transition placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>

              <textarea
                required
                maxLength={2000}
                rows={5}
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe the item's condition, fit, material, and any details shoppers should know."
                className="w-full resize-y rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 outline-none transition placeholder:text-[#777168] focus:border-[#9A6051]"
              />

              <p className="mt-2 text-xs text-[#776b67]">
                Include condition, size, material, or flaws where relevant.
              </p>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Price
                </label>

                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      event.target.value
                    )
                  }
                  placeholder="1499"
                  className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 outline-none transition placeholder:text-[#777168] focus:border-[#9A6051]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  required
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 outline-none transition focus:border-[#9A6051]"
                >
                  <option value="">
                    Choose a category
                  </option>

                  {CATEGORIES.map(
                    (item) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold">
                Photos
              </label>

              <input
                type="file"
                name="photos"
                required
                multiple
                accept="image/*"
                className="block w-full rounded-xl border border-[#624038] bg-[#120b09] px-4 py-4 text-sm text-[#d9c9c3] file:mr-4 file:rounded-full file:border-0 file:bg-[#9A6051] file:px-4 file:py-2 file:font-bold file:text-[#120b09]"
              />

              <p className="mt-2 text-xs text-[#776b67]">
                Up to 5 photos, 5 MB each.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-800/40 bg-red-950/20 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-6 rounded-xl border border-[#9A6051]/30 bg-[#9A6051]/10 px-4 py-3 text-sm text-[#d8aaa0]">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={
                submitting
              }
              className="mt-8 rounded-full bg-[#9A6051] px-7 py-4 text-sm font-bold text-[#120b09] transition hover:bg-[#b56b59] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Adding product..."
                : "Add product"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
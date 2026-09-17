"use client";

import { useState } from "react";

export default function Sellers() {
  const [fullName, setFullName] =
    useState("");

  const [mobile, setMobile] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [storeName, setStoreName] =
    useState("");

  const [sellerType, setSellerType] =
    useState("");

  const [storeLink, setStoreLink] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [cooldown, setCooldown] =
    useState(false);

  /*
   * Small client-side cooldown.
   *
   * The real rate limiting happens on
   * /api/seller-application.
   */
  function startCooldown() {
    setCooldown(true);

    setTimeout(() => {
      setCooldown(false);
    }, 2000);
  }

  /*
   * Submit seller application.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (
      loading ||
      cooldown
    ) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    startCooldown();

    try {
      /*
       * Send request to our server.
       */
      const response =
        await fetch(
          "/api/seller-application",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              fullName,
              mobile,
              email,
              storeName,
              sellerType,
              storeLink,
            }),
          }
        );

      /*
       * Read text first.
       *
       * This prevents:
       *
       * "Unexpected end of JSON input"
       */
      const responseText =
        await response.text();

      let data = {};

      if (responseText) {
        try {
          data =
            JSON.parse(
              responseText
            );
        } catch {
          data = {
            error:
              responseText,
          };
        }
      }

      /*
       * Handle server error.
       */
      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Server returned HTTP ${response.status}.`
        );
      }

      /*
       * Success.
       */
      setSuccess(
        data?.message ||
          "Application received. Our team will review your seller details."
      );

      /*
       * Clear form.
       */
      setFullName("");
      setMobile("");
      setEmail("");
      setStoreName("");
      setSellerType("");
      setStoreLink("");
    } catch (err) {
      console.error(
        "Seller application error:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while submitting your application."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#9A6051]">
          THRIFTMATCH / SELLERS
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          Become a seller.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#a9958f]">
          Before you start listing your fashion pieces, we
          need to verify some basic information about you
          and your store.
        </p>

        {/* Seller verification form */}
        <form
          onSubmit={
            handleSubmit
          }
          className="mt-12 rounded-4xl border border-[#3b2925] bg-[#211512] p-8 md:p-10"
        >

          {/* Form heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-black">
              Seller Verification
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#aaa399]">
              This information helps us keep ThriftMatch
              safe and trustworthy for buyers and sellers.
            </p>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-xl border border-green-700/40 bg-green-950/20 px-4 py-4 text-sm leading-6 text-green-300">
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-700/40 bg-red-950/20 px-4 py-4 text-sm leading-6 text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-6">

            {/* Full name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-semibold"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                required
                maxLength={100}
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none transition placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

            {/* Mobile */}
            <div>
              <label
                htmlFor="mobile"
                className="mb-2 block text-sm font-semibold"
              >
                Mobile Number
              </label>

              <input
                id="mobile"
                type="tel"
                required
                maxLength={30}
                value={mobile}
                onChange={(e) =>
                  setMobile(
                    e.target.value
                  )
                }
                placeholder="Enter your mobile number"
                autoComplete="tel"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none transition placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                required
                maxLength={150}
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter your email address"
                autoComplete="email"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none transition placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

            {/* Store name */}
            <div>
              <label
                htmlFor="storeName"
                className="mb-2 block text-sm font-semibold"
              >
                Store Name
              </label>

              <input
                id="storeName"
                type="text"
                required
                maxLength={100}
                value={storeName}
                onChange={(e) =>
                  setStoreName(
                    e.target.value
                  )
                }
                placeholder="Enter your store name"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none transition placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

            {/* Seller type */}
            <div>
              <label
                htmlFor="sellerType"
                className="mb-2 block text-sm font-semibold"
              >
                Seller Type
              </label>

              <select
                id="sellerType"
                required
                value={sellerType}
                onChange={(e) =>
                  setSellerType(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none transition focus:border-[#9A6051]"
              >
                <option value="">
                  Select seller type
                </option>

                <option value="individual">
                  Individual Seller
                </option>

                <option value="thrift-store">
                  Thrift Store
                </option>
              </select>
            </div>

            {/* Social / store link */}
            <div>
              <label
                htmlFor="storeLink"
                className="mb-2 block text-sm font-semibold"
              >
                Social Media / Store Link
              </label>

              <input
                id="storeLink"
                type="url"
                maxLength={500}
                value={storeLink}
                onChange={(e) =>
                  setStoreLink(
                    e.target.value
                  )
                }
                placeholder="https://instagram.com/yourstore"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none transition placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              cooldown
            }
            className="mt-8 w-full rounded-full bg-[#9A6051] px-6 py-4 font-bold text-[#120b09] transition hover:scale-[1.02] hover:bg-[#ad7060] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Submitting application..."
              : "Continue Verification →"}
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-[#776b67]">
            Seller applications are limited to prevent
            spam and abuse.
          </p>

        </form>
      </div>
    </main>
  );
}
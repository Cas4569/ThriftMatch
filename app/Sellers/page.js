"use client";

import { useRef, useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Small inline icons (no extra packages needed)                       */
/* ------------------------------------------------------------------ */

function Icon({ children, className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function SparkIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
      <path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16z" />
    </Icon>
  );
}

function PinIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

function ShieldIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </Icon>
  );
}

function StoreIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 9l1.5-5h13L20 9" />
      <path d="M4 9a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0A2.7 2.7 0 0020 9" />
      <path d="M5 11.5V20h14v-8.5" />
      <path d="M10 20v-5h4v5" />
    </Icon>
  );
}

function UserIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </Icon>
  );
}

function CheckIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Icon>
  );
}

function ChevronIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

/* ------------------------------------------------------------------ */
/* Static content (edit the copy here)                                 */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    title: "Apply",
    text: "Share your details and your store link. It takes about two minutes.",
  },
  {
    title: "Get verified",
    text: "Our team checks your information so buyers can trust every storefront.",
  },
  {
    title: "Start listing",
    text: "Once you're approved, add your pieces and let ThriftMatch put them in front of buyers.",
  },
];

const BENEFITS = [
  {
    icon: SparkIcon,
    title: "Matched, not just listed",
    text: "Buyers get outfit suggestions from our AI stylist, so your pieces show up as part of complete looks.",
  },
  {
    icon: PinIcon,
    title: "Built around local fashion",
    text: "ThriftMatch is a local marketplace, so your pieces reach people who shop close to you.",
  },
  {
    icon: ShieldIcon,
    title: "A verified storefront",
    text: "Verification shows buyers that you're real. That trust is what turns browsing into buying.",
  },
  {
    icon: StoreIcon,
    title: "Made for small sellers",
    text: "Clearing out your own closet or running a full thrift store, the setup is the same and it stays simple.",
  },
];

const SELLER_TYPES = [
  {
    value: "individual",
    label: "Individual Seller",
    icon: UserIcon,
    text: "You're selling pre-loved pieces from your own wardrobe.",
    cta: "Apply as an individual",
  },
  {
    value: "thrift-store",
    label: "Thrift Store",
    icon: StoreIcon,
    text: "You run a thrift shop, online or offline, with regular stock.",
    cta: "Apply as a thrift store",
  },
];

const FAQS = [
  {
    q: "What happens after I apply?",
    a: "Our team reviews your details. If we need anything else, we'll reach out on the email or mobile number you gave us.",
  },
  {
    q: "Do I need a social media page or website?",
    a: "No, the link is optional. If you have one, add it. It helps us look at your store.",
  },
  {
    q: "Can I apply as an individual?",
    a: "Yes. Choose Individual Seller if you're selling pieces from your own wardrobe. Choose Thrift Store if you run a shop.",
  },
  {
    q: "Why do you verify sellers?",
    a: "Buyers need to know who they're buying from. Verifying sellers keeps ThriftMatch safe and trustworthy for everyone.",
  },
];

const inputClass =
  "w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none transition placeholder:text-[#777168] focus:border-[#9A6051] focus:ring-2 focus:ring-[#9A6051]/30";

/* ------------------------------------------------------------------ */
/* Form field wrapper (defined outside the page so inputs keep focus)  */
/* ------------------------------------------------------------------ */

function Field({ id, label, optional, hint, children }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        {optional && (
          <span className="text-xs text-[#776b67]">Optional</span>
        )}
      </div>

      {children}

      {hint && (
        <p className="mt-1.5 text-xs leading-5 text-[#776b67]">{hint}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Sellers() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [storeLink, setStoreLink] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(false);

  const formRef = useRef(null);

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

  function scrollToForm() {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function chooseTypeAndApply(value) {
    setSellerType(value);
    setError("");
    setSuccess("");
    scrollToForm();
  }

  /*
   * Submit seller application.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (loading || cooldown) {
      return;
    }

    /*
     * Seller type uses buttons instead of a <select>,
     * so the browser can't validate it for us.
     */
    if (!sellerType) {
      setError("Choose a seller type: Individual Seller or Thrift Store.");
      return;
    }

    const mobileDigits = mobile.replace(/\D/g, "");

    if (mobileDigits.length < 10 || mobileDigits.length > 15) {
      setError("Enter a valid mobile number with 10 to 15 digits.");
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
      const response = await fetch("/api/seller-application", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fullName,
          mobile,
          email,
          storeName,
          sellerType,
          storeLink,
        }),
      });

      /*
       * Read text first.
       *
       * This prevents:
       *
       * "Unexpected end of JSON input"
       */
      const responseText = await response.text();

      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = {
            error: responseText,
          };
        }
      }

      /*
       * Handle server error.
       */
      if (!response.ok) {
        throw new Error(
          data?.error || `Server returned HTTP ${response.status}.`
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
      console.error("Seller application error:", err);

      setError(
        err?.message ||
          "Something went wrong while submitting your application."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- derived values for live preview ---------------- */

  const trimmedStoreName = storeName.trim();
  const previewName = trimmedStoreName || "Your store name";
  const previewInitial = trimmedStoreName.charAt(0).toUpperCase() || "T";

  const previewType =
    sellerType === "individual"
      ? "Individual Seller"
      : sellerType === "thrift-store"
      ? "Thrift Store"
      : "Choose a seller type";

  const previewLink = storeLink.trim() || "Add your store link";

  const filledCount = [fullName, mobile, email, storeName, sellerType].filter(
    (value) => value.trim() !== ""
  ).length;

  const progress = Math.round((filledCount / 5) * 100);

  return (
    <main className="min-h-screen bg-[#120b09] text-[#f3e9e5]">
      <style>{`
        @keyframes tm-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes tm-pop {
          from { opacity: 0; transform: scale(0.6); }
          to { opacity: 1; transform: scale(1); }
        }
        .tm-pulse { animation: tm-pulse 1.8s ease-in-out infinite; }
        .tm-pop { animation: tm-pop 0.4s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .tm-pulse, .tm-pop { animation: none; }
        }
      `}</style>

      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-black tracking-tight">
          ThriftMatch
          <span className="ml-2 text-sm font-semibold text-[#9A6051]">
            Sellers
          </span>
        </Link>

        <Link
          href="/"
          className="rounded-full border border-[#3b2925] px-4 py-2 text-sm text-[#a9958f] transition hover:border-[#9A6051] hover:text-[#f3e9e5]"
        >
          Back to marketplace
        </Link>
      </header>

      {/* Hero: pitch on the left, application on the right */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-6 md:pt-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left column */}
          <div className="lg:sticky lg:top-8">
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl xl:text-7xl">
              Turn your closet into a storefront.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#a9958f]">
              ThriftMatch puts local thrift fashion in front of buyers who are
              already browsing for their next look. Apply in two minutes and
              our team will review your store.
            </p>

            <ul className="mt-8 space-y-3 text-[#d9c9c3]">
              {[
                "Free to apply",
                "Open to individuals and thrift stores",
                "Every application is reviewed by our team",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#9A6051]/20 text-[#c98b7a]">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Live storefront preview */}
            <div
              className="mt-10 rounded-3xl border border-[#3b2925] bg-[#211512] p-5 md:p-6"
              aria-label="Preview of your storefront"
            >
              <p className="mb-4 text-xs text-[#776b67]">
                Your storefront preview. It updates as you fill in the form.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#9A6051] text-2xl font-black text-[#120b09]">
                  {previewInitial}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-black">{previewName}</p>
                  <p className="truncate text-sm text-[#a9958f]">
                    {previewType}
                  </p>
                </div>

                <span className="flex shrink-0 items-center gap-2 rounded-full border border-[#624038] px-3 py-1 text-xs text-[#c98b7a]">
                  <span className="tm-pulse h-2 w-2 rounded-full bg-[#c98b7a]" />
                  Pending verification
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex aspect-[3/4] items-center justify-center rounded-xl border border-dashed border-[#624038] bg-[#120b09] text-xs text-[#776b67]"
                  >
                    Your piece
                  </div>
                ))}
              </div>

              <p className="mt-4 truncate text-sm text-[#776b67]">
                {previewLink}
              </p>
            </div>
          </div>

          {/* Right column: application form */}
          <div ref={formRef} className="scroll-mt-6">
            <div className="rounded-3xl border border-[#3b2925] bg-[#211512] p-6 md:p-9">
              {success ? (
                <div role="status" aria-live="polite" className="py-6 text-center">
                  <div className="tm-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#9A6051] text-[#120b09]">
                    <CheckIcon className="h-8 w-8" />
                  </div>

                  <h2 className="mt-6 text-3xl font-black">Application sent</h2>

                  <p className="mx-auto mt-3 max-w-sm leading-7 text-[#a9958f]">
                    {success}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSuccess("")}
                    className="mt-8 rounded-full border border-[#624038] px-6 py-3 text-sm font-bold transition hover:border-[#9A6051] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A6051]"
                  >
                    Apply with another store
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <h2 className="text-3xl font-black">Apply to sell</h2>

                    <p className="mt-2 text-sm leading-6 text-[#aaa399]">
                      Tell us about you and your store. We use this to keep
                      ThriftMatch safe and trustworthy for buyers and sellers.
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="mb-8">
                    <div className="mb-2 flex items-center justify-between text-xs text-[#a9958f]">
                      <span>{filledCount} of 5 required details added</span>
                      <span>{progress}%</span>
                    </div>

                    <div
                      className="h-1.5 overflow-hidden rounded-full bg-[#3b2925]"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progress}
                      aria-label="Application progress"
                    >
                      <div
                        className="h-full rounded-full bg-[#9A6051] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Field id="fullName" label="Full Name">
                      <input
                        id="fullName"
                        type="text"
                        required
                        maxLength={100}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        className={inputClass}
                      />
                    </Field>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field id="mobile" label="Mobile Number">
                        <input
                          id="mobile"
                          type="tel"
                          required
                          maxLength={30}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="Enter your mobile number"
                          autoComplete="tel"
                          className={inputClass}
                        />
                      </Field>

                      <Field id="email" label="Email Address">
                        <input
                          id="email"
                          type="email"
                          required
                          maxLength={150}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          autoComplete="email"
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <Field id="storeName" label="Store Name">
                      <input
                        id="storeName"
                        type="text"
                        required
                        maxLength={100}
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Enter your store name"
                        className={inputClass}
                      />
                    </Field>

                    {/* Seller type */}
                    <div>
                      <p
                        id="sellerTypeLabel"
                        className="mb-2 text-sm font-semibold"
                      >
                        Seller Type
                      </p>

                      <div
                        role="radiogroup"
                        aria-labelledby="sellerTypeLabel"
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        {SELLER_TYPES.map((type) => {
                          const selected = sellerType === type.value;
                          const TypeIcon = type.icon;

                          return (
                            <button
                              key={type.value}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              tabIndex={selected ? 0 : -1}
                              onClick={() => {
                                setSellerType(type.value);
                                setError("");
                              }}
                              className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                                selected
                                  ? "border-[#9A6051] bg-[#9A6051]/10 shadow-[0_0_0_1px_rgba(154,96,81,0.45)]"
                                  : "border-[#624038] bg-[#120b09] hover:border-[#9A6051]/80"
                              }`}
                            >
                              <span
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                  selected
                                    ? "bg-[#9A6051] text-[#120b09]"
                                    : "bg-[#2b1d1b] text-[#d7c2bd]"
                                }`}
                              >
                                <TypeIcon className="h-5 w-5" />
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-bold text-[#f3e9e5]">
                                  {type.label}
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-[#a9958f]">
                                  {type.text}
                                </span>
                              </span>

                              {selected && (
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#9A6051] text-[#120b09]">
                                  <CheckIcon className="h-4 w-4" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Field
                      id="storeLink"
                      label="Store Link"
                      optional
                      hint="Optional: add your Etsy, Instagram, or website so we can review your storefront."
                    >
                      <input
                        id="storeLink"
                        type="url"
                        value={storeLink}
                        onChange={(e) => setStoreLink(e.target.value)}
                        placeholder="https://yourstore.com"
                        autoComplete="url"
                        className={inputClass}
                      />
                    </Field>

                    {error && (
                      <div
                        role="alert"
                        className="rounded-xl border border-[#9A6051]/40 bg-[#3b2925] px-4 py-3 text-sm text-[#f3d9d2]"
                      >
                        {error}
                      </div>
                    )}

                    <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="submit"
                        disabled={loading || cooldown}
                        className="inline-flex items-center justify-center rounded-full bg-[#9A6051] px-6 py-3.5 text-sm font-bold text-[#120b09] transition hover:bg-[#b56b59] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Submitting..." : "Apply to sell"}
                      </button>

                      <span className="text-xs text-[#776b67]">
                        {cooldown
                          ? "Please wait a moment..."
                          : "We review every application manually."}
                      </span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
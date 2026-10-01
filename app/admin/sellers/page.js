"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function AdminSellersPage() {
  const router = useRouter();

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [reviewingId, setReviewingId] =
    useState(null);

  async function loadApplications(user) {
    const token =
      await user.getIdToken();

    const response =
      await fetch(
        "/api/admin/sellers",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    if (response.status === 401) {
      router.replace(
        "/sign-in"
      );
      return;
    }

    if (response.status === 403) {
      router.replace(
        "/marketplace"
      );
      return;
    }

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Couldn't load seller applications."
      );
    }

    setApplications(
      data.applications || []
    );
  }

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          if (!user) {
            router.replace(
              "/sign-in"
            );
            return;
          }

          try {
            setLoading(true);
            setError("");

            await loadApplications(
              user
            );
          } catch (loadError) {
            console.error(
              "ADMIN SELLER LOAD ERROR:",
              loadError
            );

            setError(
              loadError?.message ||
                "Couldn't load seller applications."
            );
          } finally {
            setLoading(false);
          }
        }
      );

    return () =>
      unsubscribe();
  }, [router]);

  async function reviewApplication(
    id,
    status
  ) {
    if (reviewingId) {
      return;
    }

    try {
      setReviewingId(id);
      setError("");

      const user =
        auth.currentUser;

      if (!user) {
        router.replace(
          "/sign-in"
        );
        return;
      }

      const token =
        await user.getIdToken();

      const response =
        await fetch(
          "/api/admin/sellers",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              id,
              status,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Couldn't update the application."
        );
      }

      setApplications(
        (current) =>
          current.filter(
            (item) =>
              item.id !== id
          )
      );
    } catch (reviewError) {
      console.error(
        "SELLER REVIEW ERROR:",
        reviewError
      );

      setError(
        reviewError?.message ||
          "Couldn't update the seller application."
      );
    } finally {
      setReviewingId(
        null
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
      <div className="mx-auto max-w-6xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#9A6051]">
          THRIFTMATCH / ADMIN
        </p>

        <h1 className="text-5xl font-black tracking-tight">
          Seller review.
        </h1>

        <p className="mt-4 max-w-2xl text-[#a9958f]">
          Review pending seller applications and approve
          or reject them before they can list products.
        </p>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-800/40 bg-red-950/20 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-12 text-[#a9958f]">
            Loading seller applications...
          </p>
        ) : applications.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-[#3b2925] bg-[#211512] p-8">
            <h2 className="text-2xl font-black">
              No pending applications.
            </h2>

            <p className="mt-3 text-[#a9958f]">
              New seller applications will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-5">
            {applications.map(
              (application) => {
                const reviewing =
                  reviewingId ===
                  application.id;

                return (
                  <article
                    key={
                      application.id
                    }
                    className="rounded-3xl border border-[#3b2925] bg-[#211512] p-7"
                  >
                    <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-black">
                            {
                              application.storeName
                            }
                          </h2>

                          <span className="rounded-full border border-[#9A6051]/50 bg-[#9A6051]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#c98d7c]">
                            PENDING
                          </span>
                        </div>

                        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">

                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#776b67]">
                              Applicant
                            </p>

                            <p className="mt-1 font-semibold">
                              {
                                application.fullName
                              }
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#776b67]">
                              Type
                            </p>

                            <p className="mt-1 font-semibold">
                              {
                                application.sellerType ===
                                "thrift-store"
                                  ? "Thrift Store"
                                  : "Individual Seller"
                              }
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#776b67]">
                              Email
                            </p>

                            <p className="mt-1 font-semibold break-all">
                              {
                                application.email
                              }
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#776b67]">
                              Mobile
                            </p>

                            <p className="mt-1 font-semibold">
                              {
                                application.mobile
                              }
                            </p>
                          </div>

                        </div>

                        {application.storeLink && (
                          <a
                            href={
                              application.storeLink
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 inline-flex text-sm font-semibold text-[#c98d7c] underline underline-offset-4"
                          >
                            View store / social link →
                          </a>
                        )}

                      </div>

                      <div className="flex shrink-0 gap-3">
                        <button
                          type="button"
                          disabled={reviewing}
                          onClick={() =>
                            reviewApplication(
                              application.id,
                              "approved"
                            )
                          }
                          className="rounded-full bg-[#9A6051] px-6 py-3 text-sm font-bold text-[#120b09] transition hover:bg-[#b56b59] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {
                            reviewing
                              ? "Updating..."
                              : "Approve"
                          }
                        </button>

                        <button
                          type="button"
                          disabled={reviewing}
                          onClick={() =>
                            reviewApplication(
                              application.id,
                              "rejected"
                            )
                          }
                          className="rounded-full border border-[#624038] px-6 py-3 text-sm font-bold text-[#d9c9c3] transition hover:border-red-700 hover:bg-red-950/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>

                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </main>
  );
}
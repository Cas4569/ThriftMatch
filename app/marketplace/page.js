export default function Marketplace() {
  return (
    <main className="min-h-screen bg-[#2d1805] px-6 py-14 text-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">

        <div className="mb-14">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#c6a15b]">
            THRIFTMATCH / MARKETPLACE
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Explore Fashion.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9b2a7]">
            Find pre-loved pieces that match your style, personality and
            everyday vibe.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">

          {/* Menswear */}
          <a
            href="/marketplace/menswear"
            className="group overflow-hidden rounded-[2rem] border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#c6a15b] hover:shadow-2xl"
          >
            <div className="relative h-80 overflow-visible bg-[#3b3025]">
              <img
  src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1200&q=85"
  alt="Men's fashion"
  className="relative z-20 h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:-translate-y-2 group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.45)]"
/>
            </div>

            <div className="p-8">
              <h2 className="text-4xl font-black">
                Menswear
              </h2>

              <p className="mt-3 text-lg font-medium text-[#c6a15b]">
                Classic fits. Modern attitude.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#5a5348] px-3 py-1 text-xs font-bold tracking-wide text-[#c6a15b]">
                  TRENDING
                </span>

                <span className="rounded-full border border-[#5a5348] px-3 py-1 text-xs font-bold tracking-wide text-[#aaa399]">
                  BEST SELLERS
                </span>

                <span className="rounded-full border border-[#5a5348] px-3 py-1 text-xs font-bold tracking-wide text-[#aaa399]">
                  VINTAGE PICKS
                </span>
              </div>

              <div className="mt-7 inline-flex rounded-full border border-[#5a5348] px-6 py-3 text-sm font-bold transition group-hover:bg-[#c6a15b] group-hover:text-[#171512]">
                Explore Menswear →
              </div>
            </div>
          </a>

          {/* Womenswear */}
          <a
            href="/marketplace/womenswear"
            className="group overflow-hidden rounded-[2rem] border border-[#3b3832] bg-[#24221e] transition duration-300 hover:-translate-y-2 hover:border-[#d19a9a] hover:shadow-2xl"
          >
            <div className="relative h-80 overflow-visible bg-[#392d31]">
              <img
                src="/womenswear.jpeg"
                alt="Women's fashion"
                className="relative z-20 h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:shadow-[0_35px_70px_rgba(0,0,0,0.65)]"
              />
            </div>

            <div className="p-8">
              <h2 className="text-4xl font-black">
                Womenswear
              </h2>

              <p className="mt-3 text-lg font-medium text-[#d19a9a]">
                Bold looks. Timeless finds.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#5a5348] px-3 py-1 text-xs font-bold tracking-wide text-[#d19a9a]">
                  TRENDING
                </span>

                <span className="rounded-full border border-[#5a5348] px-3 py-1 text-xs font-bold tracking-wide text-[#aaa399]">
                  NEW FINDS
                </span>

                <span className="rounded-full border border-[#5a5348] px-3 py-1 text-xs font-bold tracking-wide text-[#aaa399]">
                  MOST LOVED
                </span>
              </div>

              <div className="mt-7 inline-flex rounded-full border border-[#5a5348] px-6 py-3 text-sm font-bold transition group-hover:bg-[#d19a9a] group-hover:text-[#171512]">
                Explore Womenswear →
              </div>
            </div>
          </a>

        </div>
      </div>
    </main>
  );
}
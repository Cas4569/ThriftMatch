export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#171717]">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold tracking-tight">
          ThriftMatch
        </h1>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="/discover" className="hover:opacity-60 transition">
            Discover
          </a>

      

          <a href="Sellers" className="hover:opacity-60 transition">
            For Sellers
          </a>

          <a
  href="/sign-in"
  className="rounded-full bg-[#171717] px-5 py-2.5 text-white hover:scale-105 transition"
>
  Sign In
</a>
        </div>
      </nav>


      {/* Hero */}
      <section className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-12 px-8 py-12 md:grid-cols-2">

        {/* Left side */}
        <div>

          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-gray-600">
            Local fashion. One marketplace.
          </p>

          <h2 className="text-6xl font-bold leading-[0.95] tracking-tight md:text-8xl">
            Find your
            <br />
            <span className="italic">next look.</span>
          </h2>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">
            Discover unique pieces from local thrift sellers,
            mix and match your outfits, and let AI help you
            create your perfect look.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

           <div className="mt-10 flex flex-wrap gap-4">

  <a
    href="/marketplace"
    className="rounded-full bg-[#171717] px-8 py-4 font-semibold text-white transition hover:scale-105"
  >
    Explore Fashion →
  </a>

  <a
    href="/stylist"
    className="rounded-full border border-[#171717] px-8 py-4 font-semibold transition hover:bg-[#171717] hover:text-white"
  >
    AI Custom Stylist ✦
  </a>

</div>

            

          </div>

        </div>


        {/* Right side — Fashion Visual */}
        <div className="relative mx-auto h-[520px] w-full max-w-lg">

          {/* Main image */}
          <div
            className="absolute right-0 top-0 h-[430px] w-[72%] rounded-[2rem] bg-cover bg-center shadow-2xl"
            style={{
              backgroundImage:
                "url('/menhome.jpeg')",
            }}
          />

          {/* Second image */}
          <div
            className="absolute bottom-0 left-0 h-[320px] w-[48%] rounded-[2rem] border-8 border-[#f5f1e8] bg-cover bg-center shadow-xl"
            style={{
              backgroundImage:
                "url('/womenhome.jpeg')",
            }}
          />

          {/* Floating AI card */}
          <div className="absolute bottom-12 right-4 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur">

            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              AI Style Match
            </p>

            <div className="mt-2 flex items-center gap-3">

              <span className="text-3xl font-bold">
                94%
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Great Match
              </span>

            </div>

            <p className="mt-2 max-w-[190px] text-xs leading-5 text-gray-500">
              Your pieces work perfectly together.
            </p>

          </div>

        </div>

      </section>


      {/* Small bottom statement */}
      <section className="border-t border-black/10 px-8 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row">
          <p>
            Discover. Mix. Match. Repeat.
          </p>

          <p>
            Made for local fashion communities.
          </p>
        </div>
      </section>

    </main>
  );
}
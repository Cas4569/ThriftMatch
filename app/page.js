export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#171717]">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold tracking-tight">
          ThriftMatch
        </h1>

        <div className="flex items-center gap-8 text-sm font-medium">
          <a href="#">Discover</a>
          <a href="#">How It Works</a>
          <a href="#">For Sellers</a>
          <button className="rounded-full bg-[#171717] px-5 py-2.5 text-white">
            Sign In
          </button>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="flex min-h-[80vh] items-center justify-center px-6">

        <div className="max-w-4xl text-center">

          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-gray-600">
            Local fashion. One marketplace.
          </p>

          <h2 className="text-6xl font-bold leading-tight tracking-tight md:text-8xl">
            Find your
            <br />
            <span className="italic">next look.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-600">
            Discover unique pieces from local thrift sellers,
            mix and match your outfits, and let AI help you
            create your perfect look.
          </p>

          <div className="mt-10 flex justify-center gap-4">

            <button className="rounded-full bg-[#171717] px-8 py-4 font-semibold text-white transition hover:scale-105">
              Explore Fashion →
            </button>

            <button className="rounded-full border border-[#171717] px-8 py-4 font-semibold transition hover:bg-[#171717] hover:text-white">
              I'm a Seller
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}
export default function Marketplace() {
return (
<main
  className="relative min-h-screen overflow-hidden px-6 py-14 text-white"
  style={{
    backgroundImage: "url('/marketplace.jpeg')",
    backgroundPosition: "center top",
    backgroundSize: "100% auto",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#087fb6",
  }}
>

  {/* =========================================================
      AMBIENT CYBER GLOW
  ========================================================== */}

  <div
    className="pointer-events-none absolute -left-40 top-[-180px] h-[600px] w-[600px] rounded-full blur-[120px]"
    style={{
      background:
        "radial-gradient(circle, rgba(130,35,255,0.42) 0%, rgba(130,35,255,0.18) 38%, transparent 70%)",
    }}
  />

  <div
    className="pointer-events-none absolute right-[-180px] top-[20%] h-[600px] w-[600px] rounded-full blur-[130px]"
    style={{
      background:
        "radial-gradient(circle, rgba(255,0,153,0.3) 0%, rgba(140,20,255,0.16) 40%, transparent 72%)",
    }}
  />

  <div
    className="pointer-events-none absolute bottom-[-300px] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-[130px]"
    style={{
      background:
        "radial-gradient(circle, rgba(75,0,255,0.25), transparent 68%)",
    }}
  />

  {/* =========================================================
      CYBER GRID
  ========================================================== */}

  <div
    className="pointer-events-none absolute inset-0 opacity-[0.13]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(174,84,255,0.35) 1px, transparent 1px),
        linear-gradient(90deg, rgba(174,84,255,0.35) 1px, transparent 1px)
      `,
      backgroundSize: "55px 55px",
      maskImage:
        "linear-gradient(to bottom, black 0%, transparent 85%)",
      WebkitMaskImage:
        "linear-gradient(to bottom, black 0%, transparent 85%)",
    }}
  />

  {/* =========================================================
      TOP HUD LINE
  ========================================================== */}

  <div className="relative z-10 mx-auto mb-12 flex max-w-7xl items-center justify-between border-b border-purple-500/20 pb-4">

    

    

  </div>

  <div className="relative z-10 mx-auto max-w-7xl">

    {/* =========================================================
        HEADER
    ========================================================== */}

    <div className="mb-14 max-w-4xl">

      <p className="mb-5 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.35em] text-fuchsia-400">
        <span className="h-px w-8 bg-fuchsia-500 shadow-[0_0_10px_#d946ef]" />
        THRIFTMATCH / MARKETPLACE
      </p>

      <h1
        className="text-5xl font-black tracking-[-0.05em] text-white md:text-8xl"
        style={{
          textShadow:
            "0 0 20px rgba(168,85,247,0.35), 0 0 60px rgba(168,85,247,0.15)",
        }}
      >
        Explore
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
          {" "}Fashion.
        </span>
      </h1>

      <div className="mt-6 flex max-w-2xl items-start gap-4">

        <div className="mt-2 h-10 w-[2px] bg-gradient-to-b from-fuchsia-400 to-transparent shadow-[0_0_12px_#d946ef]" />

        <p className="text-base leading-7 text-white/55 md:text-lg">
          Find pre-loved pieces that match your style, personality and
          everyday vibe.
          <span className="ml-2 text-purple-300/70">
            Curated for your next identity.
          </span>
        </p>

      </div>

    </div>

    {/* =========================================================
        CATEGORY CARDS
    ========================================================== */}

    <div className="grid gap-8 md:grid-cols-2">

      {/* =====================================================
          MENSWEAR
      ====================================================== */}

      <a
        href="/marketplace/menswear"
        className="group relative overflow-hidden rounded-[1.5rem] border border-[#D4AF37]/30 bg-[#0d0717]/90 transition-all duration-500 hover:-translate-y-3 hover:border-[#D4AF37] hover:shadow-[0_25px_80px_rgba(212,175,55,0.3)]"
      >

        {/* Neon edge */}

        <div className="pointer-events-none absolute inset-0 z-30 rounded-[1.5rem] border border-[#D4AF37]/0 transition duration-500 group-hover:border-[#D4AF37]/70 group-hover:shadow-[inset_0_0_30px_rgba(212,175,55,0.12)]" />

        {/* Image area */}

        <div className="relative h-80 overflow-hidden bg-[#10051d]">

          {/* Purple atmospheric glow */}

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0b0412] via-transparent to-[#D4AF37]/20 opacity-70" />

          <div className="absolute inset-0 z-10 bg-[#D4AF37]/0 mix-blend-screen transition duration-700 group-hover:bg-[#D4AF37]/10" />

          <img
            src="/menswear.jpeg"
            alt="Men's fashion"
            className="relative z-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.08] group-hover:brightness-110"
          />

          {/* Scanlines */}

          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 5px, rgba(255,255,255,0.16) 6px)",
            }}
          />

          {/* Corner HUD */}

          

          {/* Bottom image label */}

          <div className="absolute bottom-5 left-5 z-30">

            

            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Mens Division
            </p>

          </div>

        </div>

        {/* Content */}

        <div className="relative p-8">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-4xl font-black tracking-tight text-white">
              Menswear
            </h2>

            

          </div>

          <p className="text-lg font-medium text-[#D4AF37]">
            Classic fits. Modern attitude.
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-[#D4AF37]/15 pt-4">

            

            <span className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-5 py-2.5 text-xs font-bold text-[#D4AF37] transition-all duration-300 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#17130a] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]">
              Explore Menswear
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>

          </div>

        </div>

      </a>

      {/* =====================================================
          WOMENSWEAR
      ====================================================== */}

      <a
        href="/marketplace/womenswear"
        className="group relative overflow-hidden rounded-[1.5rem] border border-fuchsia-500/30 bg-[#0d0717]/90 transition-all duration-500 hover:-translate-y-3 hover:border-fuchsia-400 hover:shadow-[0_25px_80px_rgba(236,72,153,0.28)]"
      >

        {/* Neon edge */}

        <div className="pointer-events-none absolute inset-0 z-30 rounded-[1.5rem] border border-fuchsia-400/0 transition duration-500 group-hover:border-fuchsia-400/70 group-hover:shadow-[inset_0_0_30px_rgba(236,72,153,0.12)]" />

        {/* Image */}

        <div className="relative h-80 overflow-hidden bg-[#160616]">

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0b0412] via-transparent to-fuchsia-900/20 opacity-70" />

          <div className="absolute inset-0 z-10 bg-fuchsia-500/0 mix-blend-screen transition duration-700 group-hover:bg-fuchsia-500/10" />

          <img
            src="/womenswear.jpeg"
            alt="Women's fashion"
            className="relative z-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.08] group-hover:brightness-110"
          />

          {/* Scanlines */}

          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 5px, rgba(255,255,255,0.16) 6px)",
            }}
          />

          {/* HUD */}

          

          

          <div className="absolute bottom-5 left-5 z-30">

            

            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Womens Division
            </p>

          </div>

        </div>

        {/* Content */}

        <div className="relative p-8">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-4xl font-black tracking-tight text-white">
              Womenswear
            </h2>

            

          </div>

          <p className="text-lg font-medium text-fuchsia-300">
            Bold looks. Timeless finds.
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-fuchsia-500/15 pt-4">

            

            <span className="inline-flex items-center gap-3 rounded-full border border-fuchsia-400/50 bg-fuchsia-500/10 px-5 py-2.5 text-xs font-bold text-fuchsia-200 transition-all duration-300 group-hover:border-fuchsia-300 group-hover:bg-fuchsia-500 group-hover:text-white group-hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]">
              Explore Womenswear
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>

          </div>

        </div>

      </a>

    </div>

    {/* =========================================================
        BOTTOM SYSTEM TEXT
    ========================================================== */}

    <div className="mt-12 flex items-center justify-between border-t border-purple-500/10 pt-5 font-mono text-[9px] tracking-[0.25em] text-white/20">

      <span>THRIFTMATCH</span>

      <span className="hidden sm:block">
        SECOND LIFE // NEW IDENTITY
      </span>

      

    </div>

  </div>
</main>

);
}
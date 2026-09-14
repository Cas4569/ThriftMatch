"use client";

import { useRef, useState } from "react";

export default function Home() {
  const stageRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e) {
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px, y: py });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f1e8] text-[#171717]">

      {/* Hero — the "3D clothing paradise" stage */}
      <section
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative mx-auto min-h-[85vh] max-w-7xl px-8 py-12 [perspective:1400px]"
      >

        {/* Ambient glow, drifts opposite the cursor for depth */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-200/30 blur-[120px] transition-transform duration-300 ease-out"
          style={{ transform: `translate3d(${-tilt.x * 40}px, ${-tilt.y * 40}px, 0)` }}
        />

        {/* Center copy, sits behind/between the floating garments */}
        <div className="relative z-10 mx-auto max-w-2xl pt-16 text-center">
          <h2 className="text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
            Someone's closet.
            <br />
            Your next fit.
          </h2>

          <p className="mx-auto mt-6 max-w-md text-base leading-7 text-gray-600">
            Every piece here already had one life. We match it to its next —
            pulled from sellers near you, styled by AI in seconds.
          </p>

          <div className="relative mt-10 inline-block">
            <a
              href="/marketplace"
              className="inline-block bg-[#171717] py-4 pl-8 pr-10 font-semibold text-white transition hover:-translate-y-1 hover:shadow-[0_16px_30px_-10px_rgba(0,0,0,0.5)]"
              style={{ clipPath: "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)" }}
            >
              Start browsing
            </a>

            <a
              href="/stylist"
              className="absolute -right-6 -top-6 flex h-16 w-16 rotate-6 items-center justify-center rounded-full border border-dashed border-[#171717]/50 bg-[#f5f1e8] text-center font-mono text-[10px] leading-tight transition hover:rotate-0 hover:bg-[#171717] hover:text-white"
            >
              try AI styling ✦
            </a>
          </div>
        </div>

        {/* Floating garment layer — each piece drifts on its own loop AND tilts with the cursor */}
        <div
          className="float-slow absolute left-[4%] top-[8%] h-[340px] w-[170px] rounded-[1.25rem] bg-cover bg-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.35)] transition-transform duration-150 ease-out"
          style={{
            backgroundImage: "url('/menhome.jpeg')",
            transform: `rotate3d(${-tilt.y}, ${tilt.x}, 0, 12deg) translate3d(${tilt.x * 20}px, ${tilt.y * 20}px, 30px)`,
          }}
        />

        <div
          className="float-medium absolute right-[6%] top-[4%] h-[340px] w-[150px] rounded-[1.25rem] border-[6px] border-[#f5f1e8] bg-cover bg-center shadow-[0_30px_55px_-12px_rgba(0,0,0,0.3)] transition-transform duration-150 ease-out"
          style={{
            backgroundImage: "url('/womenhome.jpeg')",
            transform: `rotate3d(${-tilt.y}, ${tilt.x}, 0, -10deg) translate3d(${tilt.x * 30}px, ${tilt.y * 30}px, 50px)`,
          }}
        />

        <div
          className="float-fast absolute bottom-[10%] left-[10%] h-[270px] w-[150px] rounded-[1.25rem] bg-cover bg-center shadow-[0_25px_45px_-12px_rgba(0,0,0,0.3)] transition-transform duration-150 ease-out"
          style={{
            backgroundImage: "url('/menhome.jpeg')",
            transform: `rotate3d(${tilt.y}, ${-tilt.x}, 0, 16deg) translate3d(${-tilt.x * 25}px, ${-tilt.y * 25}px, 40px)`,
          }}
        />

        <div
          className="float-medium absolute bottom-[6%] right-[10%] h-[270px] w-[140px] rounded-[1.25rem] border-[6px] border-[#f5f1e8] bg-cover bg-center shadow-[0_30px_55px_-12px_rgba(0,0,0,0.3)] transition-transform duration-150 ease-out"
          style={{
            backgroundImage: "url('/womenhome.jpeg')",
            transform: `rotate3d(${tilt.y}, ${-tilt.x}, 0, -14deg) translate3d(${-tilt.x * 22}px, ${-tilt.y * 22}px, 35px)`,
          }}
        />

        {/* Hanging price tag, swinging on its own loop */}
        <div
          className="swing absolute right-[28%] top-[6%] origin-top"
          style={{ transform: `translate3d(${tilt.x * 15}px, ${tilt.y * 15}px, 60px)` }}
        >
          <div className="mx-auto h-[-5] w-px bg-[#171717]/40" />
          <div className="relative w-40 rounded-sm border border-dashed border-[#171717]/50 bg-white/95 px-4 py-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-[#171717]/50 bg-[#f5f1e8]" />
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">AI match</p>
            <p className="mt-1 text-2xl font-bold leading-none">94%</p>
            <p className="mt-1 font-mono text-[10px] leading-4 text-gray-500">fits your last 6 picks</p>
          </div>
        </div>

        {/* Small drifting accent dots for extra "alive" texture */}
        <span className="float-slow absolute left-[45%] top-[12%] h-2 w-2 rounded-full bg-emerald-400/70" />
        <span className="float-fast absolute right-[38%] bottom-[18%] h-2 w-2 rounded-full bg-emerald-400/70" />
        <span className="float-medium absolute left-[20%] bottom-[30%] h-1.5 w-1.5 rounded-full bg-[#171717]/30" />
      </section>

      {/* Receipt-style process strip */}
      <section className="relative border-y border-dashed border-[#171717]/20 px-8 py-10">
        <div className="mx-auto max-w-3xl font-mono text-sm">
          {[
            ["01", "Browse local drops", "near you"],
            ["02", "Get matched by AI", "in seconds"],
            ["03", "Wear something no one else owns", "always"],
          ].map(([n, item, note]) => (
            <div key={n} className="flex items-baseline gap-3 py-2">
              <span className="text-gray-400">{n}</span>
              <span>{item}</span>
              <span className="flex-1 border-b border-dotted border-[#171717]/30" />
              <span className="text-gray-400">{note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom statement */}
      <section className="relative px-8 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row md:items-center">
          <p className="font-mono">one rack. every neighborhood.</p>
          <p>Built by thrifters, for thrifters.</p>
        </div>
      </section>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(14px); }
        }
        @keyframes floatFast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes swing {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        .float-slow { animation: floatSlow 6s ease-in-out infinite; }
        .float-medium { animation: floatMedium 5s ease-in-out infinite; }
        .float-fast { animation: floatFast 4s ease-in-out infinite; }
        .swing { animation: swing 5s ease-in-out infinite; }
      `}</style>
    </main>
  );
}
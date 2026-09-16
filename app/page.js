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

  // Chrome frame — boosted contrast + a clear outer glow so it reads
  // clearly as metal against the sky instead of blending in.
  const chromeFrame = {
    background:
      "linear-gradient(135deg, #ffffff 0%, #d3e7ef 12%, #7f9aa8 28%, #ffffff 44%, #a8c2cd 60%, #33495a 78%, #eef7fb 100%)",
    boxShadow:
      "inset 0 2px 1px rgba(255,255,255,0.95), inset 0 -3px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.7), 0 0 18px rgba(255,255,255,0.8), 0 0 40px rgba(150,210,235,0.6), 0 25px 45px -15px rgba(0,0,0,0.4)",
  };

  // True mirror-sphere gradient — bright highlight + faint reflection
  // of sky/hill tones, like a real chrome ball.
  function mirrorSphere() {
    return {
      background:
        "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.5) 12%, transparent 26%), " +
        "radial-gradient(circle at 68% 78%, rgba(143,214,107,0.4) 0%, transparent 42%), " +
        "radial-gradient(circle at 50% 50%, #eaf6fb 0%, #9fc2d4 45%, #395064 85%, #1d2f3c 100%)",
      boxShadow:
        "0 10px 22px rgba(0,0,0,0.25), inset 0 0 16px rgba(255,255,255,0.35), inset 0 -8px 14px rgba(20,40,50,0.35)",
    };
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden text-[#12212f]"
      style={{
        background: "linear-gradient(180deg, #3f7fc4 0%, #6fa3d6 30%, #a9cfe8 55%, #d7ecf4 75%)",
      }}
    >

      {/* Cloud texture */}
      <div className="pointer-events-none absolute -left-20 top-6 h-56 w-[460px] rounded-full bg-white/55 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-44 w-[380px] rounded-full bg-white/45 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-[340px] rounded-full bg-white/35 blur-3xl" />

      {/* Corner ticker labels */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-6 font-mono text-[10px] uppercase tracking-widest text-white/80">
        <span>// thriftmatch.exe</span>
        <span className="hidden md:inline">ai styled. always alive.</span>
        <span>est. today</span>
      </div>

      {/* Distant glassy skyline, sitting on the horizon like the reference */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[210px] z-0 flex items-end justify-center gap-3 opacity-90">
        {[
          { w: 34, h: 150 },
          { w: 46, h: 210 },
          { w: 30, h: 120 },
          { w: 52, h: 260 },
          { w: 36, h: 170 },
          { w: 44, h: 230 },
          { w: 28, h: 110 },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              width: b.w,
              height: b.h,
              background:
                "linear-gradient(180deg, #eaf6fb 0%, #9fc2d4 40%, #4d6b80 100%)",
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, rgba(20,40,55,0.25) 0px, rgba(20,40,55,0.25) 1px, transparent 1px, transparent 8px)",
              boxShadow: "0 0 20px rgba(200,230,245,0.5)",
            }}
            className="rounded-t-sm"
          />
        ))}
      </div>

      {/* Rolling hill, echoing the classic Bliss horizon */}
      <div
        className="pointer-events-none absolute inset-x-[-15%] bottom-[-260px] z-[1] h-[420px] rounded-[50%]"
        style={{
          background: "linear-gradient(180deg, #8fd66b 0%, #5fae42 45%, #3d8a2c 100%)",
          boxShadow: "0 -20px 60px rgba(255,255,255,0.25) inset",
        }}
      />

      {/* Hero — the "3D clothing paradise" stage */}
      <section
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 mx-auto min-h-[80vh] max-w-7xl px-8 py-6 [perspective:1400px]"
      >

        {/* Ambient glow, drifts opposite the cursor for depth */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/40 blur-[120px] transition-transform duration-300 ease-out"
          style={{ transform: `translate3d(${-tilt.x * 40}px, ${-tilt.y * 40}px, 0)` }}
        />

        {/* Center copy */}
        <div className="relative z-10 mx-auto max-w-2xl pt-10 text-center">
          <h2
            className="text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl"
            style={{
              WebkitTextStroke: "2px #17324a",
              textShadow: "4px 4px 0 #17324a, 0 14px 34px rgba(0,0,0,0.3)",
            }}
          >
            Someone's closet.
            <br />
            Your next fit.
          </h2>

          <p className="mx-auto mt-6 max-w-md text-base font-medium leading-7 text-white/95" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.25)" }}>
            Every piece here already had one life. We match it to its next —
            pulled from sellers near you, styled by AI in seconds.
          </p>

          <div className="mt-10 flex flex-col items-center">
            <a
              href="/marketplace"
              className="inline-block bg-[#171717] py-4 pl-8 pr-10 font-semibold text-white transition hover:-translate-y-1 hover:shadow-[0_16px_30px_-10px_rgba(0,0,0,0.5)]"
              style={{ clipPath: "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)" }}
            >
              Start browsing
            </a>

            <a
              href="/stylist"
              className="mt-5 flex h-24 w-24 items-center justify-center rounded-full px-3 text-center font-mono text-[11px] font-semibold uppercase leading-tight tracking-tight text-[#17324a] transition hover:-translate-y-1"
              style={{
                background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #cfe8f5 45%, #7fa8c2 100%)",
                boxShadow:
                  "inset 0 2px 2px rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,0,0,0.15), 0 10px 22px -12px rgba(0,0,0,0.4), 0 0 0 2px #17324a",
              }}
            >
              Try AI styling
            </a>
          </div>
        </div>

        {/* Floating garment layer */}
        {/* Frame 1 */}
        <div
          className="float-slow absolute left-[4%] top-[8%] h-[340px] w-[170px] rounded-[1.25rem] p-[5px] transition-transform duration-150 ease-out"
          style={{
            ...chromeFrame,
            transform: `rotate3d(${-tilt.y}, ${tilt.x}, 0, 12deg) translate3d(${tilt.x * 20}px, ${tilt.y * 20}px, 30px)`,
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[1rem]">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/menhome.jpeg')" }} />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 22%, transparent 40%, transparent 100%)" }}
            />
          </div>
        </div>

        {/* Frame 2 */}
        <div
          className="float-medium absolute right-[6%] top-[4%] h-[340px] w-[150px] rounded-[1.25rem] p-[5px] transition-transform duration-150 ease-out"
          style={{
            ...chromeFrame,
            transform: `rotate3d(${-tilt.y}, ${tilt.x}, 0, -10deg) translate3d(${tilt.x * 30}px, ${tilt.y * 30}px, 50px)`,
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[1rem]">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/womenhome.jpeg')" }} />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 22%, transparent 40%, transparent 100%)" }}
            />
          </div>
        </div>

        {/* Frame 3 */}
        <div
          className="float-fast absolute bottom-[10%] left-[10%] h-[270px] w-[150px] rounded-[1.25rem] p-[5px] transition-transform duration-150 ease-out"
          style={{
            ...chromeFrame,
            transform: `rotate3d(${tilt.y}, ${-tilt.x}, 0, 16deg) translate3d(${-tilt.x * 25}px, ${-tilt.y * 25}px, 40px)`,
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[1rem]">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/menhome.jpeg')" }} />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 22%, transparent 40%, transparent 100%)" }}
            />
          </div>
        </div>

        {/* Frame 4 */}
        <div
          className="float-medium absolute bottom-[6%] right-[10%] h-[270px] w-[140px] rounded-[1.25rem] p-[5px] transition-transform duration-150 ease-out"
          style={{
            ...chromeFrame,
            transform: `rotate3d(${tilt.y}, ${-tilt.x}, 0, -14deg) translate3d(${-tilt.x * 22}px, ${-tilt.y * 22}px, 35px)`,
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[1rem]">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/womenhome.jpeg')" }} />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 22%, transparent 40%, transparent 100%)" }}
            />
          </div>
        </div>

        {/* Hanging price tag */}
        <div
          className="swing absolute right-[28%] top-[6%] origin-top"
          style={{ transform: `translate3d(${tilt.x * 15}px, ${tilt.y * 15}px, 60px)` }}
        >
          <div className="mx-auto h-[-5] w-px bg-white/50" />
          <div className="relative w-40 rounded-sm border border-dashed border-[#17324a]/40 bg-white/95 px-4 py-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">
            <span
              className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
              style={{ background: "radial-gradient(circle at 35% 30%, #ffffff, #b8d4e0 45%, #5c7480 100%)", boxShadow: "0 0 6px rgba(180,220,235,0.8)" }}
            />
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">AI match</p>
            <p className="mt-1 text-2xl font-bold leading-none text-[#12212f]">94%</p>
            <p className="mt-1 font-mono text-[10px] leading-4 text-gray-500">fits your last 6 picks</p>
          </div>
        </div>

        {/* True mirror-sphere bubbles */}
        <span className="float-slow absolute left-[45%] top-[10%] h-10 w-10 rounded-full" style={mirrorSphere()} />
        <span className="float-fast absolute right-[36%] bottom-[16%] h-14 w-14 rounded-full" style={mirrorSphere()} />
        <span className="float-medium absolute left-[18%] bottom-[28%] h-7 w-7 rounded-full" style={mirrorSphere()} />
        <span className="float-slow absolute right-[10%] top-[32%] h-8 w-8 rounded-full" style={mirrorSphere()} />
      </section>

      {/* Bottom statement */}
      <section className="relative z-10 bg-[#3d8a2c] px-8 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/90 md:flex-row md:items-center">
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
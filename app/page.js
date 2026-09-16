"use client";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Home() {
  const stageRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  function handleMouseMove(e) {
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px, y: py });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const chromeFrame = {
    background: "linear-gradient(135deg, #ffffff 0%, #cfe8f5 20%, #6fb8e0 45%, #ffffff 65%, #a8d8ee 85%, #ffffff 100%)",
    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,60,100,0.25), 0 0 0 1px rgba(255,255,255,0.6), 0 20px 45px rgba(0,40,80,0.35)",
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundPosition: "center top",
        backgroundSize: "100% auto",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#087fb6",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,24,58,0.18) 0%, rgba(3,24,58,0.08) 42%, rgba(3,24,58,0.3) 100%), radial-gradient(ellipse at center, transparent 20%, rgba(3,24,58,0.18) 100%)",
        }}
      />

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-8 py-6" style={{ textShadow: "0 2px 5px rgba(0,25,65,0.9)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-white/20 text-xs font-black backdrop-blur">
            tm
          </div>
          <span className="text-xl font-bold tracking-tight">ThriftMatch</span>
        </div>

        <p className="hidden font-mono text-xs tracking-[0.3em] text-white/80 md:block">
          // THRIFTMATCH.EXE
        </p>

        <div className="flex items-center gap-6 text-sm font-semibold">
          <a href="/Sellers" className="transition hover:opacity-70">For Sellers</a>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-xs font-bold">
                {user.email?.[0]?.toUpperCase() || "H"}
              </div>
              <button type="button" onClick={() => signOut(auth)} className="transition hover:opacity-70">
                Sign out
              </button>
            </div>
          ) : (
            <a href="/sign-in" className="transition hover:opacity-70">
              Sign in
            </a>
          )}
        </div>
      </header>

      {/* Bubbles */}
      {[
        { top: "14%", left: "6%", size: 34 },
        { top: "60%", left: "31%", size: 26 },
        { top: "70%", left: "62%", size: 30 },
        { top: "16%", right: "34%", size: 22 },
      ].map((b, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            top: b.top,
            left: b.left,
            right: b.right,
            width: b.size,
            height: b.size,
            background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95), rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 70%)",
            boxShadow: "0 8px 18px rgba(0,60,100,0.15), inset 0 0 8px rgba(255,255,255,0.6)",
          }}
        />
      ))}

      {/* Hero stage */}
      <section
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 mx-auto min-h-[80vh] max-w-7xl px-8 py-6 [perspective:1400px]"
      >
        {/* Glowing orbit ring behind the headline */}
        <div
          className="pointer-events-none absolute left-1/2 top-[28%] h-[90px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            border: "3px solid rgba(255,255,255,0.75)",
            boxShadow: "0 0 25px rgba(255,255,255,0.6), 0 0 60px rgba(120,200,255,0.4)",
            transform: `translate(-50%, -50%) rotate(-6deg)`,
          }}
        />

        <p
          className="relative z-20 mb-2 text-center font-mono text-xs font-bold tracking-[0.3em] text-white"
          style={{ textShadow: "0 2px 5px rgba(0,25,65,0.95), 0 0 10px rgba(0,25,65,0.7)" }}
        >
          AI STYLED. ALWAYS ALIVE.
        </p>

        {/* Center copy */}
        <div className="relative z-10 mx-auto max-w-2xl rounded-[2rem] border border-white/25 bg-[#062d50]/25 px-8 pb-8 pt-6 text-center shadow-[0_18px_45px_rgba(0,25,65,0.3)] backdrop-blur-[2px]">
          <h2
            className="text-6xl font-black leading-[1.02] tracking-tight md:text-8xl"
            style={{
              WebkitTextStroke: "1px rgba(0,35,75,0.8)",
              textShadow: "0 3px 0 rgba(0,35,75,0.9), 0 8px 18px rgba(0,20,60,0.85), 0 0 12px rgba(255,255,255,0.65)",
            }}
          >
            Someone's
            <br />
            closet.
            <br />
            Your next fit.
          </h2>

          <p
            className="mx-auto mt-6 max-w-md text-base font-semibold leading-7 text-white"
            style={{ textShadow: "0 2px 4px rgba(0,25,65,0.95), 0 0 8px rgba(0,25,65,0.75)" }}
          >
            Every piece here already had one life. We match it to its next —
            pulled from sellers near you, styled by AI in seconds.
          </p>

          <div className="mt-10 flex flex-col items-center gap-6">
            <a
              href="/marketplace"
              className="inline-flex items-center gap-3 rounded-full bg-[#0d2b4e] px-8 py-4 font-semibold text-white shadow-[0_10px_25px_rgba(0,30,60,0.4)] transition hover:-translate-y-1"
            >
              Start browsing
              <span>→</span>
            </a>

            <a
              href="/stylist"
              className="flex flex-col items-center font-mono text-xs font-bold uppercase tracking-wide text-white transition hover:-translate-y-1"
              style={{ textShadow: "0 2px 4px rgba(0,25,65,0.95)" }}
            >
              Try AI Styling
              <span className="mt-1">↓</span>
            </a>
          </div>
        </div>

        {/* Floating garment frames */}
        <div
          className="float-slow absolute left-[4%] top-[6%] h-[340px] w-[170px] rounded-[1.5rem] p-[6px] transition-transform duration-150 ease-out"
          style={{
            ...chromeFrame,
            transform: `rotate3d(${-tilt.y}, ${tilt.x}, 0, 10deg) translate3d(${tilt.x * 20}px, ${tilt.y * 20}px, 30px)`,
          }}
        >
          <div className="h-full w-full overflow-hidden rounded-[1.2rem]">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/menhome.jpeg')" }} />
          </div>
        </div>

        <div
          className="float-medium absolute right-[6%] top-[2%] h-[410px] w-[150px] rounded-[1.5rem] p-[6px] transition-transform duration-150 ease-out"
          style={{
            ...chromeFrame,
            transform: `rotate3d(${-tilt.y}, ${tilt.x}, 0, -10deg) translate3d(${tilt.x * 30}px, ${tilt.y * 30}px, 50px)`,
          }}
        >
          <div className="h-full w-full overflow-hidden rounded-[1.2rem]">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/womenhome.jpeg')" }} />
          </div>
        </div>

        <div
          className="float-fast absolute bottom-[8%] left-[10%] h-[340px] w-[150px] rounded-[1.5rem] p-[6px] transition-transform duration-150 ease-out"
          style={{
            ...chromeFrame,
            transform: `rotate3d(${tilt.y}, ${-tilt.x}, 0, 14deg) translate3d(${-tilt.x * 25}px, ${-tilt.y * 25}px, 40px)`,
          }}
        >
          <div className="h-full w-full overflow-hidden rounded-[1.2rem]">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/menhome2.jpeg')" }} />
          </div>
        </div>

        <div
          className="float-medium absolute bottom-[4%] right-[10%] h-[340px] w-[150px] rounded-[1.5rem] p-[6px] transition-transform duration-150 ease-out"
          style={{
            ...chromeFrame,
            transform: `rotate3d(${tilt.y}, ${-tilt.x}, 0, -14deg) translate3d(${-tilt.x * 22}px, ${-tilt.y * 22}px, 35px)`,
          }}
        >
          <div className="h-full w-full overflow-hidden rounded-[1.2rem]">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/womenhome1.jpeg')" }} />
          </div>
        </div>

        {/* Hanging AI match tag */}
        <div
          className="swing absolute right-[28%] top-[-8%] z-30 origin-top"
          style={{ transform: `translate3d(${tilt.x * 15}px, ${tilt.y * 15}px, 60px)` }}
        >
          <div className="mx-auto h-8 w-px bg-white/70" />
          <div className="relative w-40 rotate-[5deg] rounded-sm border border-white/60 bg-white px-4 py-3 text-[#0d2b4e] shadow-[0_18px_35px_rgba(0,40,80,0.4)]">
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-[#0d2b4e]/40 bg-white" />
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#5a6b7a]">AI match</p>
            <p className="mt-1 text-3xl font-black leading-none">94%</p>
            <p className="mt-1 font-mono text-[10px] leading-4 text-[#5a6b7a]">fits your last 6 picks</p>
          </div>
        </div>
      </section>

      <footer className="relative z-50 flex items-center justify-between px-8 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
        <span>One rack. Every neighborhood.</span>
        <span>Built by thrifters, for thrifters.</span>
      </footer>

      <style>{`
        @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes floatMedium { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(12px); } }
        @keyframes floatFast { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @keyframes swing { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        .float-slow { animation: floatSlow 6s ease-in-out infinite; }
        .float-medium { animation: floatMedium 5s ease-in-out infinite; }
        .float-fast { animation: floatFast 4s ease-in-out infinite; }
        .swing { animation: swing 5s ease-in-out infinite; }
      `}</style>
    </main>
  );
}
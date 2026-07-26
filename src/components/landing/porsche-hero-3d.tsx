"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Gauge, Zap, Flame, Cpu, Activity, Eye, RotateCcw } from "lucide-react";

export function PorscheHero3D() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isRevving, setIsRevving] = useState(false);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [speedometer, setSpeedometer] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Scroll-driven parallax depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(scrollY / Math.max(maxScroll, 1), 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse parallax tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseX(x);
    setMouseY(y);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(0);
    setMouseY(0);
  }, []);

  // Speedometer animation on rev
  const triggerRev = useCallback(() => {
    setIsRevving(true);
    setSpeedometer(0);
    let speed = 0;
    const interval = setInterval(() => {
      speed += Math.random() * 18 + 8;
      if (speed >= 320) {
        speed = 320;
        clearInterval(interval);
        setTimeout(() => {
          setIsRevving(false);
          setSpeedometer(0);
        }, 1200);
      }
      setSpeedometer(Math.round(speed));
    }, 50);
  }, []);

  // Floating particle generation
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 3,
    opacity: Math.random() * 0.6 + 0.2,
  }));

  const tiltX = mouseY * -8;
  const tiltY = mouseX * 12;
  const scrollShift = scrollProgress * 60;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-7xl mx-auto mt-16 mb-8 select-none overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Cinematic Ambient Glow Spheres */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-700"
        style={{
          width: isRevving ? "900px" : "700px",
          height: isRevving ? "500px" : "350px",
          background: `radial-gradient(ellipse, ${isRevving ? "rgba(255,42,75,0.6)" : "rgba(255,42,75,0.25)"} 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(220,38,38,0.12) 0%, transparent 70%)", filter: "blur(100px)" }} />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(255,100,50,0.08) 0%, transparent 70%)", filter: "blur(100px)" }} />

      {/* Floating Crimson Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `rgba(255, 42, 75, ${p.opacity})`,
              animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
              boxShadow: `0 0 ${p.size * 3}px rgba(255, 42, 75, ${p.opacity * 0.5})`,
            }}
          />
        ))}
      </div>

      {/* === Main 3D Car Stage === */}
      <div
        className="relative z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${-scrollShift * 0.15}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Smoke / Atmosphere Layer (behind car) */}
        <div
          className="absolute inset-0 z-0 transition-opacity duration-500"
          style={{
            opacity: isRevving ? 0.8 : 0.3,
            transform: `translateZ(-50px) scale(1.15) translateX(${mouseX * -15}px)`,
          }}
        >
          <Image
            src="/car-smoke.png"
            alt="Speed atmosphere"
            fill
            className="object-cover mix-blend-screen"
            sizes="100vw"
            priority
          />
        </div>

        {/* === REAL PHOTOREALISTIC CAR IMAGE === */}
        <div
          className="relative z-10 flex items-center justify-center py-8"
          style={{
            transform: `translateZ(80px) translateX(${mouseX * 20}px) translateY(${mouseY * 8}px)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <div className="relative w-full max-w-4xl aspect-[16/9]">
            <Image
              src="/porsche-hero.png"
              alt="LinkedForge AI — High-Performance Content Engine"
              fill
              className="object-contain drop-shadow-[0_30px_80px_rgba(255,42,75,0.5)] transition-all duration-500"
              style={{
                filter: isRevving
                  ? "brightness(1.3) contrast(1.15) drop-shadow(0 40px 100px rgba(255,42,75,0.8))"
                  : "brightness(1.05) contrast(1.05)",
              }}
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />

            {/* LED Headlight Glow Overlay */}
            {headlightsOn && (
              <>
                <div
                  className="absolute right-[8%] top-[38%] w-24 h-12 rounded-full pointer-events-none animate-pulse"
                  style={{
                    background: "radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,42,75,0.4) 40%, transparent 70%)",
                    filter: "blur(8px)",
                  }}
                />
                <div
                  className="absolute right-0 top-[30%] w-[250px] h-[80px] pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, rgba(255,255,255,0.15), transparent)",
                    filter: "blur(20px)",
                    transform: "skewY(-5deg)",
                    opacity: 0.7,
                  }}
                />
              </>
            )}

            {/* Engine Rev Exhaust Fire */}
            {isRevving && (
              <div className="absolute left-[2%] top-[55%] w-32 h-16 pointer-events-none animate-pulse">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: "radial-gradient(ellipse, rgba(255,140,0,0.9) 0%, rgba(255,42,75,0.6) 40%, transparent 70%)",
                    filter: "blur(12px)",
                    animation: "exhaustFlicker 0.15s ease-in-out infinite alternate",
                  }}
                />
              </div>
            )}

            {/* Ground Reflection */}
            <div
              className="absolute bottom-[-20%] left-[10%] right-[10%] h-[40%] pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, rgba(255,42,75,0.15), transparent)",
                filter: "blur(30px)",
                transform: "scaleY(-0.4) rotateX(20deg)",
                opacity: isRevving ? 0.8 : 0.4,
              }}
            />
          </div>
        </div>

        {/* Speedometer HUD Overlay (appears on rev) */}
        {isRevving && (
          <div
            className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-8 py-4 rounded-2xl border border-red-500/60 bg-black/80 backdrop-blur-2xl shadow-2xl shadow-red-950"
            style={{ transform: "translateZ(120px)" }}
          >
            <div className="text-center">
              <div className="text-5xl font-black font-mono text-white tabular-nums tracking-tighter">{speedometer}</div>
              <div className="text-[10px] text-red-400 font-mono uppercase tracking-widest mt-1">KM/H</div>
            </div>
            <div className="w-px h-16 bg-red-500/40" />
            <div className="text-center">
              <div className="text-3xl font-black font-mono text-red-400 tabular-nums">{Math.min(Math.round(speedometer * 28), 9000)}</div>
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1">RPM</div>
            </div>
            <div className="w-px h-16 bg-red-500/40" />
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-6 rounded-sm transition-all duration-100"
                    style={{
                      background: speedometer / 40 >= i ? (i > 6 ? "#ff2a4b" : "#10b981") : "#1a1a2b",
                      boxShadow: speedometer / 40 >= i ? `0 0 8px ${i > 6 ? "rgba(255,42,75,0.6)" : "rgba(16,185,129,0.4)"}` : "none",
                    }}
                  />
                ))}
              </div>
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">POWER</div>
            </div>
          </div>
        )}
      </div>

      {/* === Bottom HUD Telemetry Gauges === */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 relative z-20 px-4">
        <TelemetryCard icon={Gauge} label="ENGAGEMENT VELOCITY" value="0→100K" sub="Reach in 30 Seconds" subColor="text-emerald-400" />
        <TelemetryCard icon={Cpu} label="AI ENGINE" value="DeepSeek V4" sub="9,000 RPM Copy Power" subColor="text-red-400" />
        <TelemetryCard icon={Activity} label="DWELL TIME" value="99.8%" sub="Algorithm Signal Max" subColor="text-emerald-400" />
        <TelemetryCard icon={Flame} label="CONVERSION" value="4.8x Pipeline" sub="High-Ticket Leads" subColor="text-red-400" />
      </div>

      {/* Interactive Control Bar */}
      <div className="flex flex-wrap justify-center items-center gap-3 mt-5 px-4 relative z-20">
        <button
          type="button"
          onClick={triggerRev}
          disabled={isRevving}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 border border-red-500/60 text-white text-xs font-bold font-mono uppercase tracking-wider shadow-lg shadow-red-950/60 hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50"
        >
          <Flame className="w-4 h-4 group-hover:animate-pulse" />
          {isRevving ? `REVVING — ${speedometer} KM/H` : "REV ENGINE"}
        </button>

        <button
          type="button"
          onClick={() => setHeadlightsOn(!headlightsOn)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c0c18] border border-white/10 text-slate-300 text-xs font-bold font-mono uppercase tracking-wider hover:bg-white/5 hover:border-red-500/30 transition-all duration-200"
        >
          <Eye className="w-4 h-4 text-red-400" />
          LASER {headlightsOn ? "ON" : "OFF"}
        </button>
      </div>

      {/* CSS Keyframe Animations */}
      <style jsx>{`
        @keyframes floatParticle {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-40px) translateX(20px) scale(1.5); opacity: 0.1; }
        }
        @keyframes exhaustFlicker {
          0% { transform: scaleX(1) scaleY(1); opacity: 0.8; }
          100% { transform: scaleX(1.3) scaleY(0.7); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function TelemetryCard({
  icon: Icon,
  label,
  value,
  sub,
  subColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  subColor: string;
}) {
  return (
    <div className="stitch-card p-4 rounded-2xl border border-red-900/30 bg-[#090912]/90 backdrop-blur-2xl space-y-1.5 group hover:border-red-500/50 transition-all duration-300">
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest">
        <span>{label}</span>
        <Icon className="w-4 h-4 text-red-500/70 group-hover:text-red-400 transition-colors" />
      </div>
      <div className="text-xl font-black text-white font-mono tracking-tight">{value}</div>
      <div className={`text-[11px] ${subColor} font-mono`}>{sub}</div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Gauge, Zap, Flame, Cpu, ShieldCheck, Eye, Compass, Activity, Play, RotateCcw, Volume2, Sparkles } from "lucide-react";

export function PorscheHero3D() {
  const [rotation, setRotation] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [headlights, setHeadlights] = useState(true);
  const [selectedColor, setSelectedColor] = useState<"crimson" | "scarlet" | "carbon" | "white">("crimson");
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isRevving, setIsRevving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-driven 3D rotation & mouse tilt effect
  useEffect(() => {
    const handleScroll = () => {
      if (!isAutoSpin) return;
      const scrollY = window.scrollY;
      // Smooth scroll rotation angle
      const calculatedRotation = (scrollY * 0.4) % 360;
      setRotation(calculatedRotation);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAutoSpin]);

  // Auto rotation timer when idle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoSpin) {
      interval = setInterval(() => {
        setRotation((prev) => (prev + 0.8) % 360);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isAutoSpin]);

  // Interactive mouse move tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const mousePitch = -(y / rect.height) * 20;
    setPitch(mousePitch);
  };

  const handleMouseLeave = () => {
    setPitch(0);
  };

  const triggerEngineRev = () => {
    setIsRevving(true);
    setTimeout(() => setIsRevving(false), 2000);
  };

  const colors = {
    crimson: { main: "#ff2a4b", bodyGradient: "from-red-600 via-rose-700 to-red-950", glow: "rgba(255,42,75,0.7)" },
    scarlet: { main: "#ef4444", bodyGradient: "from-red-500 via-red-700 to-[#180508]", glow: "rgba(239,68,68,0.7)" },
    carbon: { main: "#27272a", bodyGradient: "from-zinc-700 via-zinc-900 to-black", glow: "rgba(255,255,255,0.3)" },
    white: { main: "#ffffff", bodyGradient: "from-slate-100 via-slate-300 to-slate-900", glow: "rgba(255,255,255,0.7)" },
  };

  const activeColor = colors[selectedColor];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-6xl mx-auto my-8 perspective-1000 select-none"
    >
      {/* Laser Headlight Beams & Background Crimson Underglow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] rounded-full blur-[130px] transition-all duration-500 pointer-events-none"
        style={{ background: activeColor.glow, opacity: isRevving ? 0.9 : 0.4 }}
      />

      {/* 3D Chassis Container */}
      <div
        className="relative transform-3d transition-transform duration-200 ease-out py-12 px-4 flex flex-col items-center"
        style={{
          transform: `rotateY(${rotation}deg) rotateX(${12 + pitch}deg)`,
        }}
      >
        {/* Aggressive Porsche 911 GT3 RS / Supercar Vector Canvas */}
        <div className="relative w-full max-w-3xl aspect-[21/9] flex items-center justify-center">
          <svg
            viewBox="0 0 1000 420"
            className="w-full h-full filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Body Metallic Gradient */}
              <linearGradient id="porscheBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={selectedColor === "crimson" ? "#ff2a4b" : selectedColor === "scarlet" ? "#ef4444" : selectedColor === "carbon" ? "#3f3f46" : "#ffffff"} />
                <stop offset="50%" stopColor={selectedColor === "crimson" ? "#991b1b" : selectedColor === "scarlet" ? "#7f1d1d" : selectedColor === "carbon" ? "#18181b" : "#94a3b8"} />
                <stop offset="100%" stopColor="#050508" />
              </linearGradient>

              {/* Carbon Fiber Roof Gradient */}
              <linearGradient id="carbonRoof" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#181824" />
                <stop offset="50%" stopColor="#090910" />
                <stop offset="100%" stopColor="#181824" />
              </linearGradient>

              {/* Headlight Laser Beams */}
              <radialGradient id="laserBeam" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="40%" stopColor={activeColor.main} stopOpacity="0.8" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              {/* Exhaust Flames */}
              <linearGradient id="exhaustFlame" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#ff2a4b" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>

            {/* Ground Shadow & Crimson Underglow */}
            <ellipse cx="500" cy="380" rx="420" ry="25" fill="#000000" opacity="0.85" />
            <ellipse
              cx="500"
              cy="380"
              rx="380"
              ry="18"
              fill={activeColor.main}
              opacity={isRevving ? "0.9" : "0.5"}
              className="transition-opacity duration-300"
            />

            {/* Porsche GT3 RS Aerodynamic Giant Rear Wing */}
            <path d="M120 140 L260 130 L270 150 L130 160 Z" fill="url(#carbonRoof)" stroke="#ff2a4b" strokeWidth="2" />
            <path d="M140 160 L145 220 L165 220 L160 160 Z" fill="#0c0c14" />
            <path d="M230 150 L235 220 L255 220 L250 150 Z" fill="#0c0c14" />

            {/* Main Porsche Fastback Roofline & Hood Silhouette */}
            <path
              d="M150 250 C180 200, 320 150, 480 150 C620 150, 780 210, 880 260 C930 280, 960 300, 960 320 L940 350 L880 355 L160 355 L120 330 Z"
              fill="url(#porscheBody)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />

            {/* Glass Cabin & Windshield */}
            <path d="M360 160 C420 160, 560 170, 680 220 C640 220, 480 220, 360 220 Z" fill="#07070d" opacity="0.9" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <path d="M420 165 C480 165, 580 180, 670 225 C620 225, 520 225, 420 225 Z" fill="url(#porscheBody)" opacity="0.3" />

            {/* Side Air Intake Vents & Aerodynamic Slash */}
            <path d="M380 260 L460 260 L440 320 L360 320 Z" fill="#07070e" stroke="#ff2a4b" strokeWidth="1" />
            <path d="M720 270 L800 270 L780 310 L700 310 Z" fill="#07070e" stroke="#ff2a4b" strokeWidth="1" />

            {/* Wheel Arch Front & Rear */}
            <circle cx="280" cy="340" r="55" fill="#050508" stroke="#ff2a4b" strokeWidth="3" />
            <circle cx="760" cy="340" r="55" fill="#050508" stroke="#ff2a4b" strokeWidth="3" />

            {/* Center Lock Racing Rims */}
            <circle cx="280" cy="340" r="42" fill="url(#carbonRoof)" />
            <circle cx="760" cy="340" r="42" fill="url(#carbonRoof)" />

            {/* Red Brake Calipers */}
            <path d="M265 320 C280 310, 295 320, 295 335 Z" fill="#ff2a4b" />
            <path d="M745 320 C760 310, 775 320, 775 335 Z" fill="#ff2a4b" />

            {/* Aggressive LED Matrix Headlight Beams */}
            {headlights && (
              <>
                <circle cx="890" cy="285" r="14" fill="url(#laserBeam)" className="animate-pulse" />
                <path d="M895 285 L1000 260 L1000 320 Z" fill="url(#laserBeam)" opacity="0.75" />
              </>
            )}

            {/* Quad Rear Exhaust Pipe Flames on Rev */}
            {isRevving && (
              <g className="animate-pulse">
                <ellipse cx="110" cy="335" rx="35" ry="12" fill="url(#exhaustFlame)" />
                <ellipse cx="110" cy="348" rx="30" ry="10" fill="url(#exhaustFlame)" />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Cyber HUD Telemetry Telematics Overlays */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 relative z-20">
        {/* Metric 1 */}
        <div className="stitch-card p-4 rounded-2xl border border-red-900/40 bg-[#090912]/90 backdrop-blur-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>ENGAGEMENT VELOCITY</span>
            <Gauge className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tracking-tight">0-100K Reach</div>
          <div className="text-[11px] text-emerald-400 font-mono">In Under 30 Seconds</div>
        </div>

        {/* Metric 2 */}
        <div className="stitch-card p-4 rounded-2xl border border-red-900/40 bg-[#090912]/90 backdrop-blur-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>AI HORSEPOWER</span>
            <Cpu className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tracking-tight">DeepSeek V4 Pro</div>
          <div className="text-[11px] text-red-400 font-mono">9,000 RPM Copy Engine</div>
        </div>

        {/* Metric 3 */}
        <div className="stitch-card p-4 rounded-2xl border border-red-900/40 bg-[#090912]/90 backdrop-blur-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>DWELL TIME SCORE</span>
            <Activity className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tracking-tight">99.8% Dwell</div>
          <div className="text-[11px] text-emerald-400 font-mono">Algorithm Signal Maxed</div>
        </div>

        {/* Metric 4 */}
        <div className="stitch-card p-4 rounded-2xl border border-red-900/40 bg-[#090912]/90 backdrop-blur-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>LEAD CONVERSION</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tracking-tight">4.8x Pipeline</div>
          <div className="text-[11px] text-red-400 font-mono">High-Ticket Conversion</div>
        </div>
      </div>

      {/* Interactive 3D Control Panel */}
      <div className="flex flex-wrap justify-between items-center gap-4 mt-6 p-4 rounded-2xl glass border border-red-900/30 bg-[#08080f]/90">
        {/* Color Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">CHASSIS FINISH:</span>
          <div className="flex gap-2">
            {(["crimson", "scarlet", "carbon", "white"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  selectedColor === c ? "border-red-500 scale-110 shadow-lg shadow-red-500/50" : "border-transparent opacity-70 hover:opacity-100"
                }`}
                style={{ background: colors[c].main }}
              />
            ))}
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={triggerEngineRev}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold font-mono hover:bg-red-900 transition-colors shadow-md shadow-red-950"
          >
            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            {isRevving ? "REV ENGINE (9,000 RPM)" : "REV ENGINE"}
          </button>

          <button
            type="button"
            onClick={() => setHeadlights(!headlights)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12121e] border border-white/10 text-slate-300 text-xs font-bold font-mono hover:bg-white/10 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-red-400" />
            LED Laser {headlights ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12121e] border border-white/10 text-slate-300 text-xs font-bold font-mono hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            3D Spin {isAutoSpin ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </div>
  );
}

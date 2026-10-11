import React from 'react';

export const PixelBattleArenaBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Sky & Twilight Horizon Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#31103F]" />

      {/* 2. Distant Ruined Mountain Peaks & Citadel Spires (16-bit Silhouette) */}
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="absolute top-0 left-0 w-full h-[55%] opacity-60"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Layer 1: Distant jagged peaks */}
        <path
          d="M0,35 L12,18 L24,28 L38,12 L52,24 L68,14 L82,26 L94,16 L100,22 L100,40 L0,40 Z"
          fill="#1E1B4B"
        />
        {/* Layer 2: Ancient citadel ruined spires */}
        <rect x="22" y="14" width="3" height="15" fill="#0F172A" />
        <rect x="23" y="10" width="1" height="4" fill="#0F172A" />
        <rect x="66" y="8" width="4" height="22" fill="#0F172A" />
        <rect x="67" y="5" width="2" height="4" fill="#0F172A" />
        {/* Floating Nether Runes / Moon */}
        <circle cx="85" cy="10" r="4" fill="#FDE047" opacity="0.35" />
      </svg>

      {/* 3. Layered Flagstone Temple Plateau (Battle Stage Floor) */}
      <div className="absolute bottom-0 left-0 right-0 h-[48%] bg-[#1E293B] border-t-2 border-[#475569]">
        {/* Stone grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_2px,transparent_2px),linear-gradient(to_bottom,#0F172A_2px,transparent_2px)] bg-[size:32px_16px] opacity-70" />

        {/* Ancient Runic Inscriptions on the stone */}
        <div className="absolute top-2 left-[20%] w-24 h-1 bg-amber-500/20 blur-[1px]" />
        <div className="absolute top-8 left-[65%] w-20 h-1 bg-cyan-500/20 blur-[1px]" />

        {/* Left & Right Boundary Ruined Pillars */}
        <div className="absolute bottom-0 left-2 w-4 h-24 bg-[#0F172A] border-r border-[#475569]">
          <div className="w-6 -ml-1 h-3 bg-[#334155] border-t border-[#64748B]" />
          {/* Torch Fire */}
          <div className="w-2.5 h-3 mx-auto -mt-3.5 bg-amber-400 rounded-full animate-bounce shadow-[0_0_8px_#F59E0B]" />
        </div>

        <div className="absolute bottom-0 right-2 w-4 h-24 bg-[#0F172A] border-l border-[#475569]">
          <div className="w-6 -ml-1 h-3 bg-[#334155] border-t border-[#64748B]" />
          {/* Torch Fire */}
          <div className="w-2.5 h-3 mx-auto -mt-3.5 bg-orange-400 rounded-full animate-bounce shadow-[0_0_8px_#EA580C]" />
        </div>
      </div>

      {/* 4. Subtle Scanline / CRT Retro Overlay (Authentic SNES / FF6 feel) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40" />
    </div>
  );
};

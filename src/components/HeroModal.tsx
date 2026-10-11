import React from 'react';
import { HeroUnit, RANK_NAMES } from '../types/game';
import { HEROES_DATA } from '../data/heroesData';
import { PixelSprite } from './PixelSprite';
import { X, Crown, Sparkles } from 'lucide-react';

interface HeroModalProps {
  hero: HeroUnit | null;
  onClose: () => void;
}

export const HeroModal: React.FC<HeroModalProps> = ({ hero, onClose }) => {
  if (!hero) return null;
  const def = HEROES_DATA[hero.heroId];
  const rankTitle = RANK_NAMES[hero.tier] || `Rank ${hero.tier}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1 shadow-inner">
              <PixelSprite id={hero.heroId} size={48} action="idle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white font-serif">{def.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                  {rankTitle}
                </span>
              </div>
              <div className="text-xs text-slate-400">{def.culture} · {def.role}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live In-Battle Stats */}
        <div className="grid grid-cols-4 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center font-mono text-xs">
          <div>
            <div className="text-[10px] text-slate-500 font-sans">HP</div>
            <div className="text-emerald-400 font-bold tabular-nums">
              {hero.currentHp}/{hero.maxHp}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-sans">ATK</div>
            <div className="text-amber-400 font-bold tabular-nums">{hero.atk}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-sans">DEF</div>
            <div className="text-sky-400 font-bold tabular-nums">{hero.def}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-sans">MANA</div>
            <div className="text-cyan-400 font-bold tabular-nums">
              {hero.currentMana}/{hero.maxMana}
            </div>
          </div>
        </div>

        {/* Skill Info */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Skill: {def.skillName}</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {def.skillDescription}
          </p>
        </div>

        {/* In-Run Equipped Gear */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Equipped Sacred Relics ({hero.equippedItems.length}/3)
          </div>
          {hero.equippedItems.length === 0 ? (
            <div className="text-xs text-slate-500 italic bg-slate-950 p-2 rounded-lg">
              No relics equipped. Drag or equip items from your loot inventory below!
            </div>
          ) : (
            <div className="space-y-1">
              {hero.equippedItems.map((gear, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="text-amber-400 font-mono">T{gear.tier}</span>
                    <span>{gear.name}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">{gear.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demigod Avatar Progression */}
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-[11px] space-y-1">
          <div className="font-bold text-amber-300 flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" />
            <span>Rank VI Demigod: {def.ultimateForm.name}</span>
          </div>
          <p className="text-slate-400">
            {hero.tier >= 6
              ? '✨ Demigod Avatar Awakened! Full celestial perks and transcendence active!'
              : `Current: ${rankTitle} (Rank ${hero.tier}/6). Fuse identical warriors through Soul Convergence to awaken!`}
          </p>
        </div>
      </div>
    </div>
  );
};


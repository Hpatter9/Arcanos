import React from 'react';
import { ENEMIES_DATA } from '../data/enemiesData';
import { PixelSprite } from './PixelSprite';
import { ChevronLeft } from 'lucide-react';

interface CodexProps {
  onClose: () => void;
}

export const Codex: React.FC<CodexProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto pb-16 select-none">
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white font-serif">Netherworld Bestiary</h1>
            <div className="text-[11px] text-slate-400">Fiends of Norse, Egyptian, Japanese & Chinese Lore</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {Object.values(ENEMIES_DATA).map((enemy) => (
          <div
            key={enemy.id}
            className={`p-3.5 rounded-2xl border space-y-2.5 ${
              enemy.isBoss
                ? 'bg-red-950/20 border-red-800/60 shadow-lg'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1 shadow-inner">
                  <PixelSprite id={enemy.id} size={42} isBoss={enemy.isBoss} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{enemy.name}</span>
                    {enemy.isBoss && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-serif">
                        MYTHIC BOSS
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-amber-400">{enemy.mythos} · {enemy.title}</div>
                </div>
              </div>

              {/* Weakness & Resistance Badges */}
              <div className="text-right text-xs">
                <div className="text-[11px] font-bold text-emerald-400">
                  Weak: <span className="uppercase">{enemy.elementWeakness} (+45%)</span>
                </div>
                <div className="text-[11px] font-bold text-rose-400">
                  Resist: <span className="uppercase">{enemy.elementResistance} (-35%)</span>
                </div>
              </div>
            </div>

            {/* Pattern Description */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              {enemy.patternDescription}
            </p>

            {/* Base Stats */}
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px] text-slate-400 pt-1">
              <div className="p-1 rounded bg-slate-950">
                <div className="text-[9px] text-slate-500 font-sans">HP</div>
                <div className="text-white font-bold">{enemy.baseHp}</div>
              </div>
              <div className="p-1 rounded bg-slate-950">
                <div className="text-[9px] text-slate-500 font-sans">ATK</div>
                <div className="text-white font-bold">{enemy.baseAtk}</div>
              </div>
              <div className="p-1 rounded bg-slate-950">
                <div className="text-[9px] text-slate-500 font-sans">ARMOR</div>
                <div className="text-white font-bold">{enemy.baseDef}</div>
              </div>
              <div className="p-1 rounded bg-slate-950">
                <div className="text-[9px] text-slate-500 font-sans">SPEED</div>
                <div className="text-white font-bold">{enemy.moveSpeed}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

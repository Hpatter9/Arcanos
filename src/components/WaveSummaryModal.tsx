import React from 'react';
import { HeroUnit, WaveConfig, EquipmentItem } from '../types/game';
import { HEROES_DATA } from '../data/heroesData';
import { soundFx } from '../utils/audio';
import {
  Trophy,
  Skull,
  Coins,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Shield,
  Heart,
  Flame,
} from 'lucide-react';

interface WaveSummaryModalProps {
  isVictory: boolean;
  isGameOver: boolean;
  isFinalRunVictory: boolean;
  currentWave: WaveConfig;
  heroes: HeroUnit[];
  silverEarned: number;
  bpEarned: number;
  droppedItems: EquipmentItem[];
  onNextWave: () => void;
  onReturnToCastle: () => void;
}

export const WaveSummaryModal: React.FC<WaveSummaryModalProps> = ({
  isVictory,
  isGameOver,
  isFinalRunVictory,
  currentWave,
  heroes,
  silverEarned,
  bpEarned,
  droppedItems,
  onNextWave,
  onReturnToCastle,
}) => {
  // Calculate total damage dealt by all heroes
  const totalDamage = heroes.reduce((sum, h) => sum + h.damageDealt, 0);

  // Find MVP hero (hero with highest damage dealt)
  const mvpHero = [...heroes].sort((a, b) => b.damageDealt - a.damageDealt)[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Banner */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-1 shadow-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
            {isFinalRunVictory ? (
              <Trophy className="w-6 h-6 text-amber-300 animate-bounce" />
            ) : isGameOver ? (
              <Skull className="w-6 h-6 text-red-400" />
            ) : (
              <Sparkles className="w-6 h-6 text-amber-400" />
            )}
          </div>

          <h2 className="text-xl font-bold font-serif text-white">
            {isFinalRunVictory
              ? 'MYTHIC VICTORY!'
              : isGameOver
              ? 'ANCESTRAL DEFENSE FAILED'
              : `WAVE ${currentWave.waveNumber} CLEARED!`}
          </h2>
          <p className="text-xs text-slate-400">
            {isFinalRunVictory
              ? 'Surtr the World-Ender is vanquished! The ancestral realms are saved!'
              : isGameOver
              ? 'Your vanguard fell before the netherworld horde. Upgrade your warriors in the Hall of Heroes and try again!'
              : currentWave.title}
          </p>
        </div>

        {/* Loot Drops Section */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Battlefield Spoils & Rewards
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/40 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400">Battle Points</div>
                <div className="font-mono font-bold text-amber-300 text-sm">+{bpEarned} BP</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[10px] text-slate-400">Tribute Spoils</div>
                <div className="font-mono font-bold text-cyan-300 text-sm">+{silverEarned} Tribute</div>
              </div>
            </div>
          </div>

          {/* Dropped Equipment Items */}
          {droppedItems.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] text-slate-400 mb-1">Sacred Relic Drops Acquired:</div>
              <div className="flex flex-wrap gap-1.5">
                {droppedItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] font-semibold text-amber-300 flex items-center gap-1"
                  >
                    <span>{item.name}</span>
                    <span className="font-mono text-amber-400">T{item.tier}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Total Damage Dealt Breakdown */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Damage Breakdown ({totalDamage.toLocaleString()} Total)
            </span>
            {mvpHero && mvpHero.damageDealt > 0 && (
              <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                <span>MVP: {HEROES_DATA[mvpHero.heroId].name}</span>
              </span>
            )}
          </div>

          <div className="space-y-2.5 pt-1">
            {heroes.map((hero) => {
              const def = HEROES_DATA[hero.heroId];
              const percent = totalDamage > 0 ? (hero.damageDealt / totalDamage) * 100 : 0;

              return (
                <div key={hero.unitId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: def.color }}
                      />
                      <span>{def.name} (Rank {hero.tier})</span>
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-300 font-bold tabular-nums">
                        {hero.damageDealt.toLocaleString()} DMG
                      </span>
                      <span className="text-slate-500 tabular-nums">
                        ({percent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  {/* Damage bar */}
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: def.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playCoin();
              onReturnToCastle();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Temple of Ancients</span>
          </button>

          {!isGameOver && !isFinalRunVictory && (
            <button
              onClick={() => {
                soundFx.playSummon();
                onNextWave();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 font-serif"
            >
              <span>Next Wave</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

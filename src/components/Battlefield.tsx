import React from 'react';
import {
  HeroUnit,
  EnemyUnit,
  Projectile,
  DamagePopup,
  WaveConfig,
} from '../types/game';
import { HEROES_DATA } from '../data/heroesData';
import { ENEMIES_DATA } from '../data/enemiesData';
import { PixelSprite } from './PixelSprite';
import { PixelBattleArenaBackground } from './PixelBattleArena';
import {
  Crown,
  Play,
  Pause,
  FastForward,
  Skull,
  Shield,
  Snowflake,
  Flame,
} from 'lucide-react';

interface BattlefieldProps {
  heroes: HeroUnit[];
  enemies: EnemyUnit[];
  currentWave: WaveConfig;
  battleSpeed: number;
  onSetBattleSpeed: (speed: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  damagePopups: DamagePopup[];
  activeProjectiles: Projectile[];
}

export const Battlefield: React.FC<BattlefieldProps> = ({
  heroes,
  enemies,
  currentWave,
  battleSpeed,
  onSetBattleSpeed,
  isPaused,
  onTogglePause,
  damagePopups,
  activeProjectiles,
}) => {
  const bossUnit = enemies.find((e) => e.isBoss);

  return (
    <div className="relative w-full h-[330px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* 16-bit Final Fantasy VI SNES Style Battle Arena Backdrop */}
      <PixelBattleArenaBackground />

      {/* Top HUD: Wave Banner & Speed Controls (Retro FF6 Status Window Style) */}
      <div className="relative z-10 px-3 pt-2 pb-1.5 flex items-center justify-between bg-slate-950/80 backdrop-blur-sm border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-xs text-amber-400">
              WAVE {currentWave.waveNumber}/10
            </span>
            {currentWave.isBossWave && (
              <span className="px-1.5 py-0.2 rounded bg-red-950/80 border border-red-500/50 text-[10px] font-bold text-red-400 flex items-center gap-1 animate-pulse font-serif">
                <Skull className="w-2.5 h-2.5" />
                <span>BOSS</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-300 hidden sm:inline font-mono">
            · {enemies.length} Netherworld Foes
          </span>
        </div>

        {/* Speed & Pause Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              const next = battleSpeed === 1 ? 2 : battleSpeed === 2 ? 3 : 1;
              onSetBattleSpeed(next);
            }}
            className="px-2 py-0.5 rounded bg-slate-850 hover:bg-slate-800 text-xs font-mono font-bold text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <FastForward className="w-3 h-3 text-amber-400" />
            <span>{battleSpeed}x</span>
          </button>

          <button
            onClick={onTogglePause}
            className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* BOSS HEALTH BAR (If active) */}
      {bossUnit && (
        <div className="relative z-10 px-4 pt-1 pb-1 bg-red-950/60 border-b border-red-900/60">
          <div className="flex items-center justify-between text-[11px] mb-0.5">
            <span className="font-bold text-red-300 flex items-center gap-1 font-serif">
              <Skull className="w-3 h-3 text-red-400" />
              <span>{ENEMIES_DATA[bossUnit.enemyDefId]?.name || 'Mythic Boss'}</span>
            </span>
            <span className="font-mono text-red-300 font-bold tabular-nums">
              {bossUnit.currentHp} / {bossUnit.maxHp} HP
            </span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-red-900/60">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-150"
              style={{ width: `${Math.max(0, (bossUnit.currentHp / bossUnit.maxHp) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* THE 16-BIT BATTLEFIELD ARENA (Combat Zone) */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* HERO UNITS ON ARENA (Side-View SNES Formation) */}
        {heroes.map((hero) => {
          const isAlive = hero.currentHp > 0;
          const leftPercent = 6 + hero.gridX * 7.5;
          const topPercent = 14 + hero.gridY * 20;

          return (
            <div
              key={hero.unitId}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                opacity: isAlive ? 1 : 0.25,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-150 ${
                hero.isCasting ? 'scale-125 z-20' : 'z-10'
              }`}
            >
              {/* HP & Mana Bars */}
              {isAlive && (
                <div className="w-11 space-y-0.5 mb-0.5 pointer-events-none">
                  {/* HP Bar */}
                  <div className="w-full h-1 bg-black/80 rounded-sm overflow-hidden border border-slate-900">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-100"
                      style={{ width: `${Math.max(0, (hero.currentHp / hero.maxHp) * 100)}%` }}
                    />
                  </div>
                  {/* Mana Bar */}
                  <div className="w-full h-0.5 bg-black/80 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-100"
                      style={{ width: `${Math.min(100, (hero.currentMana / hero.maxMana) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Pixel Art Sprite Body */}
              <div className="relative">
                <PixelSprite
                  id={hero.heroId}
                  size={42}
                  action={hero.isCasting ? 'cast' : 'idle'}
                  direction="right"
                />

                {/* Demigod Avatar Crown */}
                {hero.tier >= 6 && (
                  <div className="absolute -top-3 -right-1 text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                    <Crown className="w-3.5 h-3.5 fill-amber-300" />
                  </div>
                )}

                {/* Rank Tag */}
                <span className="absolute -bottom-1 -left-1 px-1 py-0.2 rounded bg-black/90 border border-slate-800 text-[8px] font-mono text-amber-300 font-bold tabular-nums">
                  R{hero.tier}
                </span>

                {/* Magic casting aura */}
                {hero.isCasting && (
                  <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
                )}
              </div>
            </div>
          );
        })}

        {/* ENEMY UNITS ON ARENA (Facing Left towards heroes) */}
        {enemies.map((enemy) => {
          const isAlive = enemy.currentHp > 0;
          if (!isAlive) return null;

          return (
            <div
              key={enemy.unitId}
              style={{
                left: `${enemy.x}%`,
                top: `${enemy.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-75 z-10"
            >
              {/* HP Bar */}
              <div className="w-10 h-1 bg-black/80 rounded-sm overflow-hidden border border-slate-900 mb-0.5 pointer-events-none">
                <div
                  className="h-full bg-rose-500 transition-all duration-100"
                  style={{ width: `${Math.max(0, (enemy.currentHp / enemy.maxHp) * 100)}%` }}
                />
              </div>

              {/* Enemy Pixel Art Sprite */}
              <div className="relative">
                <PixelSprite
                  id={enemy.enemyDefId}
                  size={enemy.isBoss ? 56 : 38}
                  action="idle"
                  direction="left"
                  isBoss={enemy.isBoss}
                />

                {/* Status effects */}
                {enemy.statusEffects.some((s) => s.type === 'freeze') && (
                  <div className="absolute inset-0 bg-sky-400/40 rounded-lg border border-sky-300 flex items-center justify-center">
                    <Snowflake className="w-3.5 h-3.5 text-white animate-spin" />
                  </div>
                )}

                {enemy.statusEffects.some((s) => s.type === 'burn') && (
                  <div className="absolute -top-2 right-0 text-orange-400 animate-bounce">
                    <Flame className="w-3 h-3 fill-orange-400" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* ACTIVE PROJECTILES (16-bit Spell Orbs & Arrows) */}
        {activeProjectiles.map((proj) => {
          const currentX = proj.sourceX + (proj.targetX - proj.sourceX) * proj.progress;
          const currentY = proj.sourceY + (proj.targetY - proj.sourceY) * proj.progress;

          return (
            <div
              key={proj.id}
              style={{
                left: `${currentX}%`,
                top: `${currentY}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
            >
              <div
                className="w-3 h-3 rounded-full shadow-lg"
                style={{
                  backgroundColor: proj.color,
                  boxShadow: `0 0 10px ${proj.color}`,
                }}
              />
            </div>
          );
        })}

        {/* RETRO FLOATING DAMAGE POPUPS (SNES Font Style) */}
        {damagePopups.map((popup) => (
          <div
            key={popup.id}
            style={{
              left: `${popup.x}%`,
              top: `${popup.y}%`,
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none font-mono font-black text-xs animate-bounce z-40 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] select-none ${
              popup.type === 'crit'
                ? 'text-yellow-300 text-sm font-black'
                : popup.type === 'holy'
                ? 'text-amber-400'
                : popup.type === 'fire'
                ? 'text-orange-500'
                : popup.type === 'frost'
                ? 'text-cyan-400'
                : popup.type === 'wind'
                ? 'text-emerald-400'
                : popup.type === 'heal'
                ? 'text-green-400'
                : 'text-slate-100'
            }`}
          >
            {popup.value}
          </div>
        ))}
      </div>

      {/* Bottom battlefield status ticker */}
      <div className="relative z-10 px-3 py-1 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1 font-serif">
          <Shield className="w-3 h-3 text-amber-400" />
          <span>Ancestral Shrine Defense</span>
        </span>
        <span className="font-mono text-slate-400">
          Warriors: {heroes.filter((h) => h.currentHp > 0).length} Alive / {heroes.length} Placed
        </span>
      </div>
    </div>
  );
};

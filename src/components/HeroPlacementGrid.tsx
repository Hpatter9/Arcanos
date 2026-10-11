import React, { useState } from 'react';
import { HeroUnit, HeroId, EquipmentItem, RANK_NAMES } from '../types/game';
import { HEROES_DATA } from '../data/heroesData';
import { PixelSprite } from './PixelSprite';
import { soundFx } from '../utils/audio';
import {
  Crown,
  Star,
  Sparkles,
} from 'lucide-react';

interface HeroPlacementGridProps {
  heroes: HeroUnit[];
  onMergeHeroes: (sourceId: string, targetId: string) => void;
  onMoveHero: (heroId: string, targetX: number, targetY: number) => void;
  onInspectHero: (hero: HeroUnit) => void;
  selectedHeroId: string | null;
  onSelectHero: (heroId: string | null) => void;
  isCombatActive: boolean;
}

export const HeroPlacementGrid: React.FC<HeroPlacementGridProps> = ({
  heroes,
  onMergeHeroes,
  onMoveHero,
  onInspectHero,
  selectedHeroId,
  onSelectHero,
  isCombatActive,
}) => {
  const [draggedHeroId, setDraggedHeroId] = useState<string | null>(null);

  const selectedHero = heroes.find((h) => h.unitId === selectedHeroId) || null;

  // Build 4x4 matrix
  const gridCells: (HeroUnit | null)[][] = Array.from({ length: 4 }, () =>
    Array(4).fill(null)
  );
  heroes.forEach((hero) => {
    if (hero.gridX >= 0 && hero.gridX < 4 && hero.gridY >= 0 && hero.gridY < 4) {
      gridCells[hero.gridY][hero.gridX] = hero;
    }
  });

  const handleCellClick = (x: number, y: number, cellHero: HeroUnit | null) => {
    if (isCombatActive) {
      if (cellHero) {
        onInspectHero(cellHero);
      }
      return;
    }

    if (!selectedHero) {
      if (cellHero) {
        soundFx.playCoin();
        onSelectHero(cellHero.unitId);
      }
      return;
    }

    if (cellHero && cellHero.unitId === selectedHero.unitId) {
      onSelectHero(null);
      return;
    }

    if (cellHero) {
      // Check if mergeable: same heroId and same tier and tier < 6
      if (
        cellHero.heroId === selectedHero.heroId &&
        cellHero.tier === selectedHero.tier &&
        selectedHero.tier < 6
      ) {
        onMergeHeroes(selectedHero.unitId, cellHero.unitId);
        onSelectHero(null);
      } else {
        soundFx.playCoin();
        onSelectHero(cellHero.unitId);
      }
    } else {
      soundFx.playCoin();
      onMoveHero(selectedHero.unitId, x, y);
      onSelectHero(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, hero: HeroUnit) => {
    if (isCombatActive) return;
    setDraggedHeroId(hero.unitId);
    e.dataTransfer.setData('text/plain', hero.unitId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetX: number, targetY: number, targetHero: HeroUnit | null) => {
    e.preventDefault();
    if (isCombatActive || !draggedHeroId) return;

    const sourceHero = heroes.find((h) => h.unitId === draggedHeroId);
    if (!sourceHero) return;

    if (targetHero) {
      if (
        targetHero.heroId === sourceHero.heroId &&
        targetHero.tier === sourceHero.tier &&
        targetHero.unitId !== sourceHero.unitId &&
        sourceHero.tier < 6
      ) {
        onMergeHeroes(sourceHero.unitId, targetHero.unitId);
      }
    } else {
      onMoveHero(sourceHero.unitId, targetX, targetY);
    }
    setDraggedHeroId(null);
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-xl">
      {/* Grid Header info */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-300 font-serif">Ancestral Grid (4x4)</span>
          <span className="text-[11px] text-slate-500">
            · {heroes.length}/16 Placed
          </span>
        </div>
        <div className="text-[11px] text-amber-400 font-medium truncate max-w-[200px]">
          {selectedHero
            ? `Fuse with Rank ${selectedHero.tier} ${HEROES_DATA[selectedHero.heroId].name}!`
            : 'Soul Convergence: Tap warrior to fuse'}
        </div>
      </div>

      {/* 4x4 Grid Matrix */}
      <div className="grid grid-cols-4 gap-2 aspect-square max-w-[340px] mx-auto bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
        {gridCells.map((row, y) =>
          row.map((cellHero, x) => {
            const isSelected = selectedHero?.unitId === cellHero?.unitId;
            const isMergeTarget =
              selectedHero &&
              cellHero &&
              cellHero.unitId !== selectedHero.unitId &&
              cellHero.heroId === selectedHero.heroId &&
              cellHero.tier === selectedHero.tier &&
              selectedHero.tier < 6;

            const baseDef = cellHero ? HEROES_DATA[cellHero.heroId] : null;

            return (
              <div
                key={`${x}-${y}`}
                onClick={() => handleCellClick(x, y, cellHero)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, x, y, cellHero)}
                className={`relative rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer select-none overflow-hidden ${
                  cellHero
                    ? isSelected
                      ? 'ring-2 ring-amber-400 bg-amber-950/40 shadow-lg scale-[1.02]'
                      : isMergeTarget
                      ? 'ring-2 ring-emerald-400 animate-pulse bg-emerald-950/30'
                      : 'bg-slate-900/90 hover:bg-slate-850 border border-slate-800'
                    : selectedHero
                    ? 'bg-slate-900/40 border border-dashed border-amber-500/40 hover:bg-amber-500/10'
                    : 'bg-slate-950/60 border border-slate-850 hover:border-slate-800'
                }`}
              >
                {/* Empty cell coordinate label */}
                {!cellHero && (
                  <div className="text-[10px] text-slate-700 font-mono">
                    {x === 0 ? 'Vanguard' : x === 3 ? 'Rear' : ''}
                  </div>
                )}

                {/* Hero Unit Card inside cell */}
                {cellHero && baseDef && (
                  <div
                    draggable={!isCombatActive}
                    onDragStart={(e) => handleDragStart(e, cellHero)}
                    className="w-full h-full p-1 flex flex-col items-center justify-between"
                  >
                    {/* Top row: Rank indicator / Demigod Crown */}
                    <div className="w-full flex items-center justify-between px-0.5">
                      <div className="flex items-center">
                        {cellHero.tier >= 6 ? (
                          <div className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-bold text-[9px] shadow-sm animate-bounce">
                            <Crown className="w-2.5 h-2.5" />
                            <span>AVATAR</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-0.2">
                            {Array.from({ length: cellHero.tier }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-2 h-2 ${
                                  cellHero.tier >= 4 ? 'text-cyan-400 fill-cyan-400' : 'text-amber-400 fill-amber-400'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Rank label */}
                      <span className="text-[9px] font-mono font-bold text-slate-400 tabular-nums">
                        R{cellHero.tier}
                      </span>
                    </div>

                    {/* 16-bit SNES Pixel Art Avatar */}
                    <div className="relative flex items-center justify-center my-0.5">
                      <PixelSprite
                        id={cellHero.heroId}
                        size={32}
                        action="idle"
                        direction="right"
                      />

                      {/* Demigod Shimmer Ring */}
                      {cellHero.tier >= 6 && (
                        <div className="absolute inset-0 rounded-lg border border-amber-300 animate-ping opacity-40 pointer-events-none" />
                      )}
                    </div>

                    {/* Name & Equipped Relics */}
                    <div className="w-full text-center">
                      <div className="text-[10px] font-bold text-white truncate leading-tight">
                        {baseDef.name.split(' ')[0]}
                      </div>

                      {/* Relics row */}
                      <div className="flex items-center justify-center gap-0.5 mt-0.5 h-2.5">
                        {cellHero.equippedItems.map((item, idx) => (
                          <div
                            key={idx}
                            title={item.name}
                            className="w-2.5 h-2.5 rounded-full bg-amber-400/80 border border-slate-900"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Soul Convergence Hint Tag */}
                    {isMergeTarget && (
                      <div className="absolute inset-0 bg-emerald-600/40 backdrop-blur-[1px] flex items-center justify-center text-[10px] font-extrabold text-white uppercase tracking-wider">
                        Fuse!
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Grid Legend & Cultural Roles */}
      <div className="flex items-center justify-between mt-2.5 px-2 text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
        <span className="text-amber-400 font-semibold">Row 1: Norse/Chinese Vanguard</span>
        <span className="text-slate-500">Rows 2-3: Dual Combatants</span>
        <span className="text-cyan-400 font-semibold">Row 4: Samurai/Nile Backline</span>
      </div>
    </div>
  );
};

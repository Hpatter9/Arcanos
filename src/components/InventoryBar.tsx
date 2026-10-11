import React, { useState } from 'react';
import { EquipmentItem, HeroUnit, RANK_NAMES } from '../types/game';
import { HEROES_DATA } from '../data/heroesData';
import { soundFx } from '../utils/audio';
import { Sword, Shield, Zap, Sparkles, Crown, Plus, ArrowUpRight } from 'lucide-react';

interface InventoryBarProps {
  items: EquipmentItem[];
  heroes: HeroUnit[];
  onEquipItem: (item: EquipmentItem, targetHeroUnitId: string) => void;
  onMergeItems: (item1: EquipmentItem, item2: EquipmentItem) => void;
  isCombatActive: boolean;
}

export const InventoryBar: React.FC<InventoryBarProps> = ({
  items,
  heroes,
  onEquipItem,
  onMergeItems,
  isCombatActive,
}) => {
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [showEquipTargetList, setShowEquipTargetList] = useState(false);

  const handleItemClick = (item: EquipmentItem) => {
    if (isCombatActive) return;

    if (selectedItem) {
      if (selectedItem.instanceId === item.instanceId) {
        setSelectedItem(null);
        setShowEquipTargetList(false);
        return;
      }

      // Check if mergeable: same base type and same tier and tier < 3
      if (
        selectedItem.type === item.type &&
        selectedItem.tier === item.tier &&
        selectedItem.tier < 3
      ) {
        onMergeItems(selectedItem, item);
        setSelectedItem(null);
        setShowEquipTargetList(false);
        return;
      }
    }

    soundFx.playCoin();
    setSelectedItem(item);
    setShowEquipTargetList(true);
  };

  const handleHeroSelect = (hero: HeroUnit) => {
    if (!selectedItem) return;
    if (hero.equippedItems.length >= 3) {
      alert('This hero already has maximum 3 equipment slots filled!');
      return;
    }
    onEquipItem(selectedItem, hero.unitId);
    setSelectedItem(null);
    setShowEquipTargetList(false);
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-md">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-300 font-serif">Sacred Relics Inventory ({items.length}/6)</span>
          <span className="text-[10px] text-slate-500">· Fuse identical relics or bestow upon warriors</span>
        </div>
        {selectedItem && (
          <button
            onClick={() => {
              setSelectedItem(null);
              setShowEquipTargetList(false);
            }}
            className="text-[10px] text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Item Slots */}
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, idx) => {
          const item = items[idx];
          const isSelected = selectedItem?.instanceId === item?.instanceId;
          const isMergeTarget =
            selectedItem &&
            item &&
            selectedItem.instanceId !== item.instanceId &&
            selectedItem.type === item.type &&
            selectedItem.tier === item.tier &&
            selectedItem.tier < 3;

          return (
            <div
              key={idx}
              onClick={() => item && handleItemClick(item)}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-1 border transition-all ${
                item
                  ? isSelected
                    ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400 scale-105'
                    : isMergeTarget
                    ? 'bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400 animate-pulse'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 cursor-pointer'
                  : 'bg-slate-950/40 border-slate-900 border-dashed'
              }`}
            >
              {item ? (
                <>
                  <div className="w-6 h-6 rounded flex items-center justify-center text-amber-400">
                    {item.type === 'weapon' && <Sword className="w-4 h-4" />}
                    {item.type === 'armor' && <Shield className="w-4 h-4" />}
                    {item.type === 'bow' && <Zap className="w-4 h-4" />}
                    {item.type === 'staff' && <Sparkles className="w-4 h-4" />}
                    {item.type === 'relic' && <Crown className="w-4 h-4" />}
                  </div>
                  <span className="text-[9px] font-mono font-bold text-amber-300">
                    T{item.tier}
                  </span>
                  {isMergeTarget && (
                    <div className="absolute inset-0 bg-emerald-600/30 rounded-xl flex items-center justify-center text-[9px] font-bold text-white uppercase">
                      Fuse
                    </div>
                  )}
                </>
              ) : (
                <div className="text-slate-800 text-xs">+</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Equip Drawer Target Selection */}
      {selectedItem && showEquipTargetList && (
        <div className="mt-3 pt-2.5 border-t border-slate-800">
          <div className="text-[11px] text-amber-300 font-semibold mb-1.5 flex items-center justify-between">
            <span>Bestow {selectedItem.name} (T{selectedItem.tier}) upon:</span>
            <span className="text-[10px] text-slate-400 font-normal">
              {selectedItem.description}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {heroes.map((hero) => (
              <button
                key={hero.unitId}
                onClick={() => handleHeroSelect(hero)}
                disabled={hero.equippedItems.length >= 3}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 disabled:opacity-40 border border-slate-800 text-left transition-colors flex flex-col justify-between"
              >
                <div className="text-[10px] font-bold text-white truncate">
                  R{hero.tier} {HEROES_DATA[hero.heroId]?.name.split(' ')[0]}
                </div>
                <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                  Relics: {hero.equippedItems.length}/3
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


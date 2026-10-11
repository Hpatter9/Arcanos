import React, { useState } from 'react';
import { HeroId, PlayerProfile, SkillNode } from '../types/game';
import { HEROES_DATA } from '../data/heroesData';
import { PixelSprite } from './PixelSprite';
import { getHeroLevelCost, calculateHeroPersistentStats } from '../utils/storage';
import { soundFx } from '../utils/audio';
import {
  Crown,
  ChevronRight,
  ArrowUpCircle,
  Coins,
  Sparkles,
  Sword,
  Shield,
  Zap,
  Check,
  Flame,
  Sun,
  Swords,
} from 'lucide-react';

interface BarracksProps {
  profile: PlayerProfile;
  initialHeroId?: HeroId;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onClose: () => void;
}

export const Barracks: React.FC<BarracksProps> = ({
  profile,
  initialHeroId = 'ragnar',
  onUpdateProfile,
  onClose,
}) => {
  const [selectedHeroId, setSelectedHeroId] = useState<HeroId>(initialHeroId);
  const [activeTab, setActiveTab] = useState<'skills' | 'equipment' | 'ultimate'>('skills');

  const heroDef = HEROES_DATA[selectedHeroId] || HEROES_DATA.ragnar;
  const heroProg = profile.heroes[selectedHeroId] || { level: 1, unlockedSkillIds: [], equipment: {} };
  const currentLevel = heroProg.level || 1;
  const levelUpCost = getHeroLevelCost(currentLevel);
  const canLevelUp = profile.battlePoints >= levelUpCost && currentLevel < 20;

  const persistentStats = calculateHeroPersistentStats(selectedHeroId, profile);

  const handleLevelUp = () => {
    if (!canLevelUp) return;
    soundFx.playMerge(3);
    onUpdateProfile((prev) => {
      const current = prev.heroes[selectedHeroId] || { level: 1, unlockedSkillIds: [], equipment: {} };
      return {
        ...prev,
        battlePoints: prev.battlePoints - levelUpCost,
        heroes: {
          ...prev.heroes,
          [selectedHeroId]: {
            ...current,
            level: current.level + 1,
          },
        },
      };
    });
  };

  const handleToggleSkill = (skillNode: SkillNode) => {
    soundFx.playCoin();
    onUpdateProfile((prev) => {
      const hero = prev.heroes[selectedHeroId];
      const unlocked = new Set(hero.unlockedSkillIds || []);

      const tierPrefix = `${selectedHeroId}_t${skillNode.tier}`;
      const otherBranch = skillNode.branch === 'A' ? 'B' : 'A';
      unlocked.delete(`${tierPrefix}_${otherBranch.toLowerCase()}`);
      unlocked.add(skillNode.id);

      return {
        ...prev,
        heroes: {
          ...prev.heroes,
          [selectedHeroId]: {
            ...hero,
            unlockedSkillIds: Array.from(unlocked),
          },
        },
      };
    });
  };

  const handleUpgradeGear = (slot: 'weapon' | 'armor' | 'relic') => {
    const cost = 80;
    if (profile.battlePoints < cost) return;

    soundFx.playMerge(2);
    onUpdateProfile((prev) => {
      const hero = prev.heroes[selectedHeroId];
      const currentGear = hero.equipment[slot];
      const newTier = ((currentGear?.tier || 1) + 1) as 2 | 3;
      if (newTier > 3) return prev;

      return {
        ...prev,
        battlePoints: prev.battlePoints - cost,
        heroes: {
          ...prev.heroes,
          [selectedHeroId]: {
            ...hero,
            equipment: {
              ...hero.equipment,
              [slot]: {
                ...currentGear,
                tier: newTier,
                name: `${currentGear?.name || slot} +${newTier}`,
                bonus: {
                  atk: (currentGear?.bonus.atk || 0) + 25,
                  hp: (currentGear?.bonus.hp || 0) + 180,
                },
              },
            },
          },
        },
      };
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto pb-20 select-none">
      {/* Hall of Heroes Top Nav */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold tracking-tight text-white font-serif">Hall of Heroes</h1>
            <div className="text-[11px] text-slate-400">Mastery Trees & Sacred Relics Across Civilizations</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-700/50 flex items-center gap-1.5 text-xs">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-bold text-amber-300 tabular-nums">{profile.battlePoints} BP</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-xs text-slate-400 hover:text-white"
            >
              Done
            </button>
          </div>
        </div>

        {/* Hero Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          {(['ragnar', 'tomoe', 'guan', 'nefertari'] as HeroId[]).map((hId) => {
            const h = HEROES_DATA[hId];
            const isSelected = selectedHeroId === hId;
            const lvl = profile.heroes[hId]?.level || 1;

            return (
              <button
                key={hId}
                onClick={() => {
                  soundFx.playCoin();
                  setSelectedHeroId(hId);
                }}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all border ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-400/50 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  <PixelSprite id={hId} size={28} />
                </div>
                <span className="text-[11px] font-bold text-white truncate">{h.name.split(' ')[0]}</span>
                <span className="text-[10px] font-mono text-amber-400">Lv.{lvl}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Overview Header with 16-bit Battle Sprite */}
      <div className="p-4 space-y-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Animated 16-bit Hero Combat Sprite */}
              <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1 shadow-inner">
                <PixelSprite id={selectedHeroId} size={50} action="idle" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white font-serif">{heroDef.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                    {heroDef.culture}
                  </span>
                </div>
                <div className="text-xs text-slate-400">{heroDef.title} · {heroDef.role}</div>
              </div>
            </div>

            {/* Level Up Button */}
            <button
              onClick={handleLevelUp}
              disabled={!canLevelUp}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-30 disabled:pointer-events-none text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Level Up ({levelUpCost} BP)</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono text-xs">
            <div className="p-2 rounded-lg bg-slate-950">
              <div className="text-[10px] text-slate-500 font-sans">HP</div>
              <div className="text-emerald-400 font-bold tabular-nums">{persistentStats.hp}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950">
              <div className="text-[10px] text-slate-500 font-sans">ATK</div>
              <div className="text-amber-400 font-bold tabular-nums">{persistentStats.atk}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950">
              <div className="text-[10px] text-slate-500 font-sans">DEF</div>
              <div className="text-sky-400 font-bold tabular-nums">{persistentStats.def}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950">
              <div className="text-[10px] text-slate-500 font-sans">ATK SPD</div>
              <div className="text-purple-400 font-bold tabular-nums">{persistentStats.aspd}/s</div>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'skills' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Skill Trees
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'equipment' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Forge Relics
          </button>
          <button
            onClick={() => setActiveTab('ultimate')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'ultimate' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Demigod Avatar
          </button>
        </div>

        {/* TAB 1: SKILL TREES */}
        {activeTab === 'skills' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 leading-relaxed">
              Customize your warrior's specialization before battle. Select either Path A or Path B for each tier to counter opposing enemy patterns!
            </div>

            {(['tier1', 'tier2', 'tier3'] as const).map((tierKey, idx) => {
              const tierNum = idx + 1;
              const nodeA = heroDef.skillTreeBranches[tierKey].A;
              const nodeB = heroDef.skillTreeBranches[tierKey].B;
              const isAActive = (heroProg.unlockedSkillIds || []).includes(nodeA.id);
              const isBActive = (heroProg.unlockedSkillIds || []).includes(nodeB.id);

              return (
                <div key={tierKey} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Tier {tierNum} Mastery Choice:
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Path A */}
                    <button
                      onClick={() => handleToggleSkill(nodeA)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isAActive
                          ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-400/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{nodeA.name}</span>
                          {isAActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">{nodeA.description}</p>
                      </div>
                      <span className="text-[9px] uppercase font-bold text-amber-400/80 mt-2">
                        {isAActive ? 'Active' : 'Choose Path'}
                      </span>
                    </button>

                    {/* Path B */}
                    <button
                      onClick={() => handleToggleSkill(nodeB)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isBActive
                          ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-400/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{nodeB.name}</span>
                          {isBActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">{nodeB.description}</p>
                      </div>
                      <span className="text-[9px] uppercase font-bold text-amber-400/80 mt-2">
                        {isBActive ? 'Active' : 'Choose Path'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: SACRED RELICS FORGE */}
        {activeTab === 'equipment' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 leading-relaxed">
              Ancestral weapons, armor, and totems forged here equip your hero permanently at the beginning of each expedition.
            </div>

            {(['weapon', 'armor', 'relic'] as const).map((slot) => {
              const item = heroProg.equipment[slot];
              const tier = item?.tier || 1;
              const canUpgrade = profile.battlePoints >= 80 && tier < 3;

              return (
                <div
                  key={slot}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      {slot === 'weapon' && <Sword className="w-5 h-5" />}
                      {slot === 'armor' && <Shield className="w-5 h-5" />}
                      {slot === 'relic' && <Crown className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white capitalize">
                        {slot}: {item?.name || `Ancestral ${slot}`} (Tier {tier})
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item?.description || '+Bonus base combat stats'}
                      </div>
                    </div>
                  </div>

                  {tier < 3 ? (
                    <button
                      onClick={() => handleUpgradeGear(slot)}
                      disabled={!canUpgrade}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-amber-400 font-bold text-xs border border-slate-700 transition-colors"
                    >
                      Forge (80 BP)
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-400 uppercase">Max Tier</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: DEMIGOD AVATAR TRANSCENDENCE */}
        {activeTab === 'ultimate' && (
          <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-500/40 space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-amber-300 font-serif">
                  {heroDef.ultimateForm.name}
                </h3>
                <div className="text-xs text-slate-400">{heroDef.ultimateForm.title}</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {heroDef.ultimateForm.description}
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs text-amber-300 font-mono">
              Divine Avatar Awakening Perks:
              <div className="text-slate-300 font-sans mt-1">
                {heroDef.ultimateForm.bonusStatsDescription}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-1">
              ★ Awakened in combat by achieving <strong>Rank VI (Soul Convergence)</strong> through resource management and fusion!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

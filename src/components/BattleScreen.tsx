import React, { useState, useEffect } from 'react';
import {
  BattlePhase,
  DamagePopup,
  EnemyUnit,
  EquipmentItem,
  HeroId,
  HeroUnit,
  PlayerProfile,
  Projectile,
  RANK_NAMES,
} from '../types/game';
import { HEROES_DATA } from '../data/heroesData';
import { ENEMIES_DATA } from '../data/enemiesData';
import { WAVES_DATA } from '../data/wavesData';
import { getRandomLootItem } from '../data/itemsData';
import {
  createHeroUnit,
  recalculateHeroUnitStats,
  spawnEnemyUnit,
  calculateElementalMultiplier,
} from '../utils/battleEngine';
import { soundFx } from '../utils/audio';
import { Battlefield } from './Battlefield';
import { HeroPlacementGrid } from './HeroPlacementGrid';
import { InventoryBar } from './InventoryBar';
import { WaveSummaryModal } from './WaveSummaryModal';
import { HeroModal } from './HeroModal';
import {
  Coins,
  Swords,
  Play,
  RotateCcw,
  Sparkles,
  Shield,
  Crown,
} from 'lucide-react';

interface BattleScreenProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onReturnToWarRoom: () => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  profile,
  onUpdateProfile,
  onReturnToWarRoom,
}) => {
  // Wave & Economy State
  const [currentWaveIndex, setCurrentWaveIndex] = useState(0);
  const [silver, setSilver] = useState(() => {
    let start = 16;
    start += (profile.devotion.guanYuCelestial || 0) * 1.5;
    if (profile.activeDoctrine === 'dragon_harmony') start += 12;
    return Math.round(start);
  });

  const [summonCost, setSummonCost] = useState(5);
  const [battlePhase, setBattlePhase] = useState<BattlePhase>('preparation');
  const [battleSpeed, setBattleSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Units & Board State
  const [heroes, setHeroes] = useState<HeroUnit[]>(() => {
    // Initial starting warrior spawn
    const startingHeroId: HeroId = 'ragnar';
    const initialUnit = createHeroUnit(startingHeroId, 1, 1, profile, 1);
    return [initialUnit];
  });

  const [enemies, setEnemies] = useState<EnemyUnit[]>([]);
  const [inventoryItems, setInventoryItems] = useState<EquipmentItem[]>([]);
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [inspectedHero, setInspectedHero] = useState<HeroUnit | null>(null);

  // FX & Visual tracking
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const [activeProjectiles, setActiveProjectiles] = useState<Projectile[]>([]);

  // Post-wave summaries
  const [waveSilverEarned, setWaveSilverEarned] = useState(0);
  const [waveBpEarned, setWaveBpEarned] = useState(0);
  const [waveDroppedItems, setWaveDroppedItems] = useState<EquipmentItem[]>([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const currentWave = WAVES_DATA[currentWaveIndex] || WAVES_DATA[0];

  // Helper: Find open grid cell (4x4)
  const findOpenCell = (): { x: number; y: number } | null => {
    const occupied = new Set(heroes.map((h) => `${h.gridX},${h.gridY}`));
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (!occupied.has(`${x},${y}`)) {
          return { x, y };
        }
      }
    }
    return null;
  };

  // Summon Ancestral Warrior
  const handleSummonHero = () => {
    if (silver < summonCost) return;
    const openCell = findOpenCell();
    if (!openCell) {
      alert('The ancestral grid is full! Fuse existing warriors through Soul Convergence to make room.');
      return;
    }

    const heroIds: HeroId[] = ['ragnar', 'tomoe', 'guan', 'nefertari'];
    const randomHeroId = heroIds[Math.floor(Math.random() * heroIds.length)];

    // Guan Yu Devotion favor: chance to summon at Rank II or Rank III directly
    const guanPts = profile.devotion.guanYuCelestial || 0;
    const rank2Chance = guanPts * 0.035;
    const rank3Chance = guanPts >= 10 ? 0.12 : 0;
    let initialRank = 1;
    if (Math.random() < rank3Chance) {
      initialRank = 3;
    } else if (Math.random() < rank2Chance) {
      initialRank = 2;
    }

    const newUnit = createHeroUnit(randomHeroId, openCell.x, openCell.y, profile, initialRank);

    soundFx.playSummon();
    setSilver((prev) => prev - summonCost);
    setSummonCost((prev) => prev + 1);
    setHeroes((prev) => [...prev, newUnit]);
  };

  // Soul Convergence: Merge 2 Warriors of same rank
  const handleMergeHeroes = (sourceId: string, targetId: string) => {
    const source = heroes.find((h) => h.unitId === sourceId);
    const target = heroes.find((h) => h.unitId === targetId);
    if (!source || !target || source.heroId !== target.heroId || source.tier !== target.tier) {
      return;
    }

    const nextRank = source.tier + 1;
    soundFx.playMerge(nextRank);

    // Combine equipped items (up to 3)
    const combinedGear = [...target.equippedItems, ...source.equippedItems].slice(0, 3);

    // Create ascended unit
    const ascended = createHeroUnit(target.heroId, target.gridX, target.gridY, profile, nextRank);
    ascended.equippedItems = combinedGear;
    const recalculated = recalculateHeroUnitStats(ascended, profile);

    // Guan Yu Tier 15 divine favor: soul convergence grants +1 free tribute
    if ((profile.devotion.guanYuCelestial || 0) >= 15) {
      setSilver((s) => s + 1);
    }

    setHeroes((prev) =>
      prev.filter((h) => h.unitId !== sourceId).map((h) => (h.unitId === targetId ? recalculated : h))
    );

    // Ascension feedback
    const rankName = RANK_NAMES[nextRank] || `Rank ${nextRank}`;
    setDamagePopups((prev) => [
      ...prev,
      {
        id: `fuse_${Date.now()}`,
        x: 10 + target.gridX * 7.5,
        y: 12 + target.gridY * 22,
        value: nextRank >= 6 ? '👑 DEMIGOD AVATAR!' : `★ ${rankName.toUpperCase()}!`,
        type: 'holy',
        createdAt: Date.now(),
      },
    ]);
  };

  // Move Warrior to empty cell
  const handleMoveHero = (heroUnitId: string, targetX: number, targetY: number) => {
    setHeroes((prev) =>
      prev.map((h) => (h.unitId === heroUnitId ? { ...h, gridX: targetX, gridY: targetY } : h))
    );
  };

  // Equip Sacred Relic
  const handleEquipItem = (item: EquipmentItem, targetHeroUnitId: string) => {
    soundFx.playCoin();
    setHeroes((prev) =>
      prev.map((h) => {
        if (h.unitId === targetHeroUnitId && h.equippedItems.length < 3) {
          const updated = {
            ...h,
            equippedItems: [...h.equippedItems, item],
          };
          return recalculateHeroUnitStats(updated, profile);
        }
        return h;
      })
    );
    setInventoryItems((prev) => prev.filter((i) => i.instanceId !== item.instanceId));
  };

  // Merge 2 Relics
  const handleMergeItems = (item1: EquipmentItem, item2: EquipmentItem) => {
    soundFx.playMerge(2);
    const upgradedTier = ((item1.tier + 1) as 2 | 3);
    const upgradedItem: EquipmentItem = {
      ...item1,
      tier: upgradedTier,
      instanceId: `relic_${Date.now()}`,
      name: `${item1.name} (T${upgradedTier})`,
      bonus: {
        atk: item1.bonus.atk ? item1.bonus.atk * 2.2 : undefined,
        hp: item1.bonus.hp ? item1.bonus.hp * 2.2 : undefined,
        aspd: item1.bonus.aspd ? item1.bonus.aspd * 1.8 : undefined,
        critChance: item1.bonus.critChance ? item1.bonus.critChance * 2 : undefined,
        manaStart: item1.bonus.manaStart ? item1.bonus.manaStart * 2 : undefined,
      },
    };

    setInventoryItems((prev) => [
      ...prev.filter((i) => i.instanceId !== item1.instanceId && i.instanceId !== item2.instanceId),
      upgradedItem,
    ]);
  };

  // START COMBAT
  const handleStartCombat = () => {
    if (heroes.length === 0) {
      alert('You need at least 1 warrior on the shrine grid!');
      return;
    }

    soundFx.playAttack('physical');
    setBattlePhase('combat');

    // Spawn wave enemies
    const waveSpawnList: EnemyUnit[] = [];
    let countIdx = 0;
    currentWave.enemies.forEach((spawnGroup) => {
      for (let i = 0; i < spawnGroup.count; i++) {
        const enemy = spawnEnemyUnit(spawnGroup.enemyId, currentWaveIndex, countIdx, 10);
        waveSpawnList.push(enemy);
        countIdx++;
      }
    });

    setEnemies(waveSpawnList);

    // Reset Hero combat stats & restore full HP for the battle
    setHeroes((prev) =>
      prev.map((h) => {
        const persistent = recalculateHeroUnitStats(h, profile);
        return {
          ...persistent,
          currentHp: persistent.maxHp,
          currentMana: Math.min(persistent.maxMana, (profile.devotion.raSolar || 0) * 4),
          damageDealt: 0,
          isCasting: false,
          attackCooldown: 0.5,
        };
      })
    );
  };

  // COMBAT SIMULATION TICK LOOP
  useEffect(() => {
    if (battlePhase !== 'combat' || isPaused) return;

    const tickInterval = 100 / battleSpeed;
    const dt = (0.1 * battleSpeed);

    const timer = setInterval(() => {
      // 1. Check Win Condition
      const livingEnemies = enemies.filter((e) => e.currentHp > 0);
      const livingHeroes = heroes.filter((h) => h.currentHp > 0);

      if (livingEnemies.length === 0 && enemies.length > 0) {
        soundFx.playVictory();
        setBattlePhase('wave_cleared');

        const silverReward = currentWave.silverReward + (profile.activeDoctrine === 'dragon_harmony' ? 3 : 0);
        const bpReward = currentWave.bpReward;

        const newDrops: EquipmentItem[] = [];
        if (Math.random() < currentWave.itemDropChance) {
          const loot = getRandomLootItem();
          newDrops.push(loot);
          setInventoryItems((prev) => (prev.length < 6 ? [...prev, loot] : prev));
        }

        setSilver((s) => s + silverReward);
        setWaveSilverEarned(silverReward);
        setWaveBpEarned(bpReward);
        setWaveDroppedItems(newDrops);

        onUpdateProfile((prev) => ({
          ...prev,
          battlePoints: prev.battlePoints + bpReward,
          highestWave: Math.max(prev.highestWave, currentWave.waveNumber),
          totalKills: prev.totalKills + enemies.length,
          totalBossWins: currentWave.isBossWave ? prev.totalBossWins + 1 : prev.totalBossWins,
        }));

        setShowSummaryModal(true);
        return;
      }

      if (livingHeroes.length === 0 && heroes.length > 0) {
        soundFx.playDefeat();
        setBattlePhase('game_over');
        setShowSummaryModal(true);
        return;
      }

      // 2. Advance Projectiles
      setActiveProjectiles((prevProjs) =>
        prevProjs
          .map((p) => ({ ...p, progress: p.progress + 0.15 * battleSpeed }))
          .filter((p) => p.progress < 1)
      );

      // Clean old damage popups
      const now = Date.now();
      setDamagePopups((prev) => prev.filter((p) => now - p.createdAt < 1200));

      // 3. Enemy Movement & Attacks
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          if (enemy.currentHp <= 0) return enemy;

          const isStunned = enemy.statusEffects.some((s) => s.type === 'freeze' || s.type === 'stun');
          if (isStunned) {
            return {
              ...enemy,
              statusEffects: enemy.statusEffects
                .map((s) => ({ ...s, duration: s.duration - dt }))
                .filter((s) => s.duration > 0),
            };
          }

          let newX = enemy.x;
          const targetHero = livingHeroes[0];
          if (newX > 38) {
            newX = Math.max(38, enemy.x - (enemy.moveSpeed * 0.05 * dt));
          }

          let newCd = enemy.attackCooldown - dt;
          if (newCd <= 0 && targetHero) {
            newCd = 1 / enemy.atkSpeed;
            const rawDmg = Math.max(1, enemy.atk - targetHero.def * 0.4);
            targetHero.currentHp = Math.max(0, targetHero.currentHp - Math.round(rawDmg));

            soundFx.playAttack('physical');
            setDamagePopups((popups) => [
              ...popups,
              {
                id: `pop_${Date.now()}_${Math.random()}`,
                x: 10 + targetHero.gridX * 7.5,
                y: 12 + targetHero.gridY * 22,
                value: `-${Math.round(rawDmg)}`,
                type: 'physical',
                createdAt: Date.now(),
              },
            ]);
          }

          return {
            ...enemy,
            x: newX,
            attackCooldown: newCd,
            statusEffects: enemy.statusEffects
              .map((s) => ({ ...s, duration: s.duration - dt }))
              .filter((s) => s.duration > 0),
          };
        })
      );

      // 4. Hero Attacks & Skill Triggers
      setHeroes((prevHeroes) =>
        prevHeroes.map((hero) => {
          if (hero.currentHp <= 0) return hero;

          const targetEnemy = livingEnemies.sort((a, b) => a.x - b.x)[0];
          if (!targetEnemy) return hero;

          let newCooldown = hero.attackCooldown - dt;
          let newMana = hero.currentMana;
          let newDmgDealt = hero.damageDealt;

          // Skill Cast Check at 100% Mana
          if (newMana >= hero.maxMana) {
            soundFx.playSkill(hero.heroId);
            newMana = 0;

            const baseDef = HEROES_DATA[hero.heroId];
            const skillDmgMultiplier = hero.tier >= 6 ? 4.5 : 2.5;
            const skillDmg = Math.round(hero.atk * skillDmgMultiplier);

            livingEnemies.slice(0, 3).forEach((e) => {
              const elemBonus = calculateElementalMultiplier(
                baseDef.element,
                ENEMIES_DATA[e.enemyDefId]?.elementWeakness || '',
                ENEMIES_DATA[e.enemyDefId]?.elementResistance || ''
              );
              const totalSkillDmg = Math.round(skillDmg * elemBonus.mult);
              e.currentHp = Math.max(0, e.currentHp - totalSkillDmg);
              newDmgDealt += totalSkillDmg;

              if (hero.heroId === 'ragnar') {
                e.statusEffects.push({ type: 'freeze', duration: 2.2 });
              } else if (hero.heroId === 'guan') {
                e.statusEffects.push({ type: 'burn', duration: 3.5 });
              }

              setDamagePopups((popups) => [
                ...popups,
                {
                  id: `pop_skill_${Date.now()}_${Math.random()}`,
                  x: e.x,
                  y: e.y,
                  value: `${totalSkillDmg}!`,
                  type: baseDef.element as any,
                  createdAt: Date.now(),
                },
              ]);
            });

            return {
              ...hero,
              currentMana: newMana,
              damageDealt: newDmgDealt,
              isCasting: true,
            };
          }

          // Normal Attack
          if (newCooldown <= 0) {
            newCooldown = 1 / hero.atkSpeed;
            newMana = Math.min(hero.maxMana, newMana + 15);

            const baseDef = HEROES_DATA[hero.heroId];
            soundFx.playAttack(baseDef.element);

            const enemyDef = ENEMIES_DATA[targetEnemy.enemyDefId];
            const elemBonus = calculateElementalMultiplier(
              baseDef.element,
              enemyDef?.elementWeakness || '',
              enemyDef?.elementResistance || ''
            );

            const isCrit = Math.random() * 100 < 15;
            let hitDmg = Math.round(hero.atk * elemBonus.mult * (isCrit ? 1.8 : 1.0));
            hitDmg = Math.max(5, hitDmg - (enemyDef?.baseDef || 0) * 0.3);

            targetEnemy.currentHp = Math.max(0, targetEnemy.currentHp - Math.round(hitDmg));
            newDmgDealt += Math.round(hitDmg);

            if (hero.range > 2) {
              setActiveProjectiles((projs) => [
                ...projs,
                {
                  id: `proj_${Date.now()}_${Math.random()}`,
                  sourceX: 10 + hero.gridX * 7.5,
                  sourceY: 12 + hero.gridY * 22,
                  targetX: targetEnemy.x,
                  targetY: targetEnemy.y,
                  progress: 0,
                  speed: 1,
                  color: baseDef.color,
                  element: baseDef.element,
                  damage: hitDmg,
                  isCrit,
                },
              ]);
            }

            setDamagePopups((popups) => [
              ...popups,
              {
                id: `pop_${Date.now()}_${Math.random()}`,
                x: targetEnemy.x + (Math.random() * 4 - 2),
                y: targetEnemy.y - 2,
                value: isCrit ? `CRIT ${Math.round(hitDmg)}` : Math.round(hitDmg),
                type: isCrit ? 'crit' : (baseDef.element as any),
                createdAt: Date.now(),
              },
            ]);
          }

          return {
            ...hero,
            attackCooldown: newCooldown,
            currentMana: newMana,
            damageDealt: newDmgDealt,
            isCasting: false,
          };
        })
      );
    }, tickInterval);

    return () => clearInterval(timer);
  }, [battlePhase, battleSpeed, isPaused, enemies, heroes, currentWaveIndex]);

  const handleNextWave = () => {
    setShowSummaryModal(false);
    if (currentWaveIndex < WAVES_DATA.length - 1) {
      setCurrentWaveIndex((prev) => prev + 1);
      setBattlePhase('preparation');
      setEnemies([]);
      setHeroes((prev) =>
        prev.map((h) => recalculateHeroUnitStats({ ...h, currentHp: h.maxHp }, profile))
      );
    } else {
      setBattlePhase('victory');
      setShowSummaryModal(true);
    }
  };

  const isCombatActive = battlePhase === 'combat';

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto pb-16 select-none">
      {/* Top Resource & Wave Header */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-700/50 flex items-center gap-1.5 text-xs">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-bold text-amber-300 tabular-nums">{silver} Tribute</span>
          </div>

          <div className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 tabular-nums">
            {profile.battlePoints} BP
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReturnToWarRoom}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
          >
            Temple
          </button>
        </div>
      </div>

      {/* Main Battle Screen Scrollable Content */}
      <div className="p-3 space-y-3">
        {/* Real-time Battlefield Arena */}
        <Battlefield
          heroes={heroes}
          enemies={enemies}
          currentWave={currentWave}
          battleSpeed={battleSpeed}
          onSetBattleSpeed={setBattleSpeed}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
          damagePopups={damagePopups}
          activeProjectiles={activeProjectiles}
        />

        {/* Tactical 4x4 Grid (Soul Convergence & Placement) */}
        <HeroPlacementGrid
          heroes={heroes}
          onMergeHeroes={handleMergeHeroes}
          onMoveHero={handleMoveHero}
          onInspectHero={(h) => setInspectedHero(h)}
          selectedHeroId={selectedHeroId}
          onSelectHero={setSelectedHeroId}
          isCombatActive={isCombatActive}
        />

        {/* Sacred Relic Inventory Bar */}
        <InventoryBar
          items={inventoryItems}
          heroes={heroes}
          onEquipItem={handleEquipItem}
          onMergeItems={handleMergeItems}
          isCombatActive={isCombatActive}
        />
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 z-30 max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Summon Ancestor Button */}
          <button
            onClick={handleSummonHero}
            disabled={silver < summonCost || isCombatActive}
            className="py-3 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs flex flex-col items-center justify-center border border-slate-755 transition-all shadow-md"
          >
            <div className="flex items-center gap-1 text-amber-400 font-serif">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Summon Ancestor</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Cost: {summonCost} Tribute
            </div>
          </button>

          {/* Start Wave Button */}
          <button
            onClick={handleStartCombat}
            disabled={isCombatActive}
            className={`py-3 px-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all shadow-lg font-serif ${
              isCombatActive
                ? 'bg-red-950/40 text-red-300 border border-red-800/60 pointer-events-none'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {isCombatActive ? (
                <>
                  <Swords className="w-4 h-4 animate-spin text-red-400" />
                  <span>Battle In Progress</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start Wave {currentWave.waveNumber}</span>
                </>
              )}
            </div>
            <div className={`text-[10px] mt-0.5 ${isCombatActive ? 'text-red-400' : 'text-slate-900 font-medium'}`}>
              {isCombatActive ? 'Warriors Engaged' : currentWave.title}
            </div>
          </button>
        </div>
      </div>

      {/* Post Wave Summary Modal */}
      {showSummaryModal && (
        <WaveSummaryModal
          isVictory={battlePhase === 'wave_cleared'}
          isGameOver={battlePhase === 'game_over'}
          isFinalRunVictory={battlePhase === 'victory'}
          currentWave={currentWave}
          heroes={heroes}
          silverEarned={waveSilverEarned}
          bpEarned={waveBpEarned}
          droppedItems={waveDroppedItems}
          onNextWave={handleNextWave}
          onReturnToCastle={onReturnToWarRoom}
        />
      )}

      {/* Live Hero Inspector Modal */}
      {inspectedHero && (
        <HeroModal
          hero={inspectedHero}
          onClose={() => setInspectedHero(null)}
        />
      )}
    </div>
  );
};

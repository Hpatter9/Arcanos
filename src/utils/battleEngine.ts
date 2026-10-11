import {
  DamagePopup,
  EnemyDef,
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
import { calculateHeroPersistentStats } from './storage';
import { soundFx } from './audio';

// Rank scaling multipliers (Soul Convergence Ascension)
export const RANK_MULTIPLIERS = [1, 2.1, 4.3, 8.8, 17.5, 36.0];

export function createHeroUnit(
  heroId: HeroId,
  gridX: number,
  gridY: number,
  profile: PlayerProfile,
  tier: number = 1
): HeroUnit {
  const baseDef = HEROES_DATA[heroId];
  const persistent = calculateHeroPersistentStats(heroId, profile);
  const rankMult = RANK_MULTIPLIERS[Math.min(tier - 1, 5)];

  const maxHp = Math.round(persistent.hp * rankMult);
  const atk = Math.round(persistent.atk * rankMult);
  const def = Math.round(persistent.def * (1 + (tier - 1) * 0.25));
  const atkSpeed = persistent.aspd * (1 + (tier - 1) * 0.08);

  return {
    unitId: `hero_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    heroId,
    tier,
    gridX,
    gridY,
    currentHp: maxHp,
    maxHp,
    currentMana: persistent.startingMana,
    maxMana: baseDef.maxMana,
    atk,
    def,
    atkSpeed,
    range: baseDef.range,
    equippedItems: [],
    damageDealt: 0,
    damageTaken: 0,
    healingDone: 0,
    kills: 0,
    isCasting: false,
    castProgress: 0,
    attackCooldown: 0,
    statusEffects: [],
  };
}

export function recalculateHeroUnitStats(
  hero: HeroUnit,
  profile: PlayerProfile
): HeroUnit {
  const baseDef = HEROES_DATA[hero.heroId];
  const persistent = calculateHeroPersistentStats(hero.heroId, profile);
  const rankMult = RANK_MULTIPLIERS[Math.min(hero.tier - 1, 5)];

  let baseMaxHp = Math.round(persistent.hp * rankMult);
  let baseAtk = Math.round(persistent.atk * rankMult);
  let baseDefStat = Math.round(persistent.def * (1 + (hero.tier - 1) * 0.25));
  let baseAspd = persistent.aspd * (1 + (hero.tier - 1) * 0.08);

  // Apply in-battle equipped cultural relics
  hero.equippedItems.forEach((item) => {
    if (item.bonus.hp) baseMaxHp += item.bonus.hp * (hero.tier >= 6 ? 2 : 1);
    if (item.bonus.atk) baseAtk += item.bonus.atk * (hero.tier >= 6 ? 2 : 1);
    if (item.bonus.aspd) baseAspd *= 1 + item.bonus.aspd / 100;
  });

  const hpRatio = hero.maxHp > 0 ? hero.currentHp / hero.maxHp : 1;
  const newMaxHp = baseMaxHp;
  const newCurrentHp = Math.min(newMaxHp, Math.round(newMaxHp * hpRatio));

  return {
    ...hero,
    maxHp: newMaxHp,
    currentHp: Math.max(1, newCurrentHp),
    atk: baseAtk,
    def: baseDefStat,
    atkSpeed: Number(baseAspd.toFixed(2)),
    range: baseDef.range,
  };
}

export function spawnEnemyUnit(
  enemyDefId: string,
  waveIndex: number,
  indexInWave: number,
  totalEnemiesInWave: number
): EnemyUnit {
  const def: EnemyDef = ENEMIES_DATA[enemyDefId] || ENEMIES_DATA.draugr_wight;
  const waveScaling = 1 + waveIndex * 0.16;
  const maxHp = Math.round(def.baseHp * waveScaling);
  const atk = Math.round(def.baseAtk * (1 + waveIndex * 0.12));
  const defStat = Math.round(def.baseDef * (1 + waveIndex * 0.1));

  // Spawn position distribution across lanes
  const laneY = 12 + ((indexInWave % 4) * 22) + (Math.random() * 4 - 2);
  const startX = 85 + (indexInWave * 4.5);

  return {
    unitId: `enemy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    enemyDefId,
    currentHp: maxHp,
    maxHp,
    atk,
    def: defStat,
    atkSpeed: def.atkSpeed,
    range: def.range,
    moveSpeed: def.moveSpeed,
    x: startX,
    y: Math.min(88, Math.max(12, laneY)),
    attackCooldown: 0.5 + Math.random() * 0.5,
    statusEffects: [],
    isBoss: def.isBoss,
    patternTimer: 0,
  };
}

export function calculateElementalMultiplier(
  attackElement: string,
  targetWeakness: string,
  targetResistance: string
): { mult: number; isCritEffect: boolean } {
  if (attackElement === targetWeakness) {
    return { mult: 1.45, isCritEffect: true };
  }
  if (attackElement === targetResistance) {
    return { mult: 0.65, isCritEffect: false };
  }
  return { mult: 1.0, isCritEffect: false };
}

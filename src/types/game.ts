export type ElementType = 'holy' | 'wind' | 'fire' | 'frost' | 'physical' | 'lightning';

export type HeroId = 'ragnar' | 'tomoe' | 'guan' | 'nefertari';

export type HeroCulture = 'Norse / Viking' | 'Feudal Japan / Samurai' | 'Imperial China / Dynasty' | 'Ancient Egypt / Nile';

export type HeroRole = 'Berserker Jarl' | 'Shadowblade Onna-Musha' | 'Dragon Vanguard General' | 'High Sun Priestess';

export type AscensionRank = 1 | 2 | 3 | 4 | 5 | 6;

export const RANK_NAMES: Record<number, string> = {
  1: 'Initiate',
  2: 'Veteran',
  3: 'Champion',
  4: 'Warlord',
  5: 'Mythic Hero',
  6: 'Demigod Avatar',
};

export interface SkillNode {
  id: string;
  tier: 1 | 2 | 3;
  branch: 'A' | 'B';
  name: string;
  description: string;
  statModifier?: {
    atkPercent?: number;
    hpPercent?: number;
    critRate?: number;
    aspdPercent?: number;
    manaStart?: number;
  };
  specialEffect?: string;
  unlocked: boolean;
}

export interface EquipmentSlot {
  type: 'weapon' | 'armor' | 'relic';
  equippedItem?: EquipmentItem;
}

export interface HeroDef {
  id: HeroId;
  name: string;
  title: string;
  culture: HeroCulture;
  role: HeroRole;
  element: ElementType;
  color: string;
  accentBg: string;
  borderColor: string;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseAtkSpeed: number; // attacks per second
  range: number; // 1 = melee, 2.5 = mid, 4.5 = long
  maxMana: number;
  avatarIcon: string;
  skillName: string;
  skillDescription: string;
  skillCooldown: number;
  ultimateForm: {
    name: string;
    title: string;
    description: string;
    auraColor: string;
    bonusStatsDescription: string;
  };
  skillTreeBranches: {
    tier1: { A: SkillNode; B: SkillNode };
    tier2: { A: SkillNode; B: SkillNode };
    tier3: { A: SkillNode; B: SkillNode };
  };
}

export interface EquipmentItem {
  id: string;
  instanceId: string;
  name: string;
  tier: 1 | 2 | 3;
  type: 'weapon' | 'armor' | 'bow' | 'staff' | 'relic';
  culture: string;
  icon: string;
  description: string;
  bonus: {
    atk?: number;
    hp?: number;
    aspd?: number;
    critChance?: number;
    manaStart?: number;
    spellPower?: number;
  };
}

export interface HeroUnit {
  unitId: string;
  heroId: HeroId;
  tier: number; // 1 to 6 (6 is Demigod Avatar)
  gridX: number; // 0 to 3
  gridY: number; // 0 to 3
  currentHp: number;
  maxHp: number;
  currentMana: number;
  maxMana: number;
  atk: number;
  def: number;
  atkSpeed: number;
  range: number;
  equippedItems: EquipmentItem[];
  damageDealt: number;
  damageTaken: number;
  healingDone: number;
  kills: number;
  isCasting: boolean;
  castProgress: number; // 0 to 1
  attackCooldown: number; // in seconds
  targetEnemyId?: string;
  x?: number; // pixel coords on battlefield
  y?: number;
  statusEffects: StatusEffect[];
}

export interface EnemyDef {
  id: string;
  name: string;
  title: string;
  mythos: string; // Norse, Japanese, Egyptian, Chinese, etc.
  elementWeakness: ElementType;
  elementResistance: ElementType;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  atkSpeed: number;
  range: number;
  moveSpeed: number;
  attackPattern:
    | 'melee_swarm'
    | 'ranged_pierce'
    | 'stone_wall'
    | 'chilling_chill'
    | 'backline_teleport'
    | 'support_heal_buff'
    | 'behemoth_flame_aura'
    | 'boss_black_hole';
  patternDescription: string;
  icon: string;
  color: string;
  isBoss?: boolean;
}

export interface StatusEffect {
  type: 'burn' | 'freeze' | 'slow' | 'shield' | 'stun';
  duration: number; // remaining seconds
  value?: number;
  sourceHeroId?: HeroId;
}

export interface EnemyUnit {
  unitId: string;
  enemyDefId: string;
  currentHp: number;
  maxHp: number;
  atk: number;
  def: number;
  atkSpeed: number;
  range: number;
  moveSpeed: number;
  x: number; // 0 to 100 percentage of battle lane
  y: number; // lane Y offset
  attackCooldown: number;
  targetHeroUnitId?: string;
  statusEffects: StatusEffect[];
  isBoss?: boolean;
  patternTimer?: number;
}

export interface Projectile {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  progress: number; // 0 to 1
  speed: number;
  color: string;
  element: ElementType;
  damage: number;
  isCrit: boolean;
  targetEnemyUnitId?: string;
  targetHeroUnitId?: string;
}

export interface DamagePopup {
  id: string;
  x: number;
  y: number;
  value: number | string;
  type: 'physical' | 'holy' | 'fire' | 'frost' | 'wind' | 'crit' | 'heal' | 'miss';
  createdAt: number;
}

export interface PersistentHero {
  heroId: HeroId;
  level: number;
  unlockedSkillIds: string[];
  equipment: {
    weapon?: EquipmentItem;
    armor?: EquipmentItem;
    relic?: EquipmentItem;
  };
}

export interface PantheonDevotion {
  odinValhalla: number;        // Norse: Fury, lifesteal & Einherjar resilience
  raSolar: number;             // Egyptian: Solar burn, starting mana & divine judgment
  hachimanBushido: number;     // Japanese: Precision crits, armor pierce & counter-stance
  guanYuCelestial: number;     // Chinese: Celestial dragon qi, starting gold & higher rank summon chance
  thunderbirdSpirit: number;   // Native American: Sky spirits, wind speed & defensive totems
}

export type BattleDoctrineId = 'valhalla_charge' | 'sun_phalanx' | 'bushido_focus' | 'dragon_harmony' | 'totem_spirits';

export interface BattleDoctrine {
  id: BattleDoctrineId;
  name: string;
  origin: string;
  description: string;
  effectDescription: string;
  icon: string;
}

export interface PlayerProfile {
  battlePoints: number;
  silverGold: number;
  devotionPointsTotal: number;
  devotion: PantheonDevotion;
  activeDoctrine: BattleDoctrineId;
  highestWave: number;
  totalKills: number;
  totalBossWins: number;
  heroes: Record<HeroId, PersistentHero>;
}

export type GameScreen = 'battle' | 'barracks' | 'codex' | 'summary';

export type BattlePhase = 'preparation' | 'combat' | 'wave_cleared' | 'game_over' | 'victory';

export type { WaveConfig } from '../data/wavesData';

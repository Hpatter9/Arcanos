import { HeroId, PlayerProfile } from '../types/game';
import { HEROES_DATA } from '../data/heroesData';
import { createItem } from '../data/itemsData';

const STORAGE_KEY = 'pantheon_player_profile_v2';

export const INITIAL_PROFILE: PlayerProfile = {
  battlePoints: 260, // Starting BP for upgrades
  silverGold: 100,
  devotionPointsTotal: 25,
  devotion: {
    odinValhalla: 5,
    raSolar: 5,
    hachimanBushido: 5,
    guanYuCelestial: 5,
    thunderbirdSpirit: 5,
  },
  activeDoctrine: 'valhalla_charge',
  highestWave: 1,
  totalKills: 0,
  totalBossWins: 0,
  heroes: {
    ragnar: {
      heroId: 'ragnar',
      level: 1,
      unlockedSkillIds: ['ragnar_t1_a'],
      equipment: {
        weapon: createItem('axe', 1),
      },
    },
    tomoe: {
      heroId: 'tomoe',
      level: 1,
      unlockedSkillIds: ['tomoe_t1_a'],
      equipment: {
        weapon: createItem('katana', 1),
      },
    },
    guan: {
      heroId: 'guan',
      level: 1,
      unlockedSkillIds: ['guan_t1_a'],
      equipment: {
        armor: createItem('armor', 1),
      },
    },
    nefertari: {
      heroId: 'nefertari',
      level: 1,
      unlockedSkillIds: ['nefertari_t1_a'],
      equipment: {
        weapon: createItem('scepter', 1),
      },
    },
  },
};

export function loadPlayerProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROFILE;
    const parsed = JSON.parse(raw);
    const heroes = { ...INITIAL_PROFILE.heroes, ...(parsed.heroes || {}) };
    const devotion = { ...INITIAL_PROFILE.devotion, ...(parsed.devotion || {}) };
    return {
      ...INITIAL_PROFILE,
      ...parsed,
      heroes,
      devotion,
      activeDoctrine: parsed.activeDoctrine || 'valhalla_charge',
      devotionPointsTotal: parsed.devotionPointsTotal || 25,
    };
  } catch (err) {
    console.error('Failed to load player profile:', err);
    return INITIAL_PROFILE;
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save player profile:', err);
  }
}

export function getHeroLevelCost(currentLevel: number): number {
  return Math.floor(40 * Math.pow(1.35, currentLevel - 1));
}

export function calculateHeroPersistentStats(heroId: HeroId, profile: PlayerProfile) {
  const base = HEROES_DATA[heroId];
  const heroProg = profile.heroes[heroId] || { level: 1, unlockedSkillIds: [], equipment: {} };
  const level = heroProg.level || 1;

  // Level scaling: +12% HP, +8% ATK, +6% DEF per level above 1
  const levelMultHp = 1 + (level - 1) * 0.12;
  const levelMultAtk = 1 + (level - 1) * 0.08;
  const levelMultDef = 1 + (level - 1) * 0.06;

  let totalHp = Math.round(base.baseHp * levelMultHp);
  let totalAtk = Math.round(base.baseAtk * levelMultAtk);
  let totalDef = Math.round(base.baseDef * levelMultDef);
  let totalAspd = base.baseAtkSpeed;
  let totalCrit = 5;
  let startingMana = 0;
  let lifesteal = 0;

  // World Gods Devotion bonuses
  const devotion = profile.devotion || {
    odinValhalla: 0,
    raSolar: 0,
    hachimanBushido: 0,
    guanYuCelestial: 0,
    thunderbirdSpirit: 0,
  };

  // Odin: Lifesteal & Base HP
  totalHp += (devotion.odinValhalla || 0) * 25;
  lifesteal += (devotion.odinValhalla || 0) * 1.5;

  // Ra: Starting Mana & Spell Power
  startingMana += (devotion.raSolar || 0) * 4;
  totalAtk += Math.round((devotion.raSolar || 0) * 2.5);

  // Hachiman: Crit Chance & Armor Pierce
  totalCrit += (devotion.hachimanBushido || 0) * 1.5;

  // Thunderbird: Damage Reduction & Attack Speed
  totalAspd *= 1 + ((devotion.thunderbirdSpirit || 0) * 0.02);
  totalDef += (devotion.thunderbirdSpirit || 0) * 3;

  // Ancient War Doctrine bonuses
  if (profile.activeDoctrine === 'valhalla_charge') {
    if (base.role === 'Berserker Jarl' || base.role === 'Dragon Vanguard General') {
      totalHp = Math.round(totalHp * 1.35);
      totalDef = Math.round(totalDef * 1.25);
    }
  } else if (profile.activeDoctrine === 'bushido_focus') {
    totalAspd *= 1.25;
    totalCrit += 25;
  } else if (profile.activeDoctrine === 'dragon_harmony') {
    totalHp = Math.round(totalHp * 1.1);
    totalAtk = Math.round(totalAtk * 1.1);
  } else if (profile.activeDoctrine === 'sun_phalanx') {
    startingMana += 20;
  } else if (profile.activeDoctrine === 'totem_spirits') {
    totalHp += 120;
    totalAspd *= 1.15;
  }

  // Unlocked skill tree nodes
  const unlocked = new Set(heroProg.unlockedSkillIds || []);
  const branches = [
    base.skillTreeBranches.tier1.A, base.skillTreeBranches.tier1.B,
    base.skillTreeBranches.tier2.A, base.skillTreeBranches.tier2.B,
    base.skillTreeBranches.tier3.A, base.skillTreeBranches.tier3.B,
  ];
  branches.forEach((node) => {
    if (unlocked.has(node.id) && node.statModifier) {
      if (node.statModifier.hpPercent) totalHp = Math.round(totalHp * (1 + node.statModifier.hpPercent / 100));
      if (node.statModifier.atkPercent) totalAtk = Math.round(totalAtk * (1 + node.statModifier.atkPercent / 100));
      if (node.statModifier.aspdPercent) totalAspd *= 1 + node.statModifier.aspdPercent / 100;
      if (node.statModifier.critRate) totalCrit += node.statModifier.critRate;
      if (node.statModifier.manaStart) startingMana += node.statModifier.manaStart;
    }
  });

  // Persistent equipment bonuses
  Object.values(heroProg.equipment || {}).forEach((gear) => {
    if (!gear) return;
    if (gear.bonus.hp) totalHp += gear.bonus.hp;
    if (gear.bonus.atk) totalAtk += gear.bonus.atk;
    if (gear.bonus.aspd) totalAspd *= 1 + gear.bonus.aspd / 100;
    if (gear.bonus.critChance) totalCrit += gear.bonus.critChance;
    if (gear.bonus.manaStart) startingMana += gear.bonus.manaStart;
  });

  return {
    hp: totalHp,
    atk: totalAtk,
    def: totalDef,
    aspd: Number(totalAspd.toFixed(2)),
    crit: totalCrit,
    startingMana,
    lifesteal,
    level,
  };
}

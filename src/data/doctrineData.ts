import { BattleDoctrine, BattleDoctrineId, PantheonDevotion } from '../types/game';

export const BATTLE_DOCTRINES: Record<BattleDoctrineId, BattleDoctrine> = {
  valhalla_charge: {
    id: 'valhalla_charge',
    name: 'Valhalla Shieldwall',
    origin: 'Norse / Viking Tradition',
    description: 'Fierce frontline shieldwall that grows deadlier as warriors absorb blows.',
    effectDescription: 'Frontline heroes gain +35% Max HP & +25% Armor; gain +3% Attack for every 10% HP missing.',
    icon: 'Shield',
  },
  bushido_focus: {
    id: 'bushido_focus',
    name: 'Bushido Iaijutsu Rush',
    origin: 'Feudal Samurai Discipline',
    description: 'Precision opening blitz focusing all spiritual focus into early decisive strikes.',
    effectDescription: 'First 12s of every wave: +45% Attack Speed, +25% Critical Hit Chance, and 20% Armor Pierce.',
    icon: 'Zap',
  },
  dragon_harmony: {
    id: 'dragon_harmony',
    name: 'Celestial Dragon Strategy',
    origin: 'Sun Tzu / Imperial China',
    description: 'Ancient tactical discipline prioritizing resource advantage and balanced combat prowess.',
    effectDescription: '+12 Starting Tribute (Silver), +3 Tribute on wave clear, +10% All Hero Combat Stats.',
    icon: 'Crown',
  },
  sun_phalanx: {
    id: 'sun_phalanx',
    name: "Pharaoh's Solar Aegis",
    origin: 'Nile / Egyptian Divine Ward',
    description: 'Chants of the priests invoking the sun disk to scorch enemy vulnerabilities.',
    effectDescription: 'Elemental weakness damage amplified from +45% to +85%; all heroes start with +20 Mana.',
    icon: 'Flame',
  },
  totem_spirits: {
    id: 'totem_spirits',
    name: 'Thunderbird Sky Totem',
    origin: 'Native American Spirit Lore',
    description: 'Channels the ancestral spirits of the wind and sky to bestow agility and sacred shields.',
    effectDescription: '+20% Evasion to all heroes; dodging an attack grants a 120 HP Spirit Barrier.',
    icon: 'Sparkles',
  },
};

export interface PantheonGodInfo {
  key: keyof PantheonDevotion;
  godName: string;
  pantheon: string;
  domain: string;
  icon: string;
  color: string;
  effectPerPoint: string;
  tier5Boon: string;
  tier10Boon: string;
  tier15Boon: string;
}

export const PANTHEON_GODS_INFO: PantheonGodInfo[] = [
  {
    key: 'odinValhalla',
    godName: 'Odin the Allfather',
    pantheon: 'Norse / Viking Pantheon',
    domain: 'God of War, Wisdom & the Einherjar',
    icon: 'Axe',
    color: '#38BDF8',
    effectPerPoint: '+1.5% Physical & Spell Lifesteal + 25 Base HP',
    tier5Boon: 'Tier 5 Favor: Warriors heal 15% Max HP upon clearing each wave',
    tier10Boon: 'Tier 10 Favor: Overhealing converts into permanent run shield (up to 25% Max HP)',
    tier15Boon: 'Tier 15 Divine: Einherjar Revive: First hero to fall survives with 3s invulnerability!',
  },
  {
    key: 'raSolar',
    godName: 'Ra the Sun God',
    pantheon: 'Ancient Egyptian Pantheon',
    domain: 'Sun Lord, Light & Divine Creation',
    icon: 'Sun',
    color: '#F59E0B',
    effectPerPoint: '+4 Starting Mana & +2.5% Holy/Fire Spell Power',
    tier5Boon: 'Tier 5 Favor: First skill cast in wave consumes 25% less mana',
    tier10Boon: 'Tier 10 Favor: Landing a critical strike restores 15 Mana to the caster',
    tier15Boon: 'Tier 15 Divine: Blinding Sunrise: Wave opens with a solar flare stunning all foes for 2s',
  },
  {
    key: 'hachimanBushido',
    godName: 'Hachiman Kami of War',
    pantheon: 'Japanese Shinto Pantheon',
    domain: 'Kami of Archery, Steel & Bushido Honor',
    icon: 'Swords',
    color: '#10B981',
    effectPerPoint: '+1.5% Critical Hit Chance & +2% Armor Pierce',
    tier5Boon: 'Tier 5 Favor: Critical hits reduce enemy armor by 25% for 4s',
    tier10Boon: 'Tier 10 Favor: Backline heroes deal +20% damage to high-health targets',
    tier15Boon: 'Tier 15 Divine: Master Iaijutsu: Basic attacks have 15% chance to trigger an instant double strike',
  },
  {
    key: 'guanYuCelestial',
    godName: 'Guan Yu & The Jade Heavens',
    pantheon: 'Chinese Celestial Pantheon',
    domain: 'Saint of War, Loyalty & Prosperity',
    icon: 'Crown',
    color: '#EF4444',
    effectPerPoint: '+2.5% chance to summon at Rank II (Veteran) & +1 Starting Tribute',
    tier5Boon: 'Tier 5 Favor: +1 Tribute interest per 10 Tribute held at wave end (up to +5)',
    tier10Boon: 'Tier 10 Favor: 10% chance to summon heroes directly at Rank III (Champion)',
    tier15Boon: 'Tier 15 Divine: Ancestral Fusion Fortune: Performing any soul merge grants +1 free Tribute',
  },
  {
    key: 'thunderbirdSpirit',
    godName: 'Thunderbird & Great Spirit',
    pantheon: 'Native American Totemic Spirits',
    domain: 'Spirits of Sky, Thunder & Sacred Wind',
    icon: 'Zap',
    color: '#A855F7',
    effectPerPoint: '+2% Damage Reduction & +2% Attack Speed',
    tier5Boon: 'Tier 5 Favor: Immune to Stun and Freeze for the first 6s of every battle',
    tier10Boon: 'Tier 10 Favor: Wave bosses drop an additional Relic equipment item upon defeat',
    tier15Boon: 'Tier 15 Divine: Great Spirit Shield: All heroes enter combat with a 300 HP elemental totem barrier',
  },
];

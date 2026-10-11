import { EquipmentItem } from '../types/game';

export interface BaseItemTemplate {
  baseId: string;
  nameTiers: [string, string, string];
  type: EquipmentItem['type'];
  culture: string;
  icon: string;
  descriptionTiers: [string, string, string];
  bonusTiers: [
    EquipmentItem['bonus'],
    EquipmentItem['bonus'],
    EquipmentItem['bonus']
  ];
}

export const ITEM_TEMPLATES: BaseItemTemplate[] = [
  {
    baseId: 'axe',
    nameTiers: ['Viking Bearded Axe', 'Dane War Axe', "Thor's Thunder Cleaver"],
    type: 'weapon',
    culture: 'Norse / Viking',
    icon: 'Axe',
    descriptionTiers: [
      '+18 Attack Damage',
      '+45 Attack Damage & +12% Crit Chance',
      '+115 Attack Damage, +25% Crit Chance & +20% Armor Pierce',
    ],
    bonusTiers: [
      { atk: 18 },
      { atk: 45, critChance: 12 },
      { atk: 115, critChance: 25 },
    ],
  },
  {
    baseId: 'katana',
    nameTiers: ['Kamakura Katana', 'Muramasa Nodachi', 'Kusanagi Sacred Blade'],
    type: 'bow',
    culture: 'Feudal Japan / Samurai',
    icon: 'Swords',
    descriptionTiers: [
      '+20% Attack Speed',
      '+45% Attack Speed & +14 Attack',
      '+90% Attack Speed, +32 Attack & 15% Double Strike Chance',
    ],
    bonusTiers: [
      { aspd: 20 },
      { aspd: 45, atk: 14 },
      { aspd: 90, atk: 32 },
    ],
  },
  {
    baseId: 'scepter',
    nameTiers: ['Sun Priestess Was-Scepter', 'Eye of Horus Staff', 'Ra Solar Pyre Scepter'],
    type: 'staff',
    culture: 'Ancient Egypt',
    icon: 'Sparkles',
    descriptionTiers: [
      '+25 Starting Mana & +15 Spell Power',
      '+50 Starting Mana & +40 Spell Power',
      '+85 Starting Mana, +95 Spell Power & 20% Skill Cooldown Reduction',
    ],
    bonusTiers: [
      { manaStart: 25, spellPower: 15 },
      { manaStart: 50, spellPower: 40 },
      { manaStart: 85, spellPower: 95 },
    ],
  },
  {
    baseId: 'armor',
    nameTiers: ['Dragon Scale Lamellar', 'Samurai O-Yoroi Plate', 'Aegis of the Pharaohs'],
    type: 'armor',
    culture: 'Imperial China & Egypt',
    icon: 'Shield',
    descriptionTiers: [
      '+160 Max Health',
      '+400 Max Health & +18 Defense',
      '+900 Max Health, +38 Defense & 15% Damage Reduction',
    ],
    bonusTiers: [
      { hp: 160 },
      { hp: 400 },
      { hp: 900 },
    ],
  },
  {
    baseId: 'relic',
    nameTiers: ['Thunderbird Feather Totem', 'Golden Ankh of Eternity', 'Jade Dragon Imperial Seal'],
    type: 'relic',
    culture: 'Native American & Ancient Pantheons',
    icon: 'Crown',
    descriptionTiers: [
      '+12% Crit Chance',
      '+22% Crit Chance & +140 Health',
      '+35% Crit Chance, +320 Health & 20% Life Leech on hit',
    ],
    bonusTiers: [
      { critChance: 12 },
      { critChance: 22, hp: 140 },
      { critChance: 35, hp: 320 },
    ],
  },
];

export function createItem(baseId: string, tier: 1 | 2 | 3 = 1): EquipmentItem {
  const template = ITEM_TEMPLATES.find((t) => t.baseId === baseId) || ITEM_TEMPLATES[0];
  const tierIndex = (tier - 1) as 0 | 1 | 2;
  return {
    id: `${template.baseId}_t${tier}`,
    instanceId: `relic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: template.nameTiers[tierIndex],
    tier,
    type: template.type,
    culture: template.culture,
    icon: template.icon,
    description: template.descriptionTiers[tierIndex],
    bonus: template.bonusTiers[tierIndex],
  };
}

export function getRandomLootItem(): EquipmentItem {
  const template = ITEM_TEMPLATES[Math.floor(Math.random() * ITEM_TEMPLATES.length)];
  return createItem(template.baseId, 1);
}

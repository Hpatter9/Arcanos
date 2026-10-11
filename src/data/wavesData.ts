export interface WaveEnemySpawn {
  enemyId: string;
  count: number;
  spawnDelayMs?: number;
}

export interface WaveConfig {
  waveNumber: number;
  title: string;
  subTitle: string;
  enemies: WaveEnemySpawn[];
  silverReward: number;
  bpReward: number;
  itemDropChance: number;
  isBossWave?: boolean;
}

export const WAVES_DATA: WaveConfig[] = [
  {
    waveNumber: 1,
    title: 'The Barrow Awakens',
    subTitle: 'Norse Draugr wights rise from the burial mounds',
    enemies: [
      { enemyId: 'draugr_wight', count: 3 },
    ],
    silverReward: 8,
    bpReward: 25,
    itemDropChance: 0.8,
  },
  {
    waveNumber: 2,
    title: 'Tempest in the Cherry Groves',
    subTitle: 'Draugr raiders flanked by Tengu wind-reavers',
    enemies: [
      { enemyId: 'draugr_wight', count: 3 },
      { enemyId: 'tengu_reaver', count: 2 },
    ],
    silverReward: 10,
    bpReward: 35,
    itemDropChance: 0.65,
  },
  {
    waveNumber: 3,
    title: 'Clay & Jackal Claws',
    subTitle: 'Imperial Terracotta sentinel marches with an Anubite assassin',
    enemies: [
      { enemyId: 'terracotta_sentinel', count: 1 },
      { enemyId: 'draugr_wight', count: 3 },
      { enemyId: 'anubite_stalker', count: 1 },
    ],
    silverReward: 12,
    bpReward: 45,
    itemDropChance: 0.7,
  },
  {
    waveNumber: 4,
    title: 'Wailing of the Netherworld',
    subTitle: 'Spirit Banshees slow attack speed while Jiangshi Taoists heal',
    enemies: [
      { enemyId: 'cursed_banshee', count: 2 },
      { enemyId: 'jiangshi_taoist', count: 1 },
      { enemyId: 'tengu_reaver', count: 2 },
    ],
    silverReward: 15,
    bpReward: 55,
    itemDropChance: 0.75,
  },
  {
    waveNumber: 5,
    title: "MINI-BOSS: Apep's Chaos Serpent",
    subTitle: 'The primordial Egyptian underworld serpent strikes!',
    enemies: [
      { enemyId: 'apep_serpent', count: 1 },
      { enemyId: 'draugr_wight', count: 3 },
      { enemyId: 'tengu_reaver', count: 2 },
    ],
    silverReward: 22,
    bpReward: 120,
    itemDropChance: 1.0,
    isBossWave: true,
  },
  {
    waveNumber: 6,
    title: 'Shadows of the Tomb',
    subTitle: 'Twin Anubite stalkers leap directly into your backline!',
    enemies: [
      { enemyId: 'anubite_stalker', count: 2 },
      { enemyId: 'terracotta_sentinel', count: 1 },
      { enemyId: 'cursed_banshee', count: 2 },
    ],
    silverReward: 16,
    bpReward: 70,
    itemDropChance: 0.75,
  },
  {
    waveNumber: 7,
    title: 'Imperial Necromancy',
    subTitle: 'Taoist priests enchant heavily armored clay juggernauts',
    enemies: [
      { enemyId: 'terracotta_sentinel', count: 2 },
      { enemyId: 'jiangshi_taoist', count: 2 },
      { enemyId: 'tengu_reaver', count: 3 },
    ],
    silverReward: 18,
    bpReward: 85,
    itemDropChance: 0.8,
  },
  {
    waveNumber: 8,
    title: 'Howling Blizzard Horde',
    subTitle: 'Overwhelming assault of Draugr and chilling banshees',
    enemies: [
      { enemyId: 'draugr_wight', count: 5 },
      { enemyId: 'cursed_banshee', count: 3 },
      { enemyId: 'anubite_stalker', count: 2 },
    ],
    silverReward: 20,
    bpReward: 100,
    itemDropChance: 0.85,
  },
  {
    waveNumber: 9,
    title: 'Muspelheim Vanguard',
    subTitle: 'The dread army heralds the coming of Surtr the World-Ender',
    enemies: [
      { enemyId: 'terracotta_sentinel', count: 2 },
      { enemyId: 'jiangshi_taoist', count: 2 },
      { enemyId: 'anubite_stalker', count: 2 },
      { enemyId: 'cursed_banshee', count: 2 },
    ],
    silverReward: 24,
    bpReward: 130,
    itemDropChance: 0.9,
  },
  {
    waveNumber: 10,
    title: 'FINAL BATTLE: Surtr the World-Ender',
    subTitle: 'Vanquish the Twilight Fire Lord with ancestral harmony!',
    enemies: [
      { enemyId: 'surtr_titan', count: 1 },
      { enemyId: 'anubite_stalker', count: 2 },
      { enemyId: 'jiangshi_taoist', count: 1 },
      { enemyId: 'terracotta_sentinel', count: 1 },
    ],
    silverReward: 40,
    bpReward: 350,
    itemDropChance: 1.0,
    isBossWave: true,
  },
];

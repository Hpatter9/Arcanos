import React, { useState } from 'react';
import {
  PantheonDevotion,
  BattleDoctrineId,
  PlayerProfile,
  HeroId,
} from '../types/game';
import { PANTHEON_GODS_INFO, BATTLE_DOCTRINES } from '../data/doctrineData';
import { HEROES_DATA } from '../data/heroesData';
import { ENEMIES_DATA } from '../data/enemiesData';
import { WAVES_DATA } from '../data/wavesData';
import { PixelSprite } from './PixelSprite';
import { soundFx } from '../utils/audio';
import {
  Shield,
  Zap,
  Flame,
  Coins,
  Crown,
  Sun,
  Sparkles,
  ChevronRight,
  Info,
  RotateCcw,
  Swords,
  Crosshair,
  ArrowRight,
  Users,
} from 'lucide-react';

interface PrepWarRoomProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onStartRun: () => void;
  onOpenBarracks: (heroId?: HeroId) => void;
  onOpenCodex: () => void;
}

export const PrepWarRoom: React.FC<PrepWarRoomProps> = ({
  profile,
  onUpdateProfile,
  onStartRun,
  onOpenBarracks,
  onOpenCodex,
}) => {
  const [activeTab, setActiveTab] = useState<'pantheon' | 'doctrines' | 'scout' | 'roster'>('pantheon');
  const [scoutedWaveIdx, setScoutedWaveIdx] = useState(0);

  // Calculate used devotion points
  const totalAllocated = Object.values(profile.devotion).reduce((sum, val) => sum + val, 0);
  const remainingPoints = profile.devotionPointsTotal - totalAllocated;

  const handleAdjustDevotion = (key: keyof PantheonDevotion, delta: number) => {
    if (delta > 0 && remainingPoints <= 0) return;
    const current = profile.devotion[key];
    if (delta < 0 && current <= 0) return;
    if (delta > 0 && current >= 15) return;

    soundFx.playCoin();
    onUpdateProfile((prev) => ({
      ...prev,
      devotion: {
        ...prev.devotion,
        [key]: Math.max(0, Math.min(15, current + delta)),
      },
    }));
  };

  const handleResetDevotion = () => {
    soundFx.playCoin();
    onUpdateProfile((prev) => ({
      ...prev,
      devotion: {
        odinValhalla: 0,
        raSolar: 0,
        hachimanBushido: 0,
        guanYuCelestial: 0,
        thunderbirdSpirit: 0,
      },
    }));
  };

  const handleSelectDoctrine = (docId: BattleDoctrineId) => {
    soundFx.playCoin();
    onUpdateProfile((prev) => ({
      ...prev,
      activeDoctrine: docId,
    }));
  };

  const previewWave = WAVES_DATA[scoutedWaveIdx] || WAVES_DATA[0];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto pb-20 select-none">
      {/* War Room Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white font-serif">Temple of the Ancients</h1>
              <div className="text-[11px] text-slate-400">Pre-Battle Pantheon Devotion & War Doctrines</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-700/50 flex items-center gap-1.5 text-xs">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-bold text-amber-300 tabular-nums">{profile.battlePoints} BP</span>
            </div>
          </div>
        </div>

        {/* Tactical Sub-Tabs */}
        <div className="grid grid-cols-4 gap-1 mt-3 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => { setActiveTab('pantheon'); soundFx.playCoin(); }}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'pantheon'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Pantheon</span>
          </button>
          <button
            onClick={() => { setActiveTab('doctrines'); soundFx.playCoin(); }}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'doctrines'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Doctrines</span>
          </button>
          <button
            onClick={() => { setActiveTab('scout'); soundFx.playCoin(); }}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'scout'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Scouting</span>
          </button>
          <button
            onClick={() => { setActiveTab('roster'); soundFx.playCoin(); }}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'roster'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Warriors</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-4 space-y-4">
        {/* TAB 1: PANTHEON OF ANCIENT GODS */}
        {activeTab === 'pantheon' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div>
                <div className="text-xs font-medium text-slate-400">Available Divine Favor Points</div>
                <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                  {remainingPoints} <span className="text-xs text-slate-500 font-sans">/ {profile.devotionPointsTotal}</span>
                </div>
              </div>
              <button
                onClick={handleResetDevotion}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors border border-slate-700"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed">
              Pledge your devotion to the legendary gods of past civilizations. Gain divine boons, elemental spikes, and unlock Tier 5, 10, and 15 blessings!
            </div>

            <div className="space-y-3">
              {PANTHEON_GODS_INFO.map((god) => {
                const val = profile.devotion[god.key];
                const pct = (val / 15) * 100;
                return (
                  <div
                    key={god.key}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: `${god.color}25`, color: god.color }}
                        >
                          {god.key === 'odinValhalla' && <Shield className="w-4 h-4" />}
                          {god.key === 'raSolar' && <Sun className="w-4 h-4" />}
                          {god.key === 'hachimanBushido' && <Swords className="w-4 h-4" />}
                          {god.key === 'guanYuCelestial' && <Crown className="w-4 h-4" />}
                          {god.key === 'thunderbirdSpirit' && <Zap className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{god.godName}</span>
                            <span className="text-[10px] text-amber-400 font-normal">({god.pantheon})</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{god.domain}</div>
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => handleAdjustDevotion(god.key, -1)}
                          disabled={val <= 0}
                          className="w-6 h-6 rounded bg-slate-850 hover:bg-slate-750 disabled:opacity-30 text-white font-bold text-xs flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-sm text-amber-400 tabular-nums">
                          {val}
                        </span>
                        <button
                          onClick={() => handleAdjustDevotion(god.key, 1)}
                          disabled={val >= 15 || remainingPoints <= 0}
                          className="w-6 h-6 rounded bg-slate-850 hover:bg-slate-750 disabled:opacity-30 text-white font-bold text-xs flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: god.color }}
                      />
                    </div>

                    {/* Threshold Badges */}
                    <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400">
                      <div className={`p-1 rounded text-center border ${val >= 5 ? 'bg-amber-950/40 border-amber-600/40 text-amber-300 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                        Favor Tier 5 {val >= 5 ? '✓' : '(5)'}
                      </div>
                      <div className={`p-1 rounded text-center border ${val >= 10 ? 'bg-amber-950/40 border-amber-600/40 text-amber-300 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                        Favor Tier 10 {val >= 10 ? '✓' : '(10)'}
                      </div>
                      <div className={`p-1 rounded text-center border ${val >= 15 ? 'bg-amber-950/40 border-amber-600/40 text-amber-300 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                        Divine Tier 15 {val >= 15 ? '✓' : '(15)'}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 pt-0.5">
                      <span className="text-amber-400 font-medium">Boon:</span> {god.effectPerPoint}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ANCIENT WAR DOCTRINES */}
        {activeTab === 'doctrines' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 leading-relaxed">
              Adopt an Ancient War Doctrine passed down from historical commanders (Viking shieldwall, Samurai iaijutsu, Chinese dragon stratagems, or Egyptian solar wards).
            </div>

            <div className="space-y-2.5">
              {Object.values(BATTLE_DOCTRINES).map((doc) => {
                const isSelected = profile.activeDoctrine === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => handleSelectDoctrine(doc.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                          {doc.id === 'valhalla_charge' && <Shield className="w-4 h-4" />}
                          {doc.id === 'bushido_focus' && <Zap className="w-4 h-4" />}
                          {doc.id === 'dragon_harmony' && <Crown className="w-4 h-4" />}
                          {doc.id === 'sun_phalanx' && <Flame className="w-4 h-4" />}
                          {doc.id === 'totem_spirits' && <Sparkles className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">{doc.name}</div>
                          <div className="text-[10px] text-amber-400">{doc.origin}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                          Adopted
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mb-2">{doc.description}</div>
                    <div className="text-[11px] font-medium text-amber-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                      Combat Effect: {doc.effectDescription}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: NETHERWORLD SCOUTING */}
        {activeTab === 'scout' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Underworld Horde Intel</h3>
                <div className="text-[11px] text-slate-400">Scout ancient fiends, resistances and wave composition</div>
              </div>
              <button
                onClick={onOpenCodex}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <span>Bestiary</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Wave selector slider */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {WAVES_DATA.map((wave, idx) => (
                <button
                  key={wave.waveNumber}
                  onClick={() => setScoutedWaveIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                    scoutedWaveIdx === idx
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : wave.isBossWave
                      ? 'bg-red-950/40 text-red-300 border-red-800/60'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Wave {wave.waveNumber} {wave.isBossWave ? '★' : ''}
                </button>
              ))}
            </div>

            {/* Wave details card */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">Wave {previewWave.waveNumber}/10</span>
                    {previewWave.isBossWave && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                        MYTHIC BOSS
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5">{previewWave.title}</h4>
                  <p className="text-xs text-slate-400">{previewWave.subTitle}</p>
                </div>
                <div className="text-right text-xs">
                  <div className="text-slate-500 text-[10px]">Tribute Rewards</div>
                  <div className="font-mono text-amber-300 font-bold">+{previewWave.silverReward} Tribute</div>
                  <div className="font-mono text-cyan-300 text-[11px]">+{previewWave.bpReward} BP</div>
                </div>
              </div>

              {/* Enemies in wave */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Netherworld Fiends:
                </div>
                <div className="space-y-2">
                  {previewWave.enemies.map((item) => {
                    const enemyDef = ENEMIES_DATA[item.enemyId];
                    if (!enemyDef) return null;
                    return (
                      <div
                        key={item.enemyId}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-amber-400 font-mono">
                              {item.count}x
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-0.5">
                              <PixelSprite id={enemyDef.id} size={28} isBoss={enemyDef.isBoss} />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{enemyDef.name}</span>
                              <span className="text-[10px] text-amber-400">({enemyDef.mythos})</span>
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">
                              {enemyDef.patternDescription}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pl-2">
                          <div className="text-[10px] text-emerald-400 font-medium">
                            Weak: <span className="uppercase font-bold">{enemyDef.elementWeakness}</span>
                          </div>
                          <div className="text-[10px] text-red-400 font-medium">
                            Resist: <span className="uppercase font-bold">{enemyDef.elementResistance}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tactical Hint */}
              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Tactical Counter:</strong> Align your cultural heroes (Viking Frost vs Fire Serpents; Egyptian Holy vs Norse Undead). Exploit elemental weaknesses for 45% bonus damage!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CULTURAL HERO ROSTER */}
        {activeTab === 'roster' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Your Historical Vanguard</h3>
                <div className="text-[11px] text-slate-400">Upgrade mastery trees & forge ancient relics in the Hall of Heroes</div>
              </div>
              <button
                onClick={() => onOpenBarracks()}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <span>Hall of Heroes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {Object.values(HEROES_DATA).map((hero) => {
                const prog = profile.heroes[hero.id];
                const level = prog?.level || 1;
                return (
                  <button
                    key={hero.id}
                    onClick={() => onOpenBarracks(hero.id)}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                          {hero.culture}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                          Lv.{level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center p-0.5 shrink-0">
                          <PixelSprite id={hero.id} size={36} />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white leading-tight">{hero.name}</div>
                          <div className="text-[10px] text-slate-400">{hero.role}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Demigod Form:</span>
                      <span className="text-amber-300 font-bold truncate max-w-[80px]">Rank VI</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Deployment Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 z-30 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>Doctrine:</span>
              <span className="font-bold text-amber-400 truncate">
                {BATTLE_DOCTRINES[profile.activeDoctrine].name}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Devotion: {totalAllocated}/{profile.devotionPointsTotal} favor active
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playSummon();
              onStartRun();
            }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all font-serif"
          >
            <span>Deploy Vanguard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

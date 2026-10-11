import React, { useState, useEffect } from 'react';
import { GameScreen, HeroId, PlayerProfile } from './types/game';
import { loadPlayerProfile, savePlayerProfile } from './utils/storage';
import { MobileFrame } from './components/MobileFrame';
import { PrepWarRoom } from './components/PrepWarRoom';
import { BattleScreen } from './components/BattleScreen';
import { Barracks } from './components/Barracks';
import { Codex } from './components/Codex';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(loadPlayerProfile);
  const [currentScreen, setCurrentScreen] = useState<'war_room' | 'battle' | 'barracks' | 'codex'>('war_room');
  const [barracksInitialHero, setBarracksInitialHero] = useState<HeroId>('ragnar');

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    savePlayerProfile(profile);
  }, [profile]);

  const handleUpdateProfile = (updater: (prev: PlayerProfile) => PlayerProfile) => {
    setProfile(updater);
  };

  const handleOpenBarracks = (heroId: HeroId = 'ragnar') => {
    setBarracksInitialHero(heroId);
    setCurrentScreen('barracks');
  };

  return (
    <MobileFrame>
      {currentScreen === 'war_room' && (
        <PrepWarRoom
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onStartRun={() => setCurrentScreen('battle')}
          onOpenBarracks={handleOpenBarracks}
          onOpenCodex={() => setCurrentScreen('codex')}
        />
      )}

      {currentScreen === 'battle' && (
        <BattleScreen
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onReturnToWarRoom={() => setCurrentScreen('war_room')}
        />
      )}

      {currentScreen === 'barracks' && (
        <Barracks
          profile={profile}
          initialHeroId={barracksInitialHero}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setCurrentScreen('war_room')}
        />
      )}

      {currentScreen === 'codex' && (
        <Codex
          onClose={() => setCurrentScreen('war_room')}
        />
      )}
    </MobileFrame>
  );
}

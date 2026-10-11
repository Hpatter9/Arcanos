import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isPhoneMode, setIsPhoneMode] = useState(true);
  const [currentTime, setCurrentTime] = useState('12:00');
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 select-none overflow-x-hidden">
      {/* Top Floating Utility Bar (View Mode Toggle & Audio) */}
      <div className="w-full max-w-md flex items-center justify-between px-4 py-2 text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-1 font-serif font-bold text-amber-400">
          <span>PANTHEON OF LEGENDS</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={handleToggleSound}
            title="Toggle Sound FX"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Phone Frame Toggle */}
          <button
            onClick={() => setIsPhoneMode(!isPhoneMode)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors"
          >
            {isPhoneMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneMode
            ? 'max-w-[430px] h-[100dvh] sm:h-[890px] sm:max-h-[92vh] sm:rounded-[42px] sm:border-[8px] sm:border-slate-800 sm:shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col bg-slate-950 ring-1 ring-slate-700/50'
            : 'max-w-2xl min-h-[92vh] rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col bg-slate-950 shadow-2xl'
        }`}
      >
        {/* Smartphone Status Bar (Only in phone mode) */}
        {isPhoneMode && (
          <div className="w-full h-8 px-6 pt-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 shrink-0 z-40 bg-slate-950/80 backdrop-blur-md">
            <span>{currentTime}</span>
            {/* Dynamic Island / Notch */}
            <div className="w-20 h-4 bg-black rounded-full mx-auto -mt-1 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* The Game Views Body */}
        <div className="flex-1 w-full overflow-hidden relative flex flex-col">
          {children}
        </div>

        {/* Home Indicator Bar */}
        {isPhoneMode && (
          <div className="w-full h-4 shrink-0 flex items-center justify-center bg-slate-950 pointer-events-none">
            <div className="w-28 h-1 bg-slate-700 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

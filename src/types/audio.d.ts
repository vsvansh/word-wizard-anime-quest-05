
declare type SoundType = 'click' | 'typing' | 'correct' | 'win' | 'wrong' | 'hint' | 'spell';

interface AudioManager {
  playSound: (type: SoundType) => void;
  setVolume: (volume: number) => void;
  toggleSoundEffects: () => void;
  toggleBackgroundMusic: () => void;
  setMusicVolume: (volume: number) => void;
  setSFXVolume: (volume: number) => void;
  getSFXVolume: () => number;
  getMusicVolume: () => number;
  areSoundEffectsEnabled: () => boolean;
  isMusicPlaying: () => boolean;
}

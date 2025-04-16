
declare type SoundType = 'typing' | 'click' | 'correct' | 'win' | 'wrong' | 'hint' | 'spell';

interface AudioManager {
  playSound: (type: SoundType) => void;
  setVolume: (volume: number) => void;
  toggleSoundEffects: () => boolean;
  toggleBackgroundMusic: () => boolean;
  setMusicVolume: (volume: number) => void;
  setSFXVolume: (volume: number) => void;
  getSFXVolume: () => number;
  getMusicVolume: () => number;
  areSoundEffectsEnabled: () => boolean;
  isMusicPlaying: () => boolean;
}

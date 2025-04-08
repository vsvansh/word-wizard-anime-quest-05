
class AudioManager {
  private static instance: AudioManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private musicPlaying: boolean = false;
  private soundEffectsEnabled: boolean = true;
  private musicVolume: number = 0.3;
  private sfxVolume: number = 0.5;
  private backgroundMusic: HTMLAudioElement | null = null;

  private constructor() {
    // Initialize sounds
    this.loadSound('correct', 'https://assets.mixkit.co/sfx/preview/mixkit-game-bonus-achieved-2044.mp3');
    this.loadSound('wrong', 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
    this.loadSound('hint', 'https://assets.mixkit.co/sfx/preview/mixkit-fairy-magic-sparkle-875.mp3');
    this.loadSound('win', 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    this.loadSound('click', 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
    this.loadSound('spell', 'https://assets.mixkit.co/sfx/preview/mixkit-magical-spell-sketch-2596.mp3');
    this.loadSound('levelup', 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3');
    this.loadSound('achievement', 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
    this.loadSound('typing', 'https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1386.mp3');
    this.loadSound('match', 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-bonus-229.mp3');
    
    // Set background music
    this.backgroundMusic = new Audio('https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-668.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.musicVolume;

    // Try to restore settings from localStorage
    this.restoreSettings();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private restoreSettings(): void {
    try {
      const soundSettings = localStorage.getItem('soundSettings');
      if (soundSettings) {
        const settings = JSON.parse(soundSettings);
        this.soundEffectsEnabled = settings.soundEffectsEnabled !== undefined ? settings.soundEffectsEnabled : true;
        this.musicPlaying = settings.musicPlaying !== undefined ? settings.musicPlaying : false;
        this.musicVolume = settings.musicVolume !== undefined ? settings.musicVolume : 0.3;
        this.sfxVolume = settings.sfxVolume !== undefined ? settings.sfxVolume : 0.5;
        
        if (this.backgroundMusic) {
          this.backgroundMusic.volume = this.musicVolume;
        }
        
        // If music should be playing but isn't, start it
        if (this.musicPlaying && this.backgroundMusic) {
          this.backgroundMusic.play().catch(() => {
            // User interaction needed for autoplay
            this.musicPlaying = false;
          });
        }
      }
    } catch (e) {
      console.error('Error restoring sound settings', e);
    }
  }

  private saveSettings(): void {
    try {
      const settings = {
        soundEffectsEnabled: this.soundEffectsEnabled,
        musicPlaying: this.musicPlaying,
        musicVolume: this.musicVolume,
        sfxVolume: this.sfxVolume
      };
      localStorage.setItem('soundSettings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving sound settings', e);
    }
  }

  private loadSound(id: string, url: string): void {
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.sounds.set(id, audio);
  }

  public playSound(id: string): void {
    if (!this.soundEffectsEnabled) return;
    
    const sound = this.sounds.get(id);
    if (sound) {
      sound.volume = this.sfxVolume;
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Audio play prevented by browser policy', e));
    }
  }

  public startBackgroundMusic(): void {
    if (!this.backgroundMusic || this.musicPlaying) return;
    
    this.backgroundMusic.play()
      .then(() => {
        this.musicPlaying = true;
        this.saveSettings();
      })
      .catch(e => {
        console.log('Background music play prevented by browser policy', e);
        this.musicPlaying = false;
      });
  }

  public stopBackgroundMusic(): void {
    if (!this.backgroundMusic || !this.musicPlaying) return;
    
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    this.musicPlaying = false;
    this.saveSettings();
  }

  public toggleBackgroundMusic(): boolean {
    if (this.musicPlaying) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
    return this.musicPlaying;
  }

  public toggleSoundEffects(): boolean {
    this.soundEffectsEnabled = !this.soundEffectsEnabled;
    this.saveSettings();
    return this.soundEffectsEnabled;
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume;
    }
    this.saveSettings();
  }

  public setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public getSFXVolume(): number {
    return this.sfxVolume;
  }

  public isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  public areSoundEffectsEnabled(): boolean {
    return this.soundEffectsEnabled;
  }
  
  // Play sound by category
  public playSoundByCategory(category: 'success' | 'error' | 'interaction'): void {
    if (!this.soundEffectsEnabled) return;
    
    switch (category) {
      case 'success':
        this.playSound('correct');
        break;
      case 'error':
        this.playSound('wrong');
        break;
      case 'interaction':
        this.playSound('click');
        break;
    }
  }
  
  // Check if audio is supported in the current browser
  public isAudioSupported(): boolean {
    return typeof Audio !== 'undefined';
  }
}

export default AudioManager.getInstance();

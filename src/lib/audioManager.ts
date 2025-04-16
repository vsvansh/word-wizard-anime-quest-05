
// Improved audio manager for game sounds with preloading

type SoundType = 'typing' | 'click' | 'correct' | 'win' | 'wrong' | 'hint' | 'spell';

// Create a class to manage game audio
class AudioManager {
  private sounds: Record<SoundType, HTMLAudioElement>;
  private soundsEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private sfxVolume: number = 0.5;
  private musicVolume: number = 0.3;
  private backgroundMusic: HTMLAudioElement | null = null;

  constructor() {
    // Initialize sound objects with improved sound effects
    this.sounds = {
      typing: new Audio('/sounds/typing.mp3'),
      click: new Audio('/sounds/click.mp3'),
      correct: new Audio('/sounds/correct.mp3'),
      win: new Audio('/sounds/win.mp3'),
      wrong: new Audio('/sounds/wrong.mp3'),
      hint: new Audio('/sounds/hint.mp3'),
      spell: new Audio('/sounds/spell.mp3')
    };

    // Set volume for each sound
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.sfxVolume;
    });

    // Create background music audio element
    this.backgroundMusic = new Audio('/sounds/background.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.musicVolume;

    // Check if user has previously muted sounds
    const savedSoundsState = localStorage.getItem('soundsEnabled');
    if (savedSoundsState === 'false') {
      this.soundsEnabled = false;
    }

    const savedMusicState = localStorage.getItem('musicEnabled');
    if (savedMusicState === 'true') {
      this.musicEnabled = true;
      this.playBackgroundMusic();
    }
    
    // Preload sounds
    this.preloadSounds();
  }

  // Preload sounds to avoid delay on first play
  private preloadSounds(): void {
    Object.values(this.sounds).forEach(sound => {
      sound.preload = 'auto';
      sound.load();
    });
    
    if (this.backgroundMusic) {
      this.backgroundMusic.preload = 'auto';
      this.backgroundMusic.load();
    }
  }

  // Play background music
  private playBackgroundMusic(): void {
    if (this.backgroundMusic && this.musicEnabled) {
      this.backgroundMusic.play().catch(error => {
        console.error("Error playing background music:", error);
      });
    }
  }

  // Stop background music
  private stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  // Play a sound if not muted
  public playSound(type: SoundType): void {
    if (!this.soundsEnabled) return;
    
    try {
      const sound = this.sounds[type];
      
      // Reset sound to start before playing
      sound.currentTime = 0;
      
      // Play the sound with error handling
      const playPromise = sound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error(`Error playing ${type} sound:`, error);
        });
      }
    } catch (error) {
      console.error(`Error playing ${type} sound:`, error);
    }
  }

  // Toggle sound effects
  public toggleSoundEffects(): boolean {
    this.soundsEnabled = !this.soundsEnabled;
    localStorage.setItem('soundsEnabled', this.soundsEnabled.toString());
    return this.soundsEnabled;
  }

  // Toggle background music
  public toggleBackgroundMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    localStorage.setItem('musicEnabled', this.musicEnabled.toString());
    
    if (this.musicEnabled) {
      this.playBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
    
    return this.musicEnabled;
  }

  // Check if sound effects are enabled
  public areSoundEffectsEnabled(): boolean {
    return this.soundsEnabled;
  }

  // Check if music is playing
  public isMusicPlaying(): boolean {
    return this.musicEnabled;
  }

  // Set volume for all sound effects
  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.sfxVolume = clampedVolume;
    
    Object.values(this.sounds).forEach(sound => {
      sound.volume = clampedVolume;
    });
  }

  // Set volume specifically for sound effects
  public setSFXVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.sfxVolume = clampedVolume;
    
    Object.values(this.sounds).forEach(sound => {
      sound.volume = clampedVolume;
    });
    
    localStorage.setItem('sfxVolume', clampedVolume.toString());
  }

  // Set volume specifically for music
  public setMusicVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.musicVolume = clampedVolume;
    
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = clampedVolume;
    }
    
    localStorage.setItem('musicVolume', clampedVolume.toString());
  }

  // Get the current SFX volume
  public getSFXVolume(): number {
    return this.sfxVolume;
  }

  // Get the current music volume
  public getMusicVolume(): number {
    return this.musicVolume;
  }
}

// Create and export a singleton instance
const audioManager = new AudioManager();
export default audioManager;


// Improved audio manager for game sounds with preloading

type SoundType = 'typing' | 'click' | 'correct' | 'win' | 'wrong';

// Create a class to manage game audio
class AudioManager {
  private sounds: Record<SoundType, HTMLAudioElement>;
  private muted: boolean = false;

  constructor() {
    // Initialize sound objects with improved sound effects
    this.sounds = {
      typing: new Audio('/sounds/typing.mp3'),
      click: new Audio('/sounds/click.mp3'),
      correct: new Audio('/sounds/correct.mp3'),
      win: new Audio('/sounds/win.mp3'),
      wrong: new Audio('/sounds/wrong.mp3')
    };

    // Set volume for each sound
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.5;
    });

    // Check if user has previously muted sounds
    const savedMuteState = localStorage.getItem('soundsMuted');
    if (savedMuteState === 'true') {
      this.muted = true;
    }
    
    // Preload sounds
    this.preloadSounds();
  }

  // Preload sounds to avoid delay on first play
  private preloadSounds(): void {
    Object.values(this.sounds).forEach(sound => {
      sound.load();
    });
  }

  // Play a sound if not muted
  public playSound(type: SoundType): void {
    if (this.muted) return;
    
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

  // Mute/unmute all sounds
  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('soundsMuted', this.muted.toString());
    return this.muted;
  }

  // Get mute state
  public isMuted(): boolean {
    return this.muted;
  }

  // Set volume for all sounds (0.0 to 1.0)
  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    Object.values(this.sounds).forEach(sound => {
      sound.volume = clampedVolume;
    });
  }
}

// Create and export a singleton instance
const audioManager = new AudioManager();
export default audioManager;


import React from 'react';
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import audioManager from '@/lib/audioManager';
import { motion } from 'framer-motion';

interface SoundControlsProps {
  compact?: boolean;
  className?: string;
}

const SoundControls: React.FC<SoundControlsProps> = ({ compact = false, className = '' }) => {
  const [sfxEnabled, setSfxEnabled] = React.useState(() => audioManager.areSoundEffectsEnabled());
  const [musicEnabled, setMusicEnabled] = React.useState(() => audioManager.isMusicPlaying());
  const [sfxVolume, setSfxVolume] = React.useState(() => audioManager.getSFXVolume() * 100);
  const [musicVolume, setMusicVolume] = React.useState(() => audioManager.getMusicVolume() * 100);

  const handleSfxToggle = () => {
    const newState = audioManager.toggleSoundEffects();
    setSfxEnabled(newState);
    audioManager.playSound('click');
  };

  const handleMusicToggle = () => {
    const newState = audioManager.toggleBackgroundMusic();
    setMusicEnabled(newState);
    
    if (newState) {
      audioManager.playSound('click');
    }
  };

  const handleSfxVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setSfxVolume(value[0]);
    audioManager.setSFXVolume(newVolume);
    
    if (sfxEnabled && value[0] > 0) {
      audioManager.playSound('click');
    }
  };

  const handleMusicVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setMusicVolume(value[0]);
    audioManager.setMusicVolume(newVolume);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSfxToggle}
          className="w-8 h-8 rounded-full"
          title={sfxEnabled ? "Mute Sound Effects" : "Unmute Sound Effects"}
        >
          {sfxEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMusicToggle}
          className="w-8 h-8 rounded-full"
          title={musicEnabled ? "Mute Music" : "Unmute Music"}
        >
          {musicEnabled ? <Music2 className="h-4 w-4" /> : <Music className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className={`rounded-lg p-4 space-y-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSfxToggle}
              className={`rounded-full ${sfxEnabled ? 'text-wizard-purple' : 'text-gray-400'}`}
            >
              {sfxEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
              Sound Effects
            </Button>
          </div>
          <span className="text-xs text-gray-500">{Math.round(sfxVolume)}%</span>
        </div>
        <Slider
          defaultValue={[sfxVolume]}
          max={100}
          step={1}
          onValueChange={handleSfxVolumeChange}
          disabled={!sfxEnabled}
          className={sfxEnabled ? '' : 'opacity-50'}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMusicToggle}
              className={`rounded-full ${musicEnabled ? 'text-wizard-blue' : 'text-gray-400'}`}
            >
              {musicEnabled ? <Music2 className="h-4 w-4 mr-2" /> : <Music className="h-4 w-4 mr-2" />}
              Background Music
            </Button>
          </div>
          <span className="text-xs text-gray-500">{Math.round(musicVolume)}%</span>
        </div>
        <Slider
          defaultValue={[musicVolume]}
          max={100}
          step={1}
          onValueChange={handleMusicVolumeChange}
          disabled={!musicEnabled}
          className={musicEnabled ? '' : 'opacity-50'}
        />
      </div>
    </motion.div>
  );
};

export default SoundControls;

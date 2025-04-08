
import React from 'react';

interface AnimeCharacterProps {
  mood?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'confused';
  className?: string;
}

const AnimeCharacter: React.FC<AnimeCharacterProps> = ({ mood = 'neutral', className = '' }) => {
  const renderCharacter = () => {
    const characterStyle = "relative z-10";
    const auraStyle = "absolute inset-0 rounded-full bg-wizard-purple/10 dark:bg-wizard-purple/20 blur-xl z-0 animate-pulse-glow";
    
    switch (mood) {
      case 'happy':
        return (
          <div className="relative">
            <div className={auraStyle} style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.2) 0%, rgba(74,222,128,0) 70%)' }}></div>
            <div className={`text-7xl animate-bounce-light ${characterStyle}`}>
              (⌒‿⌒)
            </div>
          </div>
        );
      case 'thinking':
        return (
          <div className="relative">
            <div className={auraStyle} style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.2) 0%, rgba(250,204,21,0) 70%)' }}></div>
            <div className={`text-7xl animate-float ${characterStyle}`}>
              (・_・ヾ
            </div>
          </div>
        );
      case 'excited':
        return (
          <div className="relative">
            <div className={auraStyle} style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0) 70%)' }}></div>
            <div className={`text-7xl animate-wiggle ${characterStyle}`}>
              (≧◡≦)
            </div>
          </div>
        );
      case 'confused':
        return (
          <div className="relative">
            <div className={auraStyle} style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.2) 0%, rgba(244,114,182,0) 70%)' }}></div>
            <div className={`text-7xl animate-float ${characterStyle}`}>
              (・・?
            </div>
          </div>
        );
      default:
        return (
          <div className="relative">
            <div className={auraStyle}></div>
            <div className={`text-7xl animate-float ${characterStyle}`}>
              (｡◕‿◕｡)
            </div>
          </div>
        );
    }
  };

  // Color based on mood
  const getMoodColor = () => {
    switch (mood) {
      case 'happy':
        return 'text-wizard-green';
      case 'thinking':
        return 'text-wizard-yellow';
      case 'excited':
        return 'text-wizard-purple';
      case 'confused':
        return 'text-wizard-pink';
      default:
        return 'text-wizard-blue';
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${getMoodColor()} font-bold relative`}>
        {renderCharacter()}
        
        {/* Decorative elements based on mood */}
        {mood === 'excited' && (
          <div className="absolute -top-4 -right-4 text-2xl animate-bounce-light">✨</div>
        )}
        {mood === 'happy' && (
          <div className="absolute -top-4 -left-4 text-2xl animate-float">🌟</div>
        )}
        {mood === 'confused' && (
          <div className="absolute -top-4 -right-4 text-2xl animate-spin-slow">❓</div>
        )}
      </div>
    </div>
  );
};

export default AnimeCharacter;

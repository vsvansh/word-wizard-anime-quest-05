
import React from 'react';

interface AnimeCharacterProps {
  mood?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'confused';
  className?: string;
}

const AnimeCharacter: React.FC<AnimeCharacterProps> = ({ mood = 'neutral', className = '' }) => {
  const renderCharacter = () => {
    // This is a simple ASCII-style character for now
    // In a real app, you'd use actual anime character images
    switch (mood) {
      case 'happy':
        return (
          <div className="text-7xl animate-bounce-light">
            (⌒‿⌒)
          </div>
        );
      case 'thinking':
        return (
          <div className="text-7xl animate-float">
            (・_・ヾ
          </div>
        );
      case 'excited':
        return (
          <div className="text-7xl animate-wiggle">
            (≧◡≦)
          </div>
        );
      case 'confused':
        return (
          <div className="text-7xl animate-float">
            (・・?
          </div>
        );
      default:
        return (
          <div className="text-7xl animate-float">
            (｡◕‿◕｡)
          </div>
        );
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-wizard-purple font-bold">
        {renderCharacter()}
      </div>
    </div>
  );
};

export default AnimeCharacter;

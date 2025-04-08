
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  velocity: {
    x: number;
    y: number;
    rotation: number;
  };
}

interface ConfettiExplosionProps {
  show: boolean;
  onComplete?: () => void;
  pieces?: number;
  duration?: number;
  colors?: string[];
  origin?: 'center' | 'bottom' | 'top' | 'left' | 'right';
  intensity?: 'low' | 'medium' | 'high';
}

const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({
  show,
  onComplete,
  pieces = 50,
  duration = 2500,
  colors = ['#9b87f5', '#6E59A5', '#F2FCE2', '#FEF7CD', '#FEC6A1', '#E5DEFF', '#FFDEE2', '#FDE1D3', '#D3E4FD', '#8B5CF6', '#D946EF', '#F97316', '#33C3F0'],
  origin = 'center',
  intensity = 'medium',
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    if (show) {
      generateConfetti();
      
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  const generateConfetti = () => {
    const newConfetti: ConfettiPiece[] = [];
    const intensityMultiplier = intensity === 'low' ? 0.6 : intensity === 'high' ? 1.4 : 1;
    
    let originPoint = { x: 50, y: 50 }; // center default
    
    switch (origin) {
      case 'bottom':
        originPoint = { x: 50, y: 100 };
        break;
      case 'top':
        originPoint = { x: 50, y: 0 };
        break;
      case 'left':
        originPoint = { x: 0, y: 50 };
        break;
      case 'right':
        originPoint = { x: 100, y: 50 };
        break;
      default:
        break;
    }
    
    for (let i = 0; i < pieces; i++) {
      // Random angle in radians
      const angle = Math.random() * Math.PI * 2;
      
      // Random distance from center
      const velocity = {
        x: (Math.cos(angle) * (10 + Math.random() * 20)) * intensityMultiplier,
        y: (Math.sin(angle) * (10 + Math.random() * 20) - 10) * intensityMultiplier, // Slightly upward bias
        rotation: (Math.random() - 0.5) * 15 * intensityMultiplier,
      };
      
      newConfetti.push({
        id: i,
        x: originPoint.x,
        y: originPoint.y,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
        velocity,
      });
    }
    
    setConfetti(newConfetti);
  };
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((piece) => {
        const shapes = [
          // Square
          <rect width="10" height="10" fill={piece.color} />,
          // Circle 
          <circle r="5" fill={piece.color} />,
          // Triangle
          <polygon points="0,10 5,0 10,10" fill={piece.color} />,
          // Star shape
          <path d="M5,0L6.5,3.5L10,4L7.5,6.5L8,10L5,8.5L2,10L2.5,6.5L0,4L3.5,3.5Z" fill={piece.color} />
        ];
        
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        return (
          <motion.div
            key={piece.id}
            className="absolute"
            initial={{
              x: `${piece.x}%`,
              y: `${piece.y}%`,
              scale: 0,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              x: `calc(${piece.x}% + ${piece.velocity.x * 5}vmin)`,
              y: `calc(${piece.y}% + ${piece.velocity.y * 5}vmin)`,
              scale: piece.scale,
              rotate: piece.rotation + piece.velocity.rotation * 20,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: duration / 1000,
              ease: "easeOut",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 10 10" style={{ filter: `drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1))` }}>
              {shape}
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ConfettiExplosion;

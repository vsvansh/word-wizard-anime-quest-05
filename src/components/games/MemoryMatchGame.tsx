
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Clock, Trophy, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AnimeCharacter from '@/components/AnimeCharacter';
import audioManager from '@/lib/audioManager';

// Anime-themed word pairs
const animeWords = [
  { id: 1, text: 'NINJA' },
  { id: 2, text: 'MECHA' },
  { id: 3, text: 'MANGA' },
  { id: 4, text: 'ANIME' },
  { id: 5, text: 'BENTO' },
  { id: 6, text: 'KAIJU' },
  { id: 7, text: 'OTAKU' },
  { id: 8, text: 'CHIBI' }
];

// Create pairs for the memory game
const createGameCards = () => {
  // Duplicate each word to create pairs
  const pairs = [...animeWords, ...animeWords].map((card, index) => ({
    ...card,
    matchId: card.id,
    uniqueId: `${card.id}-${index}`,
    flipped: false,
    matched: false
  }));
  
  // Shuffle the array
  return pairs.sort(() => Math.random() - 0.5);
};

interface MemoryMatchGameProps {
  onComplete?: (score: number) => void;
  difficulty?: 'easy' | 'normal' | 'hard';
}

interface Card {
  id: number;
  text: string;
  matchId: number;
  uniqueId: string;
  flipped: boolean;
  matched: boolean;
}

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  onComplete,
  difficulty = 'normal'
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [characterMood, setCharacterMood] = useState<'neutral' | 'happy' | 'thinking' | 'excited' | 'confused'>('neutral');
  const { toast } = useToast();
  
  // Initialize game
  const startGame = useCallback(() => {
    const initialCards = createGameCards();
    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameActive(true);
    setTimeElapsed(0);
    setScore(0);
    setCharacterMood('excited');
    audioManager.playSound('correct');
  }, []);

  // Timer for game
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameActive]);

  // Check for game completion
  useEffect(() => {
    if (gameActive && matchedPairs === animeWords.length) {
      setGameActive(false);
      
      // Calculate score based on moves and time
      const baseScore = 1000;
      const movesPenalty = moves * 5;
      const timePenalty = timeElapsed * 2;
      const finalScore = Math.max(baseScore - movesPenalty - timePenalty, 100);
      
      setScore(finalScore);
      setCharacterMood('happy');
      
      toast({
        title: "Memory Challenge Complete!",
        description: `Score: ${finalScore}. You matched all pairs in ${moves} moves and ${formatTime(timeElapsed)}.`,
      });
      
      audioManager.playSound('win');
      
      if (onComplete) {
        onComplete(finalScore);
      }
    }
  }, [matchedPairs, animeWords.length, gameActive, moves, timeElapsed, onComplete]);

  // Handle card click
  const handleCardClick = (uniqueId: string) => {
    // Ignore clicks if game is not active or already matched/flipped cards
    if (!gameActive) return;
    
    const clickedCard = cards.find(card => card.uniqueId === uniqueId);
    if (!clickedCard || clickedCard.matched || flippedCards.includes(uniqueId)) {
      return;
    }
    
    audioManager.playSound('click');
    
    // Flip only two cards at a time
    const newFlippedCards = [...flippedCards, uniqueId];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      // Increment moves
      setMoves(prev => prev + 1);
      
      // Get the two flipped cards
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(card => card.uniqueId === firstCardId);
      const secondCard = cards.find(card => card.uniqueId === secondCardId);
      
      // Check if they match
      if (firstCard && secondCard && firstCard.matchId === secondCard.matchId) {
        // Cards match
        setCharacterMood('excited');
        audioManager.playSound('correct');
        
        setCards(prevCards => 
          prevCards.map(card => 
            card.uniqueId === firstCardId || card.uniqueId === secondCardId
              ? { ...card, matched: true }
              : card
          )
        );
        
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
        
        setTimeout(() => {
          setCharacterMood('neutral');
        }, 1000);
      } else {
        // Cards don't match
        setCharacterMood('confused');
        
        // Unflip cards after delay
        setTimeout(() => {
          setFlippedCards([]);
          setCharacterMood('neutral');
        }, 1000);
      }
    }
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get appropriate grid columns based on difficulty
  const getGridColumns = () => {
    switch (difficulty) {
      case 'easy': return 'grid-cols-3';
      case 'hard': return 'grid-cols-5';
      default: return 'grid-cols-4';
    }
  };

  return (
    <Card className="anime-card p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-manga bg-gradient-to-r from-wizard-pink to-wizard-yellow text-transparent bg-clip-text mb-2">
          Memory Match Challenge
        </h3>
        <p className="text-foreground/70">
          Find all the matching anime word pairs!
        </p>
      </div>
      
      <AnimeCharacter mood={characterMood} className="mb-4" />
      
      {!gameActive && matchedPairs === 0 ? (
        <div className="text-center space-y-6">
          <div className="bg-wizard-pink/10 dark:bg-wizard-pink/20 p-4 rounded-lg">
            <h4 className="font-bold mb-2">How to Play:</h4>
            <p className="text-sm text-foreground/80">
              Flip cards to find matching pairs of anime words. Match all cards with the fewest moves to get the highest score!
            </p>
          </div>
          
          <Button
            onClick={startGame}
            className="w-full bg-wizard-pink hover:bg-wizard-pink/90 btn-anime py-6 text-white"
          >
            <Brain className="mr-2 h-5 w-5" />
            Start Memory Challenge
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between mb-4">
            <div className="bg-wizard-yellow/10 dark:bg-wizard-yellow/20 px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-wizard-yellow font-bold">MOVES</p>
              <p className="text-xl font-bold">{moves}</p>
            </div>
            
            <div className="bg-wizard-pink/10 dark:bg-wizard-pink/20 px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-wizard-pink font-bold">MATCHED</p>
              <p className="text-xl font-bold">{matchedPairs}/{animeWords.length}</p>
            </div>
            
            <div className="bg-wizard-blue/10 dark:bg-wizard-blue/20 px-4 py-2 rounded-lg text-center flex items-center gap-2">
              <Clock className="h-4 w-4 text-wizard-blue" />
              <p className="text-xl font-bold">{formatTime(timeElapsed)}</p>
            </div>
          </div>
          
          <div className={`grid ${getGridColumns()} gap-2`}>
            <AnimatePresence>
              {cards.map((card) => (
                <motion.div
                  key={card.uniqueId}
                  className={`aspect-square cursor-pointer ${
                    card.matched ? 'pointer-events-none' : ''
                  }`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleCardClick(card.uniqueId)}
                >
                  <div
                    className={`w-full h-full rounded-lg flex items-center justify-center font-manga text-sm md:text-base transition-all duration-300 transform ${
                      card.matched || flippedCards.includes(card.uniqueId)
                        ? 'bg-wizard-pink text-white rotate-y-180'
                        : 'bg-wizard-blue/20 hover:bg-wizard-blue/30'
                    } ${
                      card.matched ? 'opacity-70' : 'opacity-100'
                    }`}
                  >
                    {card.matched || flippedCards.includes(card.uniqueId) ? (
                      <span>{card.text}</span>
                    ) : (
                      <span className="text-lg">?</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {!gameActive && matchedPairs === animeWords.length && (
            <div className="text-center my-6 space-y-4">
              <div className="bg-wizard-purple/10 p-4 rounded-lg">
                <Trophy className="h-8 w-8 mx-auto text-wizard-yellow mb-2" />
                <h4 className="font-bold text-xl mb-1">Challenge Complete!</h4>
                <p className="text-foreground/80">Final Score: {score}</p>
                <p className="text-sm text-foreground/60">
                  Completed in {moves} moves and {formatTime(timeElapsed)}
                </p>
              </div>
              
              <Button
                onClick={startGame}
                className="w-full bg-wizard-purple hover:bg-wizard-purple/90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Play Again
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default MemoryMatchGame;

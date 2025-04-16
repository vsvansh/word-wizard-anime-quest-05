
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Key } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import AnimeCharacter from './AnimeCharacter';
import DefinitionDisplay from './DefinitionDisplay';
import Keyboard from './Keyboard';
import { evaluateGuess } from '@/lib/gameLogic';
import ConfettiExplosion from './ConfettiExplosion';
import audioManager from '@/lib/audioManager';
import SoundControls from './SoundControls';

interface WordPuzzleProps {
  word?: string;
  onComplete?: (success: boolean) => void;
  initialGuesses?: number;
  showHint?: boolean;
}

interface EvaluationCell {
  letter: string;
  status: 'correct' | 'wrong-position' | 'incorrect';
}

const WordPuzzle: React.FC<WordPuzzleProps> = ({ word = 'ANIME', onComplete, initialGuesses = 6, showHint = true }) => {
  const [currentGuess, setCurrentGuess] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationCell[][]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showDefinition, setShowDefinition] = useState(false);
  const [guessedCorrectly, setGuessedCorrectly] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSoundControls, setShowSoundControls] = useState(false);
  const currentRow = useRef(0);
  const { toast } = useToast();

  useEffect(() => {
    resetGame();
  }, [word, initialGuesses]);

  const resetGame = useCallback(() => {
    setCurrentGuess(0);
    setGuesses(Array(initialGuesses).fill(''));
    setEvaluations(Array(initialGuesses).fill(Array(word.length).fill({ letter: '', status: 'incorrect' })));
    setGameStatus('playing');
    setShowDefinition(false);
    setGuessedCorrectly(false);
    setShowConfetti(false);
    currentRow.current = 0;
  }, [word, initialGuesses]);

  const handleLetterInput = (key: string) => {
    if (gameStatus !== 'playing') return;

    setGuesses(prevGuesses => {
      const newGuesses = [...prevGuesses];
      newGuesses[currentRow.current] = newGuesses[currentRow.current].length < word.length
        ? newGuesses[currentRow.current] + key
        : newGuesses[currentRow.current];
      return newGuesses;
    });
    
    audioManager.playSound('typing');
  };

  const handleSubmitGuess = () => {
    if (gameStatus !== 'playing') return;

    const guess = guesses[currentRow.current];
    if (guess.length !== word.length) {
      toast({
        title: "Incomplete Guess",
        description: "Please enter a complete word.",
        variant: "destructive",
      });
      audioManager.playSound('wrong');
      return;
    }

    const evaluation = evaluateGuess(guess, word);
    setEvaluations(prevEvaluations => {
      const newEvaluations = [...prevEvaluations];
      newEvaluations[currentRow.current] = evaluation;
      return newEvaluations;
    });

    const guessedCorrectly = evaluation.every(cell => cell.status === 'correct');
    setGuessedCorrectly(guessedCorrectly);

    if (guessedCorrectly) {
      setShowConfetti(true);
      audioManager.playSound('win');
    } else {
      // Play different sounds based on how many correct letters they have
      const correctCount = evaluation.filter(cell => cell.status === 'correct').length;
      const partialCount = evaluation.filter(cell => cell.status === 'wrong-position').length;
      
      if (correctCount > 0 || partialCount > 0) {
        audioManager.playSound('correct');
      } else {
        audioManager.playSound('wrong');
      }
    }

    handleKeyPress(guess);
  };

  const handleBackspace = () => {
    if (gameStatus !== 'playing') return;

    setGuesses(prevGuesses => {
      const newGuesses = [...prevGuesses];
      newGuesses[currentRow.current] = newGuesses[currentRow.current].slice(0, -1);
      return newGuesses;
    });
    
    audioManager.playSound('click');
  };

  const handleKeyPress = (key: string) => {
    if (currentGuess === currentRow.current && guessedCorrectly) {
      setGameStatus('won');
      if (onComplete) onComplete(true);
      setShowDefinition(true);
      return;
    }

    if (currentGuess === initialGuesses - 1 && !guessedCorrectly) {
      setGameStatus('lost');
      if (onComplete) onComplete(false);
      audioManager.playSound('wrong');
      return;
    }

    setCurrentGuess(prevGuess => prevGuess + 1);
    currentRow.current++;
  };

  const getCellColorClass = (rowIndex: number, cellIndex: number) => {
    if (evaluations && evaluations[rowIndex] && evaluations[rowIndex][cellIndex]) {
      const status = evaluations[rowIndex][cellIndex].status;
      switch (status) {
        case 'correct':
          return 'puzzle-letter-correct';
        case 'wrong-position':
          return 'puzzle-letter-wrong-position';
        case 'incorrect':
          return 'puzzle-letter-incorrect';
        default:
          return '';
      }
    }
    return '';
  };

  const getKeyColorClass = (key: string) => {
    if (evaluations.some(row => row.find(cell => cell.letter === key && cell.status === 'correct'))) {
      return 'bg-emerald-500 text-white';
    } else if (evaluations.some(row => row.find(cell => cell.letter === key && cell.status === 'wrong-position'))) {
      return 'bg-amber-500 text-white';
    } else if (evaluations.some(row => row.find(cell => cell.letter === key && cell.status === 'incorrect'))) {
      return 'bg-gray-400 dark:bg-gray-700 text-gray-200';
    }
    return '';
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <ConfettiExplosion 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
        pieces={100} 
        duration={3000}
        intensity="high"
        origin="center"
      />

      <div className="flex justify-between w-full items-center mb-2">
        <AnimeCharacter mood={gameStatus === 'won' ? 'happy' : gameStatus === 'lost' ? 'confused' : 'neutral'} />
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full"
          onClick={() => setShowSoundControls(!showSoundControls)}
        >
          <Key className="h-4 w-4" />
        </Button>
      </div>
      
      {showSoundControls && (
        <div className="w-full max-w-xs mb-4">
          <SoundControls />
        </div>
      )}

      <div className="space-y-3 mb-6">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {word.split('').map((_, cellIndex) => {
              const letter = guess[cellIndex] || '';
              const isEvaluated = evaluations[rowIndex] && evaluations[rowIndex][cellIndex]?.letter;
              const cellClass = getCellColorClass(rowIndex, cellIndex);
              const animationDelay = cellIndex * 0.1;
              
              return (
                <motion.div
                  key={`${rowIndex}-${cellIndex}`}
                  className={`puzzle-letter ${cellClass} flex items-center justify-center`}
                  animate={
                    isEvaluated && evaluations[rowIndex][cellIndex].status === 'correct' 
                      ? { scale: [1, 1.1, 1] }
                      : {}
                  }
                  transition={{ 
                    duration: 0.3,
                    delay: animationDelay
                  }}
                  style={{
                    animationDelay: `${animationDelay}s`,
                    transitionDelay: `${animationDelay}s`
                  }}
                >
                  {letter.toUpperCase()}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {gameStatus === 'lost' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl font-bold text-wizard-pink mb-2">
            The word was: {word.toUpperCase()}
          </p>
        </motion.div>
      )}

      {showDefinition && (
        <DefinitionDisplay word={word} />
      )}

      {gameStatus === 'playing' && (
        <Keyboard
          onLetterInput={handleLetterInput}
          onSubmitGuess={handleSubmitGuess}
          onBackspace={handleBackspace}
          getKeyColorClass={getKeyColorClass}
        />
      )}
      
      {gameStatus !== 'playing' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button 
            onClick={() => {
              resetGame();
              toast({
                title: gameStatus === 'won' ? "Let's play again!" : "Try again!",
                description: "A new challenge awaits you.",
              });
              audioManager.playSound('click');
            }}
            className="mt-4 bg-wizard-purple hover:bg-wizard-purple/90 animate-pulse-glow"
          >
            Play Again
          </Button>
        </motion.div>
      )}

      <style jsx global>{`
        .puzzle-letter {
          width: 3.5rem;
          height: 3.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          border: 2px solid #ccc;
          border-radius: 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 2px;
          transition: all 0.3s ease;
          transform-origin: center;
          text-transform: uppercase;
          font-family: var(--font-manga);
        }

        @media (max-width: 640px) {
          .puzzle-letter {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.25rem;
            margin: 0 1px;
          }
        }

        .puzzle-letter-correct {
          background-color: #10b981;
          border-color: #10b981;
          color: white;
          animation: flipIn 0.5s ease forwards;
        }

        .puzzle-letter-wrong-position {
          background-color: #f59e0b;
          border-color: #f59e0b;
          color: white;
          animation: flipIn 0.5s ease forwards;
        }

        .puzzle-letter-incorrect {
          background-color: #4b5563;
          border-color: #4b5563;
          color: rgba(255, 255, 255, 0.7);
          animation: flipIn 0.5s ease forwards;
        }

        @keyframes flipIn {
          0% {
            transform: rotateX(0deg);
            background-color: transparent;
          }
          50% {
            transform: rotateX(90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default WordPuzzle;

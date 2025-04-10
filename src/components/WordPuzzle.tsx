
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
  const currentRow = useRef(0);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize the game state
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
    
    // Play a subtle typing sound
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
    
    // Play a subtle backspace sound
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
      return 'bg-wizard-green text-white';
    } else if (evaluations.some(row => row.find(cell => cell.letter === key && cell.status === 'wrong-position'))) {
      return 'bg-wizard-yellow text-white';
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

      <AnimeCharacter mood={gameStatus === 'won' ? 'happy' : gameStatus === 'lost' ? 'confused' : 'neutral'} />

      <div className="space-y-3 mb-6">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {word.split('').map((_, cellIndex) => (
              <motion.div
                key={`${rowIndex}-${cellIndex}`}
                className={`puzzle-letter ${getCellColorClass(rowIndex, cellIndex)}`}
                animate={
                  evaluations[rowIndex] && evaluations[rowIndex][cellIndex] && 
                  evaluations[rowIndex][cellIndex].status === 'correct' ? {
                    scale: [1, 1.1, 1],
                    transition: { 
                      repeat: 1, 
                      duration: 0.3,
                      delay: cellIndex * 0.1
                    }
                  } : {}
                }
              >
                {guess[cellIndex]?.toUpperCase() || ''}
              </motion.div>
            ))}
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
            }}
            className="mt-4 bg-wizard-purple hover:bg-wizard-purple/90 animate-pulse-glow"
          >
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default WordPuzzle;

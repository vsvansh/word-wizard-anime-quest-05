
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import AnimeCharacter from './AnimeCharacter';
import { Sparkles, Zap, X } from 'lucide-react';
import { getRandomWord } from '@/lib/wordBank';

interface WordPuzzleProps {
  word?: string;
  maxAttempts?: number;
  onComplete?: (success: boolean) => void;
  useRandomWord?: boolean;
}

type LetterState = 'correct' | 'wrong-position' | 'incorrect' | 'empty';

interface GuessLetterState {
  letter: string;
  state: LetterState;
}

const WordPuzzle: React.FC<WordPuzzleProps> = ({
  word: providedWord,
  maxAttempts = 6,
  onComplete,
  useRandomWord = false
}) => {
  const { toast } = useToast();
  const [word, setWord] = useState(providedWord || "anime");
  const [attempts, setAttempts] = useState<GuessLetterState[][]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<string>('');
  const [characterMood, setCharacterMood] = useState<'neutral' | 'happy' | 'thinking' | 'excited' | 'confused'>('neutral');
  const [completed, setCompleted] = useState<boolean>(false);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [hintLetterIndex, setHintLetterIndex] = useState<number | null>(null);

  useEffect(() => {
    if (useRandomWord) {
      setWord(getRandomWord());
    }
  }, [useRandomWord]);

  useEffect(() => {
    // Initialize empty attempts
    const initialAttempts: GuessLetterState[][] = Array(maxAttempts)
      .fill(null)
      .map(() => 
        Array(word.length)
          .fill(null)
          .map(() => ({ letter: '', state: 'empty' }))
      );
    
    setAttempts(initialAttempts);
  }, [word, maxAttempts]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (completed) return;
    
    // Allow only letter keys, backspace, and enter
    if (e.key === 'Backspace') {
      setCurrentAttempt(prev => prev.slice(0, -1));
    } else if (e.key === 'Enter') {
      submitGuess();
    } else if (/^[a-zA-Z]$/.test(e.key) && currentAttempt.length < word.length) {
      setCurrentAttempt(prev => prev + e.key.toLowerCase());
    }
  };

  const submitGuess = () => {
    if (currentAttempt.length !== word.length) {
      toast({
        variant: "destructive",
        title: "Word too short!",
        description: `Your guess must be ${word.length} letters long.`
      });
      setCharacterMood('confused');
      setTimeout(() => setCharacterMood('neutral'), 2000);
      return;
    }
    
    // Get current attempt index
    const currentAttemptIndex = attempts.findIndex(attempt => 
      attempt.some(letter => letter.letter === '') || 
      attempt.every(letter => letter.letter === '')
    );
    
    if (currentAttemptIndex === -1) return;
    
    // Create new attempts array
    const newAttempts = [...attempts];
    
    // Evaluate each letter
    const guessResult = evaluateGuess(currentAttempt, word);
    newAttempts[currentAttemptIndex] = guessResult;
    
    setAttempts(newAttempts);
    setCurrentAttempt('');
    
    // Check if the guess is correct
    const isCorrect = guessResult.every(letter => letter.state === 'correct');
    
    if (isCorrect) {
      setCompleted(true);
      setCharacterMood('excited');
      toast({
        title: "Great job!",
        description: "You solved the puzzle! 🎉",
      });
      if (onComplete) onComplete(true);
    } else if (currentAttemptIndex === maxAttempts - 1) {
      // Last attempt and incorrect
      setCompleted(true);
      setCharacterMood('confused');
      toast({
        variant: "destructive",
        title: "Game Over!",
        description: `The word was: ${word.toUpperCase()}`,
      });
      if (onComplete) onComplete(false);
    } else {
      // Incorrect but still have attempts
      setCharacterMood('thinking');
      setTimeout(() => setCharacterMood('neutral'), 2000);
    }
  };

  const evaluateGuess = (guess: string, target: string): GuessLetterState[] => {
    const result: GuessLetterState[] = Array(target.length)
      .fill(null)
      .map((_, i) => ({
        letter: guess[i],
        state: 'incorrect'
      }));
    
    // Check for correct positions first
    for (let i = 0; i < target.length; i++) {
      if (guess[i] === target[i]) {
        result[i].state = 'correct';
      }
    }
    
    // Check for wrong positions
    const targetLetterCount: Record<string, number> = {};
    
    // Count remaining letters in target (excluding exact matches)
    for (let i = 0; i < target.length; i++) {
      if (guess[i] !== target[i]) {
        targetLetterCount[target[i]] = (targetLetterCount[target[i]] || 0) + 1;
      }
    }
    
    // Mark wrong positions
    for (let i = 0; i < target.length; i++) {
      const letter = guess[i];
      if (result[i].state !== 'correct' && targetLetterCount[letter] && targetLetterCount[letter] > 0) {
        result[i].state = 'wrong-position';
        targetLetterCount[letter]--;
      }
    }
    
    return result;
  };

  const useHint = () => {
    if (hintsUsed >= 2) {
      toast({
        variant: "destructive",
        title: "No more hints!",
        description: "You've used all your hints for this puzzle."
      });
      return;
    }

    // Find the first incorrect letter in the current row
    const currentAttemptIndex = attempts.findIndex(attempt => 
      attempt.some(letter => letter.letter === '') || 
      attempt.every(letter => letter.letter === '')
    );

    if (currentAttemptIndex === 0 && currentAttempt === '') {
      // If no attempts yet, reveal the first letter
      const hintIndex = 0;
      setCurrentAttempt(word[hintIndex]);
      setHintLetterIndex(hintIndex);
    } else if (currentAttemptIndex > 0) {
      // Find a letter that hasn't been guessed correctly yet
      const previousAttempt = attempts[currentAttemptIndex - 1];
      for (let i = 0; i < word.length; i++) {
        if (previousAttempt[i].state !== 'correct') {
          const newAttempt = currentAttempt.padEnd(i, ' ').substring(0, i) + word[i] + 
                             (currentAttempt.length > i ? currentAttempt.substring(i + 1) : '');
          setCurrentAttempt(newAttempt.trim());
          setHintLetterIndex(i);
          break;
        }
      }
    }

    setHintsUsed(prev => prev + 1);
    setCharacterMood('happy');
    setTimeout(() => setCharacterMood('neutral'), 2000);
  };

  const handleReset = () => {
    const initialAttempts: GuessLetterState[][] = Array(maxAttempts)
      .fill(null)
      .map(() => 
        Array(word.length)
          .fill(null)
          .map(() => ({ letter: '', state: 'empty' }))
      );
    
    setAttempts(initialAttempts);
    setCurrentAttempt('');
    setCharacterMood('neutral');
    setCompleted(false);
    setHintsUsed(0);
    setHintLetterIndex(null);
  };

  const renderLetterClassName = (state: LetterState) => {
    switch (state) {
      case 'correct':
        return 'puzzle-letter puzzle-letter-correct';
      case 'wrong-position':
        return 'puzzle-letter puzzle-letter-wrong-position';
      case 'incorrect':
        return 'puzzle-letter puzzle-letter-incorrect';
      default:
        return 'puzzle-letter';
    }
  };

  const getVirtualKeyboardLetterState = (letter: string): LetterState => {
    // Get the highest priority state for this letter
    // Priority: correct > wrong-position > incorrect > empty
    let highestState: LetterState = 'empty';
    
    for (const attempt of attempts) {
      for (const letterObj of attempt) {
        if (letterObj.letter.toLowerCase() === letter.toLowerCase()) {
          if (letterObj.state === 'correct') {
            return 'correct'; // Return immediately if we find a correct match
          } else if (letterObj.state === 'wrong-position' && highestState !== 'correct') {
            highestState = 'wrong-position';
          } else if (letterObj.state === 'incorrect' && highestState !== 'correct' && highestState !== 'wrong-position') {
            highestState = 'incorrect';
          }
        }
      }
    }
    
    return highestState;
  };

  const keyboard = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace']
  ];

  const handleKeyPress = (key: string) => {
    if (key === 'enter') {
      submitGuess();
    } else if (key === 'backspace') {
      setCurrentAttempt(prev => prev.slice(0, -1));
    } else if (currentAttempt.length < word.length) {
      setCurrentAttempt(prev => prev + key);
    }
  };

  return (
    <div 
      className="w-full max-w-md mx-auto p-4 focus:outline-none" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline"
          size="sm"
          className="text-wizard-purple border-wizard-purple hover:bg-wizard-purple/10"
          onClick={useHint}
          disabled={completed || hintsUsed >= 2}
        >
          <Zap className="w-4 h-4 mr-1" />
          Hint ({2 - hintsUsed} left)
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="text-gray-500 border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800" 
          onClick={handleReset}
        >
          <X className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>
      
      <div className="mb-8">
        <AnimeCharacter mood={characterMood} className="mb-4" />
        
        <div className="space-y-2">
          {attempts.map((attempt, attemptIndex) => (
            <div key={attemptIndex} className="flex justify-center space-x-2">
              {attempt.map((letterObj, letterIndex) => {
                // Current attempt row that's being filled
                const isCurrentAttemptRow = 
                  attemptIndex === attempts.findIndex(a => a.some(l => l.letter === '') || a.every(l => l.letter === ''));
                
                // Should show the current input in this position
                const showCurrentInput = 
                  isCurrentAttemptRow && 
                  letterIndex < currentAttempt.length && 
                  letterObj.letter === '';
                
                // Determine what to display
                const displayLetter = showCurrentInput 
                  ? currentAttempt[letterIndex].toUpperCase()
                  : letterObj.letter.toUpperCase();
                
                // Determine special styling for hint letters
                const isHintLetter = 
                  isCurrentAttemptRow && 
                  hintLetterIndex === letterIndex && 
                  letterIndex < currentAttempt.length;
                
                return (
                  <div 
                    key={letterIndex}
                    className={`
                      ${renderLetterClassName(letterObj.state)}
                      ${showCurrentInput ? 'border-gray-400 bg-gray-50' : ''}
                      ${isHintLetter ? 'ring-2 ring-wizard-yellow ring-offset-2' : ''}
                    `}
                  >
                    {displayLetter}
                    {isHintLetter && (
                      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-wizard-yellow animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Virtual keyboard */}
      <div className="w-full max-w-md mx-auto">
        {keyboard.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-2 space-x-1">
            {row.map((key) => {
              const isSpecialKey = key === 'enter' || key === 'backspace';
              const letterState = !isSpecialKey ? getVirtualKeyboardLetterState(key) : 'empty';
              
              let bgColor = 'bg-gray-200 hover:bg-gray-300';
              if (letterState === 'correct') bgColor = 'bg-wizard-green text-white';
              else if (letterState === 'wrong-position') bgColor = 'bg-wizard-yellow text-white';
              else if (letterState === 'incorrect') bgColor = 'bg-gray-400 text-white';
              
              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`
                    ${bgColor}
                    rounded-md font-medium transition-colors 
                    ${isSpecialKey ? 'px-3 py-3 text-xs' : 'w-8 h-10 text-sm'}
                  `}
                  disabled={completed}
                >
                  {key === 'backspace' ? '⌫' : key === 'enter' ? 'Enter' : key.toUpperCase()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordPuzzle;

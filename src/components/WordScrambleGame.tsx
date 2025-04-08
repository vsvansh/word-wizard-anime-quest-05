
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, RefreshCw, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AnimeCharacter from './AnimeCharacter';
import audioManager from '@/lib/audioManager';

// Simple list of anime-related words
const animeWords = [
  'NINJA', 'MECHA', 'MANGA', 'ANIME', 'BENTO', 'KAIJU', 'OTAKU', 'CHIBI', 
  'KAWAII', 'SENSEI', 'SAKURA', 'SHONEN', 'SHOUJO', 'SUSHI', 'KATANA'
];

interface WordScrambleGameProps {
  onComplete?: (score: number) => void;
  difficulty?: 'easy' | 'normal' | 'hard';
  timeLimit?: number;
}

const WordScrambleGame: React.FC<WordScrambleGameProps> = ({
  onComplete,
  difficulty = 'normal',
  timeLimit = 60
}) => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [scrambledWord, setScrambledWord] = useState<string>('');
  const [userGuess, setUserGuess] = useState<string>('');
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [gameActive, setGameActive] = useState(false);
  const [characterMood, setCharacterMood] = useState<'neutral' | 'happy' | 'thinking' | 'excited' | 'confused'>('neutral');
  const [difficultyMultiplier, setDifficultyMultiplier] = useState(1);
  const [wordLetters, setWordLetters] = useState<{letter: string, position: number}[]>([]);
  const { toast } = useToast();

  // Set difficulty multiplier
  useEffect(() => {
    switch(difficulty) {
      case 'easy':
        setDifficultyMultiplier(0.8);
        break;
      case 'hard':
        setDifficultyMultiplier(1.5);
        break;
      default:
        setDifficultyMultiplier(1);
    }
  }, [difficulty]);

  // Initialize game
  const startGame = () => {
    setScore(0);
    setTimeRemaining(timeLimit);
    setGameActive(true);
    setCharacterMood('excited');
    audioManager.playSound('correct');
    generateNewWord();
  };

  // Generate a new scrambled word
  const generateNewWord = () => {
    // Select a random word
    const randomIndex = Math.floor(Math.random() * animeWords.length);
    const word = animeWords[randomIndex];
    setCurrentWord(word);
    
    // Scramble the word
    let scrambled = word.split('');
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    
    // Make sure scrambled word is actually scrambled
    while (scrambled.join('') === word) {
      for (let i = scrambled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
      }
    }
    
    setScrambledWord(scrambled.join(''));
    
    // Create letter objects for the UI
    const letters = scrambled.map((letter, index) => ({
      letter,
      position: index
    }));
    
    setWordLetters(letters);
    setUserGuess('');
  };

  // Handle letter click
  const handleLetterClick = (letter: string, position: number) => {
    if (userGuess.length < currentWord.length) {
      setUserGuess(prev => prev + letter);
      
      // Remove letter from available letters
      setWordLetters(prev => prev.filter(l => l.position !== position));
      
      audioManager.playSound('click');
    }
  };

  // Handle submit guess
  const handleSubmitGuess = () => {
    if (userGuess.length === 0) return;
    
    if (userGuess === currentWord) {
      const points = Math.ceil(10 * difficultyMultiplier);
      setScore(prev => prev + points);
      setCharacterMood('excited');
      audioManager.playSound('win');
      
      toast({
        title: "Correct!",
        description: `+${points} points`,
      });
      
      setTimeout(() => {
        generateNewWord();
        setCharacterMood('neutral');
      }, 1000);
    } else {
      setCharacterMood('confused');
      audioManager.playSound('wrong');
      
      toast({
        variant: "destructive",
        title: "Incorrect!",
        description: "Try again or reset to get a new word",
      });
      
      // Reset the user's guess and make all letters available again
      setUserGuess('');
      setWordLetters(scrambledWord.split('').map((letter, index) => ({
        letter,
        position: index
      })));
      
      setTimeout(() => {
        setCharacterMood('neutral');
      }, 1000);
    }
  };

  // Handle reset current word
  const handleReset = () => {
    setUserGuess('');
    setWordLetters(scrambledWord.split('').map((letter, index) => ({
      letter,
      position: index
    })));
    audioManager.playSound('click');
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameActive(false);
            setCharacterMood('thinking');
            
            toast({
              title: "Time's up!",
              description: `Final score: ${score}`,
            });
            
            if (onComplete) {
              onComplete(score);
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameActive, timeRemaining, score, onComplete]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="anime-card p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-manga bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text mb-2">
          Word Scramble Challenge
        </h3>
        <p className="text-foreground/70">
          Unscramble the anime words before time runs out!
        </p>
      </div>
      
      <AnimeCharacter mood={characterMood} className="mb-6" />
      
      {!gameActive ? (
        <div className="text-center space-y-6">
          <div className="bg-wizard-purple/10 dark:bg-wizard-purple/20 p-4 rounded-lg">
            <h4 className="font-bold mb-2">How to Play:</h4>
            <p className="text-sm text-foreground/80">
              Unscramble as many anime-related words as you can in {timeLimit} seconds! 
              Each correct answer is worth points based on difficulty.
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button
              onClick={startGame}
              className="btn-anime w-full py-6"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Game
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between">
            <div className="bg-wizard-yellow/10 dark:bg-wizard-yellow/20 px-4 py-2 rounded-lg text-center min-w-20">
              <p className="text-xs text-wizard-yellow font-bold">SCORE</p>
              <p className="text-xl font-bold">{score}</p>
            </div>
            
            <div className="bg-wizard-blue/10 dark:bg-wizard-blue/20 px-4 py-2 rounded-lg text-center flex items-center gap-2 min-w-20">
              <Clock className="h-4 w-4 text-wizard-blue" />
              <p className="text-xl font-bold">{formatTime(timeRemaining)}</p>
            </div>
          </div>
          
          {/* Scrambled Word Display */}
          <div className="text-center">
            <p className="text-sm text-foreground/60 mb-2">SCRAMBLED WORD:</p>
            <div className="font-manga text-2xl tracking-wider font-bold mb-4 bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
              {scrambledWord}
            </div>
          </div>
          
          {/* User's Current Guess */}
          <div className="relative py-4">
            <div className="flex justify-center space-x-2 mb-4">
              {currentWord.split('').map((_, index) => (
                <div 
                  key={index} 
                  className={`w-10 h-10 border-2 ${userGuess[index] ? 'border-wizard-purple bg-wizard-purple/10' : 'border-dashed border-gray-300 dark:border-gray-700'} rounded-lg flex items-center justify-center font-bold text-lg`}
                >
                  {userGuess[index] || ''}
                </div>
              ))}
            </div>
          </div>
          
          {/* Available Letters */}
          <AnimatePresence>
            <div className="flex flex-wrap justify-center gap-2">
              {wordLetters.map((letterObj) => (
                <motion.button
                  key={letterObj.position}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-10 h-10 border-2 border-wizard-blue bg-wizard-blue/10 hover:bg-wizard-blue/20 rounded-lg flex items-center justify-center font-bold text-lg transform hover:scale-110 transition-transform"
                  onClick={() => handleLetterClick(letterObj.letter, letterObj.position)}
                >
                  {letterObj.letter}
                </motion.button>
              ))}
            </div>
          </AnimatePresence>
          
          {/* Action Buttons */}
          <div className="flex justify-between gap-4 mt-4">
            <Button 
              variant="outline" 
              className="flex-1 border-gray-300 dark:border-gray-700"
              onClick={handleReset}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            
            <Button 
              className="flex-1 bg-wizard-purple hover:bg-wizard-purple/90"
              onClick={handleSubmitGuess}
              disabled={userGuess.length !== currentWord.length}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Submit
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WordScrambleGame;

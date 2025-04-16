
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Heart } from 'lucide-react';
import audioManager from '@/lib/audioManager';
import { Card } from '@/components/ui/card';

interface HangmanGameProps {
  onComplete?: (score: number) => void;
  difficulty?: 'easy' | 'normal' | 'hard';
}

// Anime themed word lists
const wordLists = {
  easy: ['NARUTO', 'GOKU', 'LUFFY', 'EREN', 'SASUKE', 'DEKU', 'MIKASA', 'REM', 'LEVI'],
  normal: ['POKEMON', 'JUJUTSU', 'CHAINSAW', 'BLEACH', 'HUNTER', 'ATTACK', 'DRAGON', 'FULLMETAL'],
  hard: ['EVANGELION', 'SPIRITAWAY', 'CHAMPLOO', 'BERSERK', 'BEBOP', 'DEATHNOTE', 'PROMISED', 'STEINSGATE']
};

const HangmanGame: React.FC<HangmanGameProps> = ({ 
  onComplete,
  difficulty = 'normal' 
}) => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [livesLeft, setLivesLeft] = useState(6);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState('Anime');
  const [hint, setHint] = useState('');
  const { toast } = useToast();
  
  // Initialize game
  useEffect(() => {
    startNewGame();
  }, [difficulty]);
  
  // Check win/loss conditions whenever guessed letters change
  useEffect(() => {
    if (!word || gameStatus !== 'playing') return;
    
    // Check if player has guessed all letters in the word
    const uniqueLettersInWord = Array.from(new Set(word.split('')));
    const correctlyGuessedLetters = guessedLetters.filter(letter => word.includes(letter));
    
    if (correctlyGuessedLetters.length >= uniqueLettersInWord.length) {
      handleWin();
    }
    // Loss is checked in handleLetterGuess when lives reach 0
  }, [guessedLetters, word, gameStatus]);
  
  const startNewGame = () => {
    // Select a random word based on difficulty
    const wordList = wordLists[difficulty as keyof typeof wordLists] || wordLists.normal;
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    
    // Generate a hint based on the word
    const hints = {
      'NARUTO': 'Ninja who wants to be Hokage',
      'GOKU': 'Saiyan warrior with spiky hair',
      'LUFFY': 'Pirate with rubber powers',
      'EREN': 'Attack on Titan protagonist',
      'SASUKE': 'Uchiha clan survivor',
      'DEKU': 'My Hero Academia main character',
      'MIKASA': 'Elite soldier with a red scarf',
      'REM': 'Blue-haired maid from Re:Zero',
      'LEVI': 'Humanity\'s strongest soldier',
      'POKEMON': 'Gotta catch \'em all',
      'JUJUTSU': 'Modern sorcery anime',
      'CHAINSAW': 'Devil hunter with a unique power',
      'BLEACH': 'Soul reapers and hollows',
      'HUNTER': 'Exam to become a special kind of hunter',
      'ATTACK': 'Humanity behind walls',
      'DRAGON': 'Seven magical orbs',
      'FULLMETAL': 'Brothers seeking the philosopher\'s stone',
      'EVANGELION': 'Teens piloting giant robots',
      'SPIRITAWAY': 'Ghibli film about a girl in a spirit world',
      'CHAMPLOO': 'Samurai hip-hop journey',
      'BERSERK': 'Dark fantasy manga with a large sword',
      'BEBOP': 'Space bounty hunters',
      'DEATHNOTE': 'Notebook that kills',
      'PROMISED': 'Orphans discover the truth outside',
      'STEINSGATE': 'Time travel experiments gone wrong'
    };
    
    const newHint = hints[newWord as keyof typeof hints] || 'Anime related';
    
    setWord(newWord);
    setGuessedLetters([]);
    setLivesLeft(6);
    setGameStatus('playing');
    setHint(newHint);
    
    // Reset score if coming from a completed game
    if (gameStatus !== 'playing') {
      setScore(0);
    }
  };
  
  const handleLetterGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;
    
    // Add the letter to guessed letters
    setGuessedLetters(prev => [...prev, letter]);
    
    // Check if the letter is in the word
    if (word.includes(letter)) {
      // Correct guess!
      audioManager.playSound('correct');
      setScore(prev => prev + 10);
      
      // Check if this completes the word
      const uniqueLettersInWord = Array.from(new Set(word.split('')));
      const correctlyGuessedLetters = [...guessedLetters, letter].filter(l => word.includes(l));
      
      if (correctlyGuessedLetters.length >= uniqueLettersInWord.length) {
        handleWin();
      }
    } else {
      // Incorrect guess
      audioManager.playSound('wrong');
      setLivesLeft(prev => prev - 1);
      
      // Check for game over
      if (livesLeft <= 1) {
        handleLoss();
      }
    }
  };
  
  const handleWin = () => {
    setGameStatus('won');
    
    // Calculate final score - base + lives bonus
    const livesBonus = livesLeft * 15;
    const finalScore = score + livesBonus;
    setScore(finalScore);
    
    toast({
      title: "You won!",
      description: `The word was ${word}. You earned ${finalScore} points!`,
    });
    
    audioManager.playSound('win');
    
    if (onComplete) {
      setTimeout(() => {
        onComplete(finalScore);
      }, 2000);
    }
  };
  
  const handleLoss = () => {
    setGameStatus('lost');
    
    toast({
      title: "Game Over",
      description: `The word was ${word}. Try again!`,
      variant: "destructive",
    });
    
    audioManager.playSound('wrong');
    
    if (onComplete) {
      setTimeout(() => {
        onComplete(score);
      }, 2000);
    }
  };
  
  const renderWord = () => {
    return word.split('').map((letter, index) => (
      <motion.div 
        key={index} 
        className={`
          w-8 h-10 sm:w-10 sm:h-12 
          flex items-center justify-center 
          border-b-2 border-wizard-purple 
          mx-1 text-xl sm:text-2xl font-bold
        `}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {guessedLetters.includes(letter) ? letter : ''}
      </motion.div>
    ));
  };
  
  const renderKeyboard = () => {
    const keyboard = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];
    
    return keyboard.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center my-1 gap-1">
        {row.map(key => {
          const isGuessed = guessedLetters.includes(key);
          const isCorrect = word.includes(key) && isGuessed;
          
          return (
            <Button
              key={key}
              onClick={() => handleLetterGuess(key)}
              disabled={isGuessed || gameStatus !== 'playing'}
              size="sm"
              variant={isGuessed ? (isCorrect ? "default" : "outline") : "secondary"}
              className={`
                w-7 h-8 sm:w-8 sm:h-9 p-0 font-bold text-sm
                ${isCorrect ? 'bg-wizard-green hover:bg-wizard-green/90' : ''}
                ${isGuessed && !isCorrect ? 'bg-gray-300 dark:bg-gray-700 text-gray-500' : ''}
              `}
            >
              {key}
            </Button>
          );
        })}
      </div>
    ));
  };
  
  const renderHangman = () => {
    // Different hangman states based on lives left
    return (
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto">
        {/* Gallows */}
        <motion.div
          className="absolute bottom-0 w-full h-2 bg-wizard-purple/80 rounded-lg"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
        />
        <motion.div
          className="absolute bottom-0 left-8 w-2 h-32 sm:h-36 bg-wizard-purple/80 rounded-lg"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.1 }}
        />
        <motion.div
          className="absolute top-0 left-8 w-16 h-2 bg-wizard-purple/80 rounded-lg"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2 }}
        />
        <motion.div
          className="absolute top-0 right-8 w-2 h-6 bg-wizard-purple/80 rounded-lg"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: livesLeft < 6 ? 'block' : 'none' }}
        />
        
        {/* Head */}
        <motion.div
          className="absolute top-6 right-8 w-8 h-8 rounded-full border-2 border-wizard-pink"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: livesLeft < 5 ? 1 : 0,
            scale: livesLeft < 5 ? 1 : 0
          }}
          transition={{ delay: 0.4 }}
          style={{ transform: 'translateX(3px)' }}
        />
        
        {/* Body */}
        <motion.div
          className="absolute top-14 right-8 w-2 h-10 bg-wizard-pink rounded-lg"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: livesLeft < 4 ? 1 : 0 }}
          transition={{ delay: 0.5 }}
          style={{ transform: 'translateX(3px)' }}
        />
        
        {/* Arms */}
        <motion.div
          className="absolute top-16 right-10 w-6 h-2 bg-wizard-pink rounded-lg"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: livesLeft < 3 ? 1 : 0 }}
          transition={{ delay: 0.6 }}
        />
        <motion.div
          className="absolute top-16 right-6 w-6 h-2 bg-wizard-pink rounded-lg"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: livesLeft < 2 ? 1 : 0 }}
          transition={{ delay: 0.7 }}
          style={{ transform: 'translateX(5px)' }}
        />
        
        {/* Legs */}
        <motion.div
          className="absolute top-23 right-10 w-2 h-6 bg-wizard-pink rounded-lg"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: livesLeft < 1 ? 1 : 0 }}
          transition={{ delay: 0.8 }}
          style={{ transform: 'rotate(25deg) translateY(4px)' }}
        />
        <motion.div
          className="absolute top-23 right-6 w-2 h-6 bg-wizard-pink rounded-lg"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: livesLeft === 0 ? 1 : 0 }}
          transition={{ delay: 0.9 }}
          style={{ transform: 'rotate(-25deg) translateY(4px) translateX(8px)' }}
        />
      </div>
    );
  };
  
  return (
    <div className="p-2 sm:p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-xs text-gray-500">Category</div>
          <div className="text-sm font-semibold">{category}</div>
        </div>
        
        <div className="flex items-center">
          {[...Array(livesLeft)].map((_, i) => (
            <Heart 
              key={i} 
              size={16} 
              className="text-wizard-pink fill-wizard-pink mr-1" 
              fill="currentColor"
            />
          ))}
          {[...Array(6 - livesLeft)].map((_, i) => (
            <Heart 
              key={i + livesLeft} 
              size={16} 
              className="text-gray-300 dark:text-gray-600 mr-1"
            />
          ))}
        </div>
        
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0" 
          onClick={startNewGame}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <Card className="mb-4 p-4">
        {renderHangman()}
        
        <div className="mt-2 text-center">
          <div className="text-xs text-wizard-purple mb-1">Hint</div>
          <div className="text-sm italic">{hint}</div>
        </div>
      </Card>
      
      <div className="flex justify-center mb-6">
        {renderWord()}
      </div>
      
      <div className="mb-4">
        {renderKeyboard()}
      </div>
      
      {gameStatus === 'won' && (
        <motion.div
          className="mt-4 p-3 bg-wizard-green/20 border border-wizard-green/30 rounded-lg text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-manga text-lg text-wizard-green">You Won!</h3>
          <p className="text-sm">Word: <span className="font-bold">{word}</span></p>
          <p className="text-sm">Score: <span className="font-bold">{score}</span></p>
          <p className="text-xs text-gray-500">Lives Bonus: +{livesLeft * 15} points</p>
        </motion.div>
      )}
      
      {gameStatus === 'lost' && (
        <motion.div
          className="mt-4 p-3 bg-wizard-pink/20 border border-wizard-pink/30 rounded-lg text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-manga text-lg text-wizard-pink">Game Over</h3>
          <p className="text-sm">The word was: <span className="font-bold">{word}</span></p>
          <p className="text-sm">Score: <span className="font-bold">{score}</span></p>
        </motion.div>
      )}
    </div>
  );
};

export default HangmanGame;

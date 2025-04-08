
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Clock, Zap, Keyboard, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import AnimeCharacter from '@/components/AnimeCharacter';
import audioManager from '@/lib/audioManager';

// Anime-themed phrases and quotes
const animeQuotes = [
  "Believe in yourself and create your own destiny",
  "Power comes in response to a need, not a desire",
  "The future is not a straight line",
  "Sometimes you must hurt in order to know",
  "People's dreams never end",
  "A dropout will beat a genius through hard work",
  "If you don't take risks, you can't create a future",
  "The loneliest people are the kindest",
  "It's not the face that makes someone a monster",
  "Never give up, that is my ninja way",
  "Fear is not evil, it tells you what your weakness is",
  "Whatever happens, happens",
  "Life is not a game of luck, if you wanna win, work hard",
  "A hero is someone who has given his life to something bigger than oneself",
  "The moment you think of giving up, think of the reason why you held on so long",
  "I'll take a potato chip and eat it",
  "I want to be the very best like no one ever was",
  "These hands of ours are burning red"
];

interface SpeedTypeGameProps {
  onComplete?: (score: number) => void;
  difficulty?: 'easy' | 'normal' | 'hard';
  timeLimit?: number;
}

const SpeedTypeGame: React.FC<SpeedTypeGameProps> = ({
  onComplete,
  difficulty = 'normal',
  timeLimit = 60
}) => {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [charactersTyped, setCharactersTyped] = useState(0);
  const [characterMood, setCharacterMood] = useState<'neutral' | 'happy' | 'thinking' | 'excited' | 'confused'>('neutral');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Generate a new random phrase
  const generateNewPhrase = () => {
    const randomIndex = Math.floor(Math.random() * animeQuotes.length);
    const phrase = animeQuotes[randomIndex];
    setCurrentPhrase(phrase);
  };

  // Start the game
  const handleStartGame = () => {
    setScore(0);
    setAccuracy(100);
    setTimeRemaining(timeLimit);
    setWordsPerMinute(0);
    setTotalWords(0);
    setCharactersTyped(0);
    setGameActive(true);
    setUserInput('');
    setCharacterMood('excited');
    generateNewPhrase();
    audioManager.playSound('correct');
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    audioManager.playSound('click');
    
    // Check if the input matches the current phrase
    if (value === currentPhrase) {
      // Calculate points based on length and difficulty
      const points = Math.ceil(currentPhrase.length * 0.5 * getDifficultyMultiplier());
      setScore(prev => prev + points);
      setTotalWords(prev => prev + currentPhrase.split(' ').length);
      setCharactersTyped(prev => prev + currentPhrase.length);
      
      // Update character mood
      setCharacterMood('happy');
      audioManager.playSound('win');
      
      // Show toast message
      toast({
        title: "Phrase Completed!",
        description: `+${points} points`,
      });
      
      // Generate a new phrase and clear input
      generateNewPhrase();
      setUserInput('');
      
      // Reset character mood after a delay
      setTimeout(() => {
        setCharacterMood('neutral');
      }, 1000);
    }
  };

  // Get difficulty multiplier
  const getDifficultyMultiplier = () => {
    switch(difficulty) {
      case 'easy': return 0.8;
      case 'hard': return 1.5;
      default: return 1;
    }
  };

  // Update words per minute and accuracy
  useEffect(() => {
    if (gameActive && timeLimit > timeRemaining && charactersTyped > 0) {
      const minutes = (timeLimit - timeRemaining) / 60;
      const wpm = Math.round(totalWords / Math.max(minutes, 0.1));
      setWordsPerMinute(wpm);
      
      // Calculate accuracy based on correct characters vs. total typed
      const currentPhrasePart = currentPhrase.substring(0, userInput.length);
      let correctChars = 0;
      
      for (let i = 0; i < userInput.length; i++) {
        if (i < currentPhrasePart.length && userInput[i] === currentPhrasePart[i]) {
          correctChars++;
        }
      }
      
      const typingAccuracy = (charactersTyped + correctChars) / (charactersTyped + userInput.length) * 100;
      setAccuracy(Math.round(typingAccuracy));
    }
  }, [userInput, charactersTyped, totalWords, timeLimit, timeRemaining, currentPhrase, gameActive]);

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            
            // Game over
            setGameActive(false);
            
            // Update character mood
            setCharacterMood('thinking');
            
            // Calculate final score with bonus from accuracy and WPM
            const speedBonus = Math.floor(wordsPerMinute * 0.5);
            const accuracyBonus = Math.floor(accuracy * 0.5);
            const finalScore = score + speedBonus + accuracyBonus;
            
            // Show toast with final score
            toast({
              title: "Time's up!",
              description: `Final score: ${finalScore} (Speed bonus: +${speedBonus}, Accuracy bonus: +${accuracyBonus})`,
            });
            
            // Call onComplete callback
            if (onComplete) {
              onComplete(finalScore);
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
  }, [gameActive, timeRemaining, score, wordsPerMinute, accuracy, onComplete]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Highlight matching parts of the current phrase
  const renderPhrase = () => {
    const parts = [];
    const inputLength = userInput.length;
    
    for (let i = 0; i < currentPhrase.length; i++) {
      if (i < inputLength) {
        if (currentPhrase[i] === userInput[i]) {
          // Correct character
          parts.push(<span key={i} className="text-wizard-green">{currentPhrase[i]}</span>);
        } else {
          // Incorrect character
          parts.push(<span key={i} className="text-wizard-pink">{currentPhrase[i]}</span>);
        }
      } else {
        // Not yet typed
        parts.push(<span key={i} className="text-foreground/80">{currentPhrase[i]}</span>);
      }
    }
    
    return <div className="font-bold text-xl mb-4">{parts}</div>;
  };

  return (
    <Card className="anime-card p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-manga bg-gradient-to-r from-wizard-blue to-wizard-green text-transparent bg-clip-text mb-2">
          Speed Type Challenge
        </h3>
        <p className="text-foreground/70">
          Type anime quotes and phrases as fast as you can!
        </p>
      </div>
      
      <AnimeCharacter mood={characterMood} className="mb-4" />
      
      {!gameActive ? (
        <div className="text-center space-y-6">
          <div className="bg-wizard-blue/10 dark:bg-wizard-blue/20 p-4 rounded-lg">
            <h4 className="font-bold mb-2">How to Play:</h4>
            <p className="text-sm text-foreground/80">
              Type the anime quotes as quickly and accurately as possible! Earn points for each completed phrase, 
              with bonus points for speed and accuracy.
            </p>
          </div>
          
          <Button
            onClick={handleStartGame}
            className="w-full bg-wizard-blue hover:bg-wizard-blue/90 btn-anime py-6"
          >
            <Zap className="mr-2 h-5 w-5" />
            Start Typing Challenge
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
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
          
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <p className="text-wizard-purple font-bold">WPM</p>
              <p>{wordsPerMinute}</p>
            </div>
            <div className="text-center">
              <p className="text-wizard-green font-bold">Accuracy</p>
              <p>{accuracy}%</p>
            </div>
            <div className="text-center">
              <p className="text-wizard-blue font-bold">Words</p>
              <p>{totalWords}</p>
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
            {renderPhrase()}
          </div>
          
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder="Type here..."
              className="w-full py-3 px-4 text-lg bg-white/70 dark:bg-gray-800/70 border-wizard-blue/50 focus:border-wizard-blue"
              value={userInput}
              onChange={handleInputChange}
              autoFocus
            />
            <Keyboard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-wizard-blue/50 h-5 w-5" />
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-center mb-1">Progress</p>
            <Progress value={(timeLimit - timeRemaining) / timeLimit * 100} 
              className="h-2 bg-wizard-blue/20" 
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => {
              generateNewPhrase();
              setUserInput('');
              audioManager.playSound('click');
            }}
            className="w-full mt-2 border-wizard-blue/30 text-wizard-blue hover:bg-wizard-blue/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Skip Quote
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SpeedTypeGame;

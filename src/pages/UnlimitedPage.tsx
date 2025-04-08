
import { useState, useEffect, useCallback } from 'react';
import NavBar from '@/components/NavBar';
import WordPuzzle from '@/components/WordPuzzle';
import PageHeader from '@/components/unlimited/PageHeader';
import ActionButtons from '@/components/unlimited/ActionButtons';
import StatsCard from '@/components/unlimited/StatsCard';
import PuzzleFooter from '@/components/unlimited/PuzzleFooter';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { getRandomWord } from '@/lib/wordBank';
import audioManager from '@/lib/audioManager';
import PageFooter from '@/components/PageFooter';
import ParticleBackground from '@/components/ParticleBackground';

const UnlimitedPage = () => {
  // Get saved stats or initialize with default values
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('level');
    return saved ? parseInt(saved) : 1;
  });
  
  const [experience, setExperience] = useState(() => {
    const saved = localStorage.getItem('experience');
    return saved ? parseInt(saved) : 0;
  });
  
  const [puzzlesSolved, setPuzzlesSolved] = useState(() => {
    const saved = localStorage.getItem('puzzlesSolved');
    return saved ? parseInt(saved) : 0;
  });
  
  const [puzzlesSkipped, setPuzzlesSkipped] = useState(() => {
    const saved = localStorage.getItem('puzzlesSkipped');
    return saved ? parseInt(saved) : 0;
  });
  
  const [currentStreak, setCurrentStreak] = useState(() => {
    const saved = localStorage.getItem('currentStreak');
    return saved ? parseInt(saved) : 0;
  });
  
  const [bestStreak, setBestStreak] = useState(() => {
    const saved = localStorage.getItem('bestStreak');
    return saved ? parseInt(saved) : 0;
  });
  
  const [currentWord, setCurrentWord] = useState<string>(getRandomWord());
  const [hintsRemaining, setHintsRemaining] = useState(2);
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);
  const [animatedBackground, setAnimatedBackground] = useState(() => {
    const saved = localStorage.getItem('animatedBackground');
    return saved ? JSON.parse(saved) : true;
  });
  const [showCorrectWord, setShowCorrectWord] = useState(false);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('level', level.toString());
    localStorage.setItem('experience', experience.toString());
    localStorage.setItem('puzzlesSolved', puzzlesSolved.toString());
    localStorage.setItem('puzzlesSkipped', puzzlesSkipped.toString());
    localStorage.setItem('currentStreak', currentStreak.toString());
    localStorage.setItem('bestStreak', bestStreak.toString());
  }, [level, experience, puzzlesSolved, puzzlesSkipped, currentStreak, bestStreak]);
  
  useEffect(() => {
    const savedAnimatedBackground = localStorage.getItem('animatedBackground');
    if (savedAnimatedBackground) {
      setAnimatedBackground(JSON.parse(savedAnimatedBackground));
    }
  }, []);

  const resetGame = useCallback(() => {
    setCurrentWord(getRandomWord());
    setHintsRemaining(2);
    setShowAnimation(true);
    setShowCorrectWord(false);
    setTimeout(() => setShowAnimation(false), 500);
  }, []);

  const handleNewPuzzle = () => {
    resetGame();
    audioManager.playSound('click');
    
    toast({
      title: "New Puzzle Generated",
      description: "A new word challenge awaits you!"
    });
  };

  const handleSkipPuzzle = () => {
    setShowCorrectWord(true);
    setTimeout(() => {
      setPuzzlesSkipped(prev => prev + 1);
      setCurrentStreak(0);
      resetGame();
      audioManager.playSound('click');
      
      toast({
        title: "Puzzle Skipped",
        description: "Moving on to the next challenge."
      });
    }, 2000);
  };

  const handleUseHint = () => {
    if (hintsRemaining > 0) {
      setHintsRemaining(prev => prev - 1);
      audioManager.playSound('hint');
      
      toast({
        title: "Hint Used",
        description: `${hintsRemaining - 1} hints remaining.`
      });
    } else {
      toast({
        title: "No Hints Left",
        description: "You've used all your hints for this puzzle.",
        variant: "destructive"
      });
    }
  };

  const handlePuzzleComplete = (success: boolean) => {
    if (success) {
      // Calculate experience gained - bonus for solving with fewer hints used
      const hintBonus = (2 - (2 - hintsRemaining)) * 5;
      const expGained = 10 + hintBonus;
      
      // Update stats
      setPuzzlesSolved(prev => prev + 1);
      setExperience(prev => prev + expGained);
      setCurrentStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, currentStreak + 1));
      
      // Check if leveled up
      if ((experience + expGained) >= level * 100) {
        setLevel(prev => prev + 1);
        
        toast({
          title: `Level Up! You're now level ${level + 1}`,
          description: `Congratulations! You gained ${expGained} XP.`,
        });
        
        audioManager.playSound('win');
      } else {
        toast({
          title: "Puzzle Solved!",
          description: `You gained ${expGained} XP.`,
        });
        
        audioManager.playSound('correct');
      }
      
      // Get a new word after a short delay
      setTimeout(() => {
        resetGame();
      }, 2000);
    } else {
      setCurrentStreak(0);
      setShowCorrectWord(true);
      audioManager.playSound('wrong');
      
      toast({
        title: "Puzzle Failed",
        description: "Don't give up! Try another word.",
        variant: "destructive"
      });
      
      // Show the correct word for a moment then reset
      setTimeout(() => {
        resetGame();
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {animatedBackground && <ParticleBackground />}
      
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        <PageHeader />
        
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <StatsCard 
            level={level}
            experience={experience}
            puzzlesSolved={puzzlesSolved}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            puzzlesSkipped={puzzlesSkipped}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ActionButtons 
            onNewPuzzle={handleNewPuzzle}
            onSkipPuzzle={handleSkipPuzzle}
            onUseHint={handleUseHint}
            hintsRemaining={hintsRemaining}
          />
          
          <Card className="anime-card overflow-hidden shadow-xl border-2 border-wizard-purple/30 hover:border-wizard-purple/50 transition-all">
            <div className="relative">
              {showAnimation && (
                <div className="absolute inset-0 bg-wizard-purple/10 animate-pulse z-10 pointer-events-none" />
              )}
              <motion.div
                key={currentWord}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <WordPuzzle 
                  word={currentWord} 
                  onComplete={handlePuzzleComplete} 
                />
              </motion.div>
            </div>
            
            {showCorrectWord && (
              <motion.div 
                className="bg-wizard-purple/10 dark:bg-wizard-purple/20 p-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-foreground/80">
                  The correct word was:
                </p>
                <p className="text-xl font-bold font-manga tracking-wider bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text mt-1">
                  {currentWord.toUpperCase()}
                </p>
              </motion.div>
            )}
          </Card>
          
          <PuzzleFooter />
        </motion.div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default UnlimitedPage;


import { useState, useEffect, useCallback } from 'react';
import NavBar from '@/components/NavBar';
import WordPuzzle from '@/components/WordPuzzle';
import PageHeader from '@/components/unlimited/PageHeader';
import ActionButtons from '@/components/unlimited/ActionButtons';
import StatsCard from '@/components/unlimited/StatsCard';
import PuzzleFooter from '@/components/unlimited/PuzzleFooter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { getRandomWord } from '@/lib/wordBank';
import audioManager from '@/lib/audioManager';
import PageFooter from '@/components/PageFooter';
import ParticleBackground from '@/components/ParticleBackground';
import { Award, Trophy, Sparkles, Star, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);
  const [achievementCount, setAchievementCount] = useState(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved).length : 0;
  });

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

  const checkForAchievements = (solvedCount: number, streak: number) => {
    // Load existing achievements
    const savedAchievements = localStorage.getItem('achievements');
    const achievements = savedAchievements ? JSON.parse(savedAchievements) : [];
    
    let newAchievementEarned = null;
    
    if (solvedCount === 5 && !achievements.includes('novice_solver')) {
      newAchievementEarned = 'Novice Solver';
      achievements.push('novice_solver');
    } else if (solvedCount === 25 && !achievements.includes('word_apprentice')) {
      newAchievementEarned = 'Word Apprentice';
      achievements.push('word_apprentice');
    } else if (solvedCount === 50 && !achievements.includes('word_adept')) {
      newAchievementEarned = 'Word Adept';
      achievements.push('word_adept');
    } else if (solvedCount === 100 && !achievements.includes('word_master')) {
      newAchievementEarned = 'Word Master';
      achievements.push('word_master');
    } else if (streak === 7 && !achievements.includes('weekly_wizard')) {
      newAchievementEarned = 'Weekly Wizard';
      achievements.push('weekly_wizard');
    } else if (streak === 30 && !achievements.includes('monthly_magician')) {
      newAchievementEarned = 'Monthly Magician';
      achievements.push('monthly_magician');
    }
    
    if (newAchievementEarned) {
      setNewAchievement(newAchievementEarned);
      localStorage.setItem('achievements', JSON.stringify(achievements));
      setAchievementCount(achievements.length);
      
      setTimeout(() => {
        setNewAchievement(null);
      }, 5000);
    }
  };

  const handlePuzzleComplete = (success: boolean) => {
    if (success) {
      // Calculate experience gained - bonus for solving with fewer hints used
      const hintBonus = (2 - (2 - hintsRemaining)) * 5;
      const expGained = 10 + hintBonus;
      
      // Update stats
      const newPuzzlesSolved = puzzlesSolved + 1;
      const newExp = experience + expGained;
      const newStreak = currentStreak + 1;
      const newBestStreak = Math.max(bestStreak, newStreak);
      
      setPuzzlesSolved(newPuzzlesSolved);
      setExperience(newExp);
      setCurrentStreak(newStreak);
      setBestStreak(newBestStreak);
      
      // Check for achievements
      checkForAchievements(newPuzzlesSolved, newStreak);
      
      // Check if leveled up
      if (newExp >= level * 100) {
        setLevel(prev => prev + 1);
        setShowLevelUpAnimation(true);
        
        toast({
          title: `Level Up! You're now level ${level + 1}`,
          description: `Congratulations! You gained ${expGained} XP.`,
        });
        
        audioManager.playSound('win');
        
        setTimeout(() => {
          setShowLevelUpAnimation(false);
        }, 3000);
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {animatedBackground && <ParticleBackground />}
      
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-wizard-purple/10 via-transparent to-wizard-blue/10"></div>
      
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6 relative">
        {/* Level up animation */}
        {showLevelUpAnimation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div 
              className="bg-wizard-purple/20 backdrop-blur-lg p-8 rounded-2xl border border-wizard-purple/30 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotateY: [0, 360] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <motion.div 
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
              <h2 className="text-4xl font-manga bg-gradient-to-r from-wizard-yellow via-wizard-purple to-wizard-blue text-transparent bg-clip-text mb-4">LEVEL UP!</h2>
              <p className="text-xl font-bold text-white">You reached Level {level}!</p>
              <motion.div 
                className="mt-4 text-3xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉
              </motion.div>
            </motion.div>
          </div>
        )}
        
        {/* Achievement notification */}
        {newAchievement && (
          <motion.div 
            className="fixed bottom-10 right-10 bg-wizard-yellow/20 backdrop-blur-lg p-4 rounded-lg border border-wizard-yellow/30 max-w-xs z-50 shadow-xl"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="flex items-center mb-2">
              <Award className="h-6 w-6 text-wizard-yellow mr-2" />
              <h3 className="font-manga text-lg text-wizard-yellow">Achievement Unlocked!</h3>
            </div>
            <p className="font-bold text-white">{newAchievement}</p>
          </motion.div>
        )}
        
        <PageHeader />
        
        <motion.div 
          className="mb-8"
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
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
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentWord}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div className="absolute -top-2 -right-2 bg-wizard-purple/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-wizard-purple border border-wizard-purple/30 flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        <span>{achievementCount} Achievements</span>
                      </div>
                      
                      <WordPuzzle 
                        word={currentWord} 
                        onComplete={handlePuzzleComplete} 
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <AnimatePresence>
                  {showCorrectWord && (
                    <motion.div 
                      className="bg-wizard-purple/10 dark:bg-wizard-purple/20 p-4 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
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
                </AnimatePresence>
              </Card>
              
              <PuzzleFooter />
            </motion.div>
          </div>
          
          <div className="space-y-6">
            {/* Minigames Link Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Card className="anime-card p-6 border-wizard-pink/30 hover:border-wizard-pink/50 transition-all">
                <Link to="/minigames" className="block">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5 text-wizard-pink" />
                      <h3 className="text-xl font-manga bg-gradient-to-r from-wizard-pink to-wizard-purple text-transparent bg-clip-text">
                        Play Minigames
                      </h3>
                    </div>
                    <div className="bg-wizard-pink/10 px-3 py-1 rounded-full text-xs text-wizard-pink flex items-center">
                      <Trophy className="h-3 w-3 mr-1" />
                      Earn XP
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 mb-3">
                    Challenge yourself with anime-themed word games and earn XP to level up!
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-wizard-purple/5 p-2 rounded-md text-center text-xs">
                      Word Scramble
                    </div>
                    <div className="bg-wizard-pink/5 p-2 rounded-md text-center text-xs">
                      Speed Type
                    </div>
                    <div className="bg-wizard-blue/5 p-2 rounded-md text-center text-xs">
                      Memory Match
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Button
                      className="bg-wizard-pink hover:bg-wizard-pink/90 text-white"
                      onClick={(e) => {
                        audioManager.playSound('click');
                        // Let link handle navigation
                      }}
                    >
                      Play Now
                    </Button>
                  </div>
                </Link>
              </Card>
            </motion.div>
            
            {/* Word Wizards Leaderboard */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="anime-card border-wizard-yellow/30 dark:border-wizard-yellow/20">
                <div className="p-4">
                  <h2 className="text-lg font-manga text-center mb-4 bg-gradient-to-r from-wizard-yellow to-wizard-blue text-transparent bg-clip-text">
                    Word Wizards Hall of Fame
                  </h2>
                  
                  <div className="space-y-3 relative">
                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-wizard-yellow/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-wizard-blue/10 rounded-full blur-2xl"></div>
                    
                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-wizard-yellow/5 to-wizard-yellow/10 rounded-md border border-wizard-yellow/10">
                      <div className="flex items-center gap-2">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1.5 rounded-full">
                          <Trophy className="h-3 w-3 text-wizard-yellow" />
                        </div>
                        <span className="font-medium text-sm">Daily Streak</span>
                      </div>
                      <span className="font-bold text-lg">{bestStreak}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-wizard-purple/5 to-wizard-purple/10 rounded-md border border-wizard-purple/10">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full">
                          <Star className="h-3 w-3 text-wizard-purple" />
                        </div>
                        <span className="font-medium text-sm">Words Solved</span>
                      </div>
                      <span className="font-bold text-lg">{puzzlesSolved}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-wizard-blue/5 to-wizard-blue/10 rounded-md border border-wizard-blue/10">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                          <Award className="h-3 w-3 text-wizard-blue" />
                        </div>
                        <span className="font-medium text-sm">Level</span>
                      </div>
                      <span className="font-bold text-lg">{level}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* More game details (coming soon) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="anime-card p-4 border-wizard-blue/30">
                <div className="text-center">
                  <Sparkles className="h-5 w-5 mx-auto mb-2 text-wizard-blue" />
                  <h3 className="font-manga text-lg mb-2">Coming Soon</h3>
                  <div className="text-sm text-foreground/70">
                    <p>• Word Battles</p>
                    <p>• Custom Word Lists</p>
                    <p>• Friend Challenges</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <PageFooter />
      
      {/* Decorative elements */}
      <div className="fixed top-1/2 -left-20 w-40 h-40 bg-wizard-purple/5 rounded-full blur-3xl"></div>
      <div className="fixed top-1/3 -right-20 w-40 h-40 bg-wizard-blue/5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default UnlimitedPage;

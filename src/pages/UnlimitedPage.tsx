import NavBar from '@/components/NavBar';
import WordPuzzle from '@/components/WordPuzzle';
import { Button } from "@/components/ui/button";
import { Shuffle, SkipForward, Lightbulb, Sparkles, Trophy, Rocket } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const UnlimitedPage = () => {
  const [puzzleKey, setPuzzleKey] = useState(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [puzzlesSkipped, setPuzzlesSkipped] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [experience, setExperience] = useState(0);
  const { toast } = useToast();
  const puzzleRef = useRef<HTMLDivElement>(null);
  const levelUpSoundRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const savedStats = localStorage.getItem('unlimitedStats');
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        setPuzzlesSolved(stats.puzzlesSolved || 0);
        setPuzzlesSkipped(stats.puzzlesSkipped || 0);
        setCurrentStreak(stats.currentStreak || 0);
        setBestStreak(stats.bestStreak || 0);
        setExperience(stats.experience || 0);
      } catch (e) {
        console.error("Error parsing saved stats:", e);
      }
    }
    
    levelUpSoundRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3");
    levelUpSoundRef.current.volume = 0.3;
  }, []);
  
  useEffect(() => {
    const stats = {
      puzzlesSolved,
      puzzlesSkipped,
      currentStreak,
      bestStreak,
      experience
    };
    localStorage.setItem('unlimitedStats', JSON.stringify(stats));
  }, [puzzlesSolved, puzzlesSkipped, currentStreak, bestStreak, experience]);
  
  const handlePuzzleComplete = (success: boolean) => {
    if (success) {
      const xpGained = 50 - (hintsUsed * 10);
      const oldLevel = Math.floor(experience / 100) + 1;
      const newExperience = experience + xpGained;
      const newLevel = Math.floor(newExperience / 100) + 1;
      
      setPuzzlesSolved(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, currentStreak + 1));
      setExperience(newExperience);
      
      if (newLevel > oldLevel) {
        if (levelUpSoundRef.current) {
          levelUpSoundRef.current.play().catch(e => console.log("Failed to play level up sound", e));
        }
        
        toast({
          title: "🎊 Level Up! 🎊",
          description: `Congratulations! You've reached level ${newLevel}!`,
          variant: "default",
        });
      }
      
      toast({
        title: "Puzzle Solved! 🎉",
        description: `You earned ${xpGained} XP. Current streak: ${currentStreak + 1}`,
        variant: "default",
      });
    } else {
      setCurrentStreak(0);
      toast({
        title: "Better luck next time!",
        description: "Your streak has been reset. Try a new puzzle!",
        variant: "destructive",
      });
    }
  };
  
  const handleNewPuzzle = () => {
    setPuzzleKey(prev => prev + 1);
    setHintsUsed(0);
    toast({
      title: "New Puzzle Generated",
      description: "Let's see if you can solve this one!",
      variant: "default",
    });
    
    if (puzzleRef.current) {
      puzzleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleSkipPuzzle = () => {
    setPuzzleKey(prev => prev + 1);
    setPuzzlesSkipped(prev => prev + 1);
    setCurrentStreak(0);
    setHintsUsed(0);
    toast({
      title: "Puzzle Skipped",
      description: "Moving on to the next challenge!",
      variant: "default",
    });
    
    if (puzzleRef.current) {
      puzzleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleUseHint = () => {
    setHintsUsed(prev => prev + 1);
    toast({
      title: "Hint Used",
      description: "A letter has been revealed!",
      variant: "default",
    });
  };

  const level = Math.floor(experience / 100) + 1;
  const levelProgress = (experience % 100);
  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800"></div>
      <div className="fixed inset-0 -z-10 opacity-50">
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-wizard-purple/20 dark:bg-wizard-purple/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `scale(${Math.random() * 3 + 0.5})`,
                opacity: `${Math.random() * 0.5 + 0.2}`,
                animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite, 
                          pulse ${Math.random() * 5 + 2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        <motion.section 
          className="py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-manga font-bold text-center mb-6 bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
            <Sparkles className="inline-block w-8 h-8 mr-2 animate-pulse" />
            Unlimited Play Mode
            <Sparkles className="inline-block w-8 h-8 ml-2 animate-pulse" />
          </h1>
          <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-8">
            Play as many word puzzles as you want! Skip, get hints, or generate new puzzles whenever you like.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="max-w-md mx-auto mb-8 overflow-hidden anime-card border-2 border-wizard-purple/20 shadow-lg hover:shadow-xl transition-all dark:bg-gray-800/80 backdrop-blur-md">
              <div className="bg-gradient-to-r from-wizard-purple/10 to-wizard-blue/10 p-4 dark:from-wizard-purple/20 dark:to-wizard-blue/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-wizard-purple to-wizard-blue flex items-center justify-center text-white font-bold">
                      {level}
                    </div>
                    <div>
                      <h3 className="font-manga font-bold">Word Wizard</h3>
                      <p className="text-xs text-foreground/70">Level {level}</p>
                    </div>
                  </div>
                  <div>
                    <Trophy className="h-6 w-6 text-wizard-yellow animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>XP: {experience}</span>
                    <span>Next: {(Math.floor(experience / 100) + 1) * 100}</span>
                  </div>
                  <Progress value={levelProgress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-2 rounded-lg bg-wizard-purple/5 dark:bg-wizard-purple/10">
                    <p className="text-2xl font-bold text-wizard-purple">{puzzlesSolved}</p>
                    <p className="text-xs text-foreground/70">Puzzles Solved</p>
                  </div>
                  <div className="p-2 rounded-lg bg-wizard-blue/5 dark:bg-wizard-blue/10">
                    <p className="text-2xl font-bold text-wizard-blue">{currentStreak}</p>
                    <p className="text-xs text-foreground/70">Current Streak</p>
                  </div>
                  <div className="p-2 rounded-lg bg-wizard-yellow/5 dark:bg-wizard-yellow/10">
                    <p className="text-2xl font-bold text-wizard-yellow">{bestStreak}</p>
                    <p className="text-xs text-foreground/70">Best Streak</p>
                  </div>
                  <div className="p-2 rounded-lg bg-wizard-pink/5 dark:bg-wizard-pink/10">
                    <p className="text-2xl font-bold text-wizard-pink">{puzzlesSkipped}</p>
                    <p className="text-xs text-foreground/70">Puzzles Skipped</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Button
              variant="outline"
              className="gap-2 bg-white/50 dark:bg-background/50 border-2 border-wizard-purple/30 hover:border-wizard-purple/50 shadow-md hover:shadow-xl transition-all"
              onClick={handleNewPuzzle}
            >
              <Shuffle className="h-4 w-4 text-wizard-purple" />
              New Puzzle
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-white/50 dark:bg-background/50 border-2 border-wizard-blue/30 hover:border-wizard-blue/50 shadow-md hover:shadow-xl transition-all"
              onClick={handleSkipPuzzle}
            >
              <SkipForward className="h-4 w-4 text-wizard-blue" />
              Skip Puzzle
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-white/50 dark:bg-background/50 border-2 border-wizard-yellow/30 hover:border-wizard-yellow/50 shadow-md hover:shadow-xl transition-all"
              onClick={handleUseHint}
              disabled={hintsUsed >= 3}
            >
              <Lightbulb className="h-4 w-4 text-wizard-yellow" />
              Use Hint ({3 - hintsUsed} left)
            </Button>
          </motion.div>
          
          <div className="max-w-md mx-auto" ref={puzzleRef}>
            <motion.div
              key={puzzleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WordPuzzle 
                key={puzzleKey} 
                useRandomWord={true} 
                onComplete={handlePuzzleComplete}
                maxAttempts={6}
              />
            </motion.div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-foreground/50 text-sm italic">
              <Rocket className="inline-block h-4 w-4 mr-1" />
              Hint: The more puzzles you solve without hints, the more XP you'll earn!
            </p>
          </div>
        </motion.section>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) scale(var(--size)); }
          25% { transform: translateY(-20px) translateX(10px) scale(var(--size)); }
          50% { transform: translateY(0) translateX(20px) scale(var(--size)); }
          75% { transform: translateY(20px) translateX(10px) scale(var(--size)); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: var(--opacity); }
          50% { opacity: calc(var(--opacity) * 1.5); }
        }
      `}</style>
    </div>
  );
};

export default UnlimitedPage;

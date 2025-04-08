
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import NavBar from '@/components/NavBar';
import WordPuzzle from '@/components/WordPuzzle';
import BackgroundEffects from "@/components/unlimited/BackgroundEffects";
import PageHeader from "@/components/unlimited/PageHeader";
import StatsCard from "@/components/unlimited/StatsCard";
import ActionButtons from "@/components/unlimited/ActionButtons";
import PuzzleFooter from "@/components/unlimited/PuzzleFooter";

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
  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <BackgroundEffects />
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        <motion.section 
          className="py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
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
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <ActionButtons 
              onNewPuzzle={handleNewPuzzle}
              onSkipPuzzle={handleSkipPuzzle}
              onUseHint={handleUseHint}
              hintsRemaining={3 - hintsUsed}
            />
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
          
          <PuzzleFooter />
        </motion.section>
      </main>
    </div>
  );
};

export default UnlimitedPage;

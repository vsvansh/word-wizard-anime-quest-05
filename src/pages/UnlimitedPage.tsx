
import NavBar from '@/components/NavBar';
import WordPuzzle from '@/components/WordPuzzle';
import { Button } from "@/components/ui/button";
import { Shuffle, SkipForward, Lightbulb, Sparkles, Trophy, Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

const UnlimitedPage = () => {
  const [puzzleKey, setPuzzleKey] = useState(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [puzzlesSkipped, setPuzzlesSkipped] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [experience, setExperience] = useState(0);
  const { toast } = useToast();
  
  // Load stats from localStorage on component mount
  useEffect(() => {
    const savedStats = localStorage.getItem('unlimitedStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setPuzzlesSolved(stats.puzzlesSolved || 0);
      setPuzzlesSkipped(stats.puzzlesSkipped || 0);
      setCurrentStreak(stats.currentStreak || 0);
      setBestStreak(stats.bestStreak || 0);
      setExperience(stats.experience || 0);
    }
  }, []);
  
  // Save stats to localStorage whenever they change
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
      setPuzzlesSolved(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, currentStreak + 1));
      setExperience(prev => prev + 50 - (hintsUsed * 10));
      
      toast({
        title: "Puzzle Solved! 🎉",
        description: `You earned ${50 - (hintsUsed * 10)} XP. Current streak: ${currentStreak + 1}`,
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
  };
  
  const handleUseHint = () => {
    setHintsUsed(prev => prev + 1);
    toast({
      title: "Hint Used",
      description: "A letter has been revealed!",
      variant: "default",
    });
  };

  // Calculate level based on experience
  const level = Math.floor(experience / 100) + 1;
  const levelProgress = (experience % 100);
  
  return (
    <div className="min-h-screen bg-background anime-bg-pattern">
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        <section className="py-6">
          <h1 className="text-3xl md:text-4xl font-manga font-bold text-center mb-6 bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
            <Sparkles className="inline-block w-8 h-8 mr-2 animate-pulse" />
            Unlimited Play Mode
            <Sparkles className="inline-block w-8 h-8 ml-2 animate-pulse" />
          </h1>
          <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-8">
            Play as many word puzzles as you want! Skip, get hints, or generate new puzzles whenever you like.
          </p>
          
          {/* Player Stats Card */}
          <Card className="max-w-md mx-auto mb-8 overflow-hidden anime-card border-2 border-wizard-purple/20">
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
                  <Trophy className="h-6 w-6 text-wizard-yellow" />
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
                <div>
                  <p className="text-2xl font-bold text-wizard-purple">{puzzlesSolved}</p>
                  <p className="text-xs text-foreground/70">Puzzles Solved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-wizard-blue">{currentStreak}</p>
                  <p className="text-xs text-foreground/70">Current Streak</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-wizard-yellow">{bestStreak}</p>
                  <p className="text-xs text-foreground/70">Best Streak</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-wizard-pink">{puzzlesSkipped}</p>
                  <p className="text-xs text-foreground/70">Puzzles Skipped</p>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Button variant="outline" className="gap-2 bg-white/50 dark:bg-background/50 border-2 border-wizard-purple/30 hover:border-wizard-purple/50 shadow-md hover:shadow-xl transition-all" onClick={handleNewPuzzle}>
              <Shuffle className="h-4 w-4 text-wizard-purple" />
              New Puzzle
            </Button>
            <Button variant="outline" className="gap-2 bg-white/50 dark:bg-background/50 border-2 border-wizard-blue/30 hover:border-wizard-blue/50 shadow-md hover:shadow-xl transition-all" onClick={handleSkipPuzzle}>
              <SkipForward className="h-4 w-4 text-wizard-blue" />
              Skip Puzzle
            </Button>
            <Button variant="outline" className="gap-2 bg-white/50 dark:bg-background/50 border-2 border-wizard-yellow/30 hover:border-wizard-yellow/50 shadow-md hover:shadow-xl transition-all" onClick={handleUseHint}>
              <Lightbulb className="h-4 w-4 text-wizard-yellow" />
              Use Hint ({3 - hintsUsed} left)
            </Button>
          </div>
          
          <div className="max-w-md mx-auto">
            <WordPuzzle 
              key={puzzleKey} 
              useRandomWord={true} 
              onComplete={handlePuzzleComplete}
            />
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-foreground/50 text-sm italic">
              <Rocket className="inline-block h-4 w-4 mr-1" />
              Hint: The more puzzles you solve without hints, the more XP you'll earn!
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UnlimitedPage;


import NavBar from '@/components/NavBar';
import WordPuzzle from '@/components/WordPuzzle';
import { Button } from "@/components/ui/button";
import { Shuffle, SkipForward, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const UnlimitedPage = () => {
  const [puzzleKey, setPuzzleKey] = useState(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const { toast } = useToast();
  
  const handleNewPuzzle = () => {
    setPuzzleKey(prev => prev + 1);
    toast({
      title: "New Puzzle Generated",
      description: "Let's see if you can solve this one!",
      variant: "default",
    });
  };
  
  const handleSkipPuzzle = () => {
    setPuzzleKey(prev => prev + 1);
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
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        <section className="py-10">
          <h1 className="text-3xl md:text-4xl font-manga font-bold text-center mb-8 bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
            Unlimited Play Mode
          </h1>
          <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-6">
            Play as many word puzzles as you want! Skip, get hints, or generate new puzzles whenever you like.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Button variant="outline" className="gap-2" onClick={handleNewPuzzle}>
              <Shuffle className="h-4 w-4" />
              New Puzzle
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleSkipPuzzle}>
              <SkipForward className="h-4 w-4" />
              Skip Puzzle
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleUseHint}>
              <Lightbulb className="h-4 w-4" />
              Use Hint ({3 - hintsUsed} left)
            </Button>
          </div>
          
          <div className="max-w-md mx-auto">
            <WordPuzzle key={puzzleKey} useRandomWord={true} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default UnlimitedPage;

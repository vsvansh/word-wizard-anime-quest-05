
import { Button } from "@/components/ui/button";
import { Shuffle, SkipForward, Lightbulb } from "lucide-react";

interface ActionButtonsProps {
  onNewPuzzle: () => void;
  onSkipPuzzle: () => void;
  onUseHint: () => void;
  hintsRemaining: number;
}

const ActionButtons = ({ 
  onNewPuzzle, 
  onSkipPuzzle, 
  onUseHint, 
  hintsRemaining 
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      <Button
        variant="outline"
        className="gap-2 bg-white/50 dark:bg-background/50 border-2 border-wizard-purple/30 hover:border-wizard-purple/50 shadow-md hover:shadow-xl transition-all"
        onClick={onNewPuzzle}
      >
        <Shuffle className="h-4 w-4 text-wizard-purple" />
        New Puzzle
      </Button>
      <Button
        variant="outline"
        className="gap-2 bg-white/50 dark:bg-background/50 border-2 border-wizard-blue/30 hover:border-wizard-blue/50 shadow-md hover:shadow-xl transition-all"
        onClick={onSkipPuzzle}
      >
        <SkipForward className="h-4 w-4 text-wizard-blue" />
        Skip Puzzle
      </Button>
      <Button
        variant="outline"
        className="gap-2 bg-white/50 dark:bg-background/50 border-2 border-wizard-yellow/30 hover:border-wizard-yellow/50 shadow-md hover:shadow-xl transition-all"
        onClick={onUseHint}
        disabled={hintsRemaining <= 0}
      >
        <Lightbulb className="h-4 w-4 text-wizard-yellow" />
        Use Hint ({hintsRemaining} left)
      </Button>
    </div>
  );
};

export default ActionButtons;

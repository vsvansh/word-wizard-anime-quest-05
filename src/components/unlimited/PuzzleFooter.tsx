
import { Rocket } from "lucide-react";

const PuzzleFooter = () => {
  return (
    <div className="mt-12 text-center">
      <p className="text-foreground/50 text-sm italic">
        <Rocket className="inline-block h-4 w-4 mr-1" />
        Hint: The more puzzles you solve without hints, the more XP you'll earn!
      </p>
    </div>
  );
};

export default PuzzleFooter;

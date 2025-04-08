
import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsCardProps {
  level: number;
  experience: number;
  puzzlesSolved: number;
  currentStreak: number;
  bestStreak: number;
  puzzlesSkipped: number;
}

const StatsCard = ({
  level,
  experience,
  puzzlesSolved,
  currentStreak,
  bestStreak,
  puzzlesSkipped
}: StatsCardProps) => {
  const levelProgress = (experience % 100);
  
  return (
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
  );
};

export default StatsCard;


import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Gamepad2, Trophy, Sparkles, Zap } from 'lucide-react';
import WordScrambleGame from '@/components/WordScrambleGame';
import audioManager from '@/lib/audioManager';
import { motion } from 'framer-motion';

interface MinigamesSectionProps {
  onXpEarned?: (amount: number) => void;
}

const MinigamesSection: React.FC<MinigamesSectionProps> = ({ onXpEarned }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleGameComplete = (score: number, xpMultiplier = 0.5) => {
    // Convert score to XP (half of score by default)
    const xpEarned = Math.round(score * xpMultiplier);
    
    toast({
      title: "Minigame Completed!",
      description: `You earned ${xpEarned} XP from your score of ${score}`,
    });
    
    if (onXpEarned) {
      onXpEarned(xpEarned);
    }
    
    // Save to localStorage
    const currentXp = localStorage.getItem('experience');
    const newXp = (currentXp ? parseInt(currentXp) : 0) + xpEarned;
    localStorage.setItem('experience', newXp.toString());
    
    // Reset game selection
    setActiveGame(null);
    audioManager.playSound('win');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="anime-card p-6 border-wizard-pink/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Gamepad2 className="h-5 w-5 mr-2 text-wizard-pink" />
            <h3 className="text-xl font-manga bg-gradient-to-r from-wizard-pink to-wizard-purple text-transparent bg-clip-text">
              Word Wizard Minigames
            </h3>
          </div>
          <div className="bg-wizard-pink/10 px-3 py-1 rounded-full text-xs text-wizard-pink flex items-center">
            <Trophy className="h-3 w-3 mr-1" />
            Earn XP
          </div>
        </div>
        
        {activeGame ? (
          <>
            {activeGame === 'scramble' && (
              <WordScrambleGame 
                onComplete={(score) => handleGameComplete(score, 0.5)} 
                difficulty="normal"
                timeLimit={60}
              />
            )}
            
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveGame(null)}
                className="text-wizard-purple border-wizard-purple hover:bg-wizard-purple/10"
              >
                Back to Minigames
              </Button>
            </div>
          </>
        ) : (
          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="all">All Games</TabsTrigger>
            </TabsList>
            
            <TabsContent value="featured" className="space-y-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-wizard-blue/10 to-wizard-purple/10 rounded-lg p-4 border border-wizard-purple/20 hover:border-wizard-purple/40 transition-all cursor-pointer"
                  onClick={() => {
                    setActiveGame('scramble');
                    audioManager.playSound('click');
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-manga text-lg">Word Scramble</h4>
                    <div className="bg-wizard-purple/20 text-wizard-purple text-xs px-2 py-0.5 rounded-full">
                      Featured
                    </div>
                  </div>
                  <p className="text-sm text-foreground/60 mb-3">Unscramble anime-themed words as fast as you can!</p>
                  <div className="flex items-center text-xs text-wizard-purple">
                    <Zap className="h-3 w-3 mr-1" />
                    Earn XP based on score
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-wizard-yellow/10 to-wizard-pink/10 rounded-lg p-4 border border-wizard-pink/20 hover:border-wizard-pink/40 transition-all cursor-pointer opacity-50"
                  onClick={() => toast({
                    title: "Coming Soon!",
                    description: "This minigame will be available in the next update."
                  })}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-manga text-lg">Word Chain</h4>
                    <div className="bg-wizard-yellow/20 text-wizard-yellow text-xs px-2 py-0.5 rounded-full">
                      Coming Soon
                    </div>
                  </div>
                  <p className="text-sm text-foreground/60 mb-3">Create word chains where each word starts with the last letter of the previous word.</p>
                  <div className="flex items-center text-xs text-wizard-yellow">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Coming in the next update
                  </div>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-wizard-blue/10 to-wizard-purple/10 rounded-lg p-3 border border-wizard-purple/20 hover:border-wizard-purple/40 transition-all cursor-pointer"
                  onClick={() => {
                    setActiveGame('scramble');
                    audioManager.playSound('click');
                  }}
                >
                  <h4 className="font-manga">Word Scramble</h4>
                  <p className="text-xs text-foreground/60">Unscramble words</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-wizard-yellow/10 to-wizard-pink/10 rounded-lg p-3 border border-wizard-pink/20 hover:border-wizard-pink/40 transition-all cursor-pointer opacity-50"
                >
                  <h4 className="font-manga">Word Chain</h4>
                  <p className="text-xs text-foreground/60">Coming soon</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-wizard-green/10 to-wizard-blue/10 rounded-lg p-3 border border-wizard-blue/20 hover:border-wizard-blue/40 transition-all cursor-pointer opacity-50"
                >
                  <h4 className="font-manga">Speed Type</h4>
                  <p className="text-xs text-foreground/60">Coming soon</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-wizard-purple/10 to-wizard-pink/10 rounded-lg p-3 border border-wizard-pink/20 hover:border-wizard-pink/40 transition-all cursor-pointer opacity-50"
                >
                  <h4 className="font-manga">Hangman</h4>
                  <p className="text-xs text-foreground/60">Coming soon</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-wizard-blue/10 to-wizard-green/10 rounded-lg p-3 border border-wizard-green/20 hover:border-wizard-green/40 transition-all cursor-pointer opacity-50"
                >
                  <h4 className="font-manga">Word Search</h4>
                  <p className="text-xs text-foreground/60">Coming soon</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-wizard-yellow/10 to-wizard-green/10 rounded-lg p-3 border border-wizard-yellow/20 hover:border-wizard-yellow/40 transition-all cursor-pointer opacity-50"
                >
                  <h4 className="font-manga">Crossword</h4>
                  <p className="text-xs text-foreground/60">Coming soon</p>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </Card>
    </motion.div>
  );
};

export default MinigamesSection;


import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WordPuzzle from './WordPuzzle';
import CountdownTimer from './CountdownTimer';
import AnimeCharacter from './AnimeCharacter';
import { Trophy, Clock, Calendar, Star, Book, Award, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import audioManager from '@/lib/audioManager';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

// Sample word list - in a real app, this would come from an API
const wordList = [
  'anime', 'manga', 'ninja', 'otaku', 'mecha', 
  'sushi', 'kanji', 'bento', 'sensei', 'cosplay',
  'kawaii', 'chibi', 'shonen', 'shoujo', 'sakura',
  'katana', 'kimono', 'shogun', 'samurai', 'geisha',
  'haiku', 'ramen', 'karate', 'judo', 'sumo',
  'futon', 'bonsai', 'origami', 'tatami', 'yakuza'
];

// Sample word definitions
const wordDefinitions: Record<string, string> = {
  'anime': 'Japanese animation characterized by colorful artwork and fantastical themes',
  'manga': 'Japanese comic books or graphic novels with a distinctive art style',
  'ninja': 'A covert agent or mercenary in feudal Japan skilled in unorthodox warfare',
  'otaku': 'A person with consuming interests in anime, manga, and other Japanese pop culture',
  'mecha': 'A genre of science fiction focusing on robots or machines controlled by people',
  'sushi': 'A Japanese dish of prepared vinegared rice with various ingredients, especially seafood',
  'kanji': 'A system of Japanese writing using Chinese characters',
  'bento': 'A single-portion take-out or home-packed meal common in Japanese cuisine',
  'sensei': 'A teacher or instructor, usually in martial arts, fine arts, or other skills',
  'cosplay': 'The practice of dressing up as a character from a movie, book, or video game',
  'kawaii': 'The quality of being cute, adorable, or lovable, a prominent aspect of Japanese culture',
  'chibi': 'A small, childlike character style used in anime and manga',
  'shonen': 'Manga marketed toward teenage boys, typically featuring action and adventure',
  'shoujo': 'Manga aimed at young teenage girls with themes of romance and relationships',
  'sakura': 'Cherry blossoms, symbolic in Japanese culture, representing the transience of life'
};

interface DailyChallengeStats {
  streak: number;
  bestStreak: number;
  totalSolved: number;
  lastCompletedDate: string | null;
  completed: boolean;
  success: boolean;
  hintsUsed: number;
  achievements: string[];
}

const DailyChallenge = () => {
  const [dailyWord, setDailyWord] = useState('');
  const [completed, setCompleted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [stats, setStats] = useState<DailyChallengeStats>({
    streak: 0,
    bestStreak: 0,
    totalSolved: 0,
    lastCompletedDate: null,
    completed: false,
    success: false,
    hintsUsed: 0,
    achievements: []
  });
  const [showAchievement, setShowAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const { toast } = useToast();
  const definitionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Get today's date as a seed for the random word
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // Use a simple hash function to get a consistent index for the day
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Get positive index within the wordList length
    const index = Math.abs(hash) % wordList.length;
    setDailyWord(wordList[index]);
    
    // Load saved stats
    loadStats();
    
    // Add entrance animation
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  }, []);
  
  const loadStats = () => {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // Check if today's challenge was already completed
    const storedData = localStorage.getItem('dailyChallenge');
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data.date === dateString) {
        setCompleted(data.completed);
        setSuccess(data.success);
      } else {
        // New day, reset completion status
        localStorage.removeItem('dailyChallenge');
      }
    }
    
    // Load streak and other stats
    const storedStats = localStorage.getItem('dailyChallengeStats');
    if (storedStats) {
      const parsedStats: DailyChallengeStats = JSON.parse(storedStats);
      setStats(parsedStats);
      
      // Check if we need to reset streak (missed a day)
      if (parsedStats.lastCompletedDate) {
        const lastDate = new Date(parsedStats.lastCompletedDate);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // If last completed is earlier than yesterday, reset streak
        if (lastDate < yesterday && dateString !== parsedStats.lastCompletedDate) {
          setStats(prev => ({
            ...prev,
            streak: 0
          }));
          
          // Save reset streak
          localStorage.setItem('dailyChallengeStats', JSON.stringify({
            ...parsedStats,
            streak: 0
          }));
          
          toast({
            title: "Streak Reset",
            description: "You missed a day! Your streak has been reset.",
            variant: "destructive"
          });
        }
      }
    }
  };
  
  const handleComplete = (success: boolean) => {
    setCompleted(true);
    setSuccess(success);
    
    // Store completion in localStorage
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    localStorage.setItem('dailyChallenge', JSON.stringify({
      date: dateString,
      completed: true,
      success
    }));
    
    // Update stats
    let newStreak = stats.streak;
    let newBestStreak = stats.bestStreak;
    let newTotalSolved = stats.totalSolved;
    let achievements = [...stats.achievements];
    
    if (success) {
      newStreak += 1;
      newTotalSolved += 1;
      
      if (newStreak > newBestStreak) {
        newBestStreak = newStreak;
      }
      
      // Check for achievements
      if (newStreak === 3 && !achievements.includes('3-Day Streak')) {
        achievements.push('3-Day Streak');
        setNewAchievement('3-Day Streak');
        setShowAchievement(true);
      } else if (newStreak === 7 && !achievements.includes('7-Day Streak')) {
        achievements.push('7-Day Streak');
        setNewAchievement('Weekly Wizard');
        setShowAchievement(true);
      } else if (newStreak === 30 && !achievements.includes('30-Day Streak')) {
        achievements.push('30-Day Streak');
        setNewAchievement('Word Master');
        setShowAchievement(true);
      } else if (newTotalSolved === 10 && !achievements.includes('10 Puzzles')) {
        achievements.push('10 Puzzles');
        setNewAchievement('Word Apprentice');
        setShowAchievement(true);
      }
      
      audioManager.playSound('win');
    } else {
      newStreak = 0;
      audioManager.playSound('wrong');
    }
    
    // Save updated stats
    const newStats = {
      streak: newStreak,
      bestStreak: newBestStreak,
      totalSolved: newTotalSolved,
      lastCompletedDate: dateString,
      completed: true,
      success,
      hintsUsed: stats.hintsUsed,
      achievements
    };
    
    setStats(newStats);
    localStorage.setItem('dailyChallengeStats', JSON.stringify(newStats));
    
    // Add experience for daily challenge
    if (success) {
      // Update experience
      const savedExp = localStorage.getItem('experience');
      const currentExp = savedExp ? parseInt(savedExp) : 0;
      const streakBonus = Math.min(newStreak * 2, 20); // Bonus capped at 20 XP
      const newExp = currentExp + 20 + streakBonus; // Base 20 XP + streak bonus
      localStorage.setItem('experience', newExp.toString());
      
      // Update level if needed
      const savedLevel = localStorage.getItem('level');
      const currentLevel = savedLevel ? parseInt(savedLevel) : 1;
      const newLevel = Math.floor(newExp / 100) + 1;
      if (newLevel > currentLevel) {
        localStorage.setItem('level', newLevel.toString());
        
        toast({
          title: `Level Up! You're now level ${newLevel}`,
          description: `Keep solving daily challenges to earn more XP!`,
        });
      }
      
      // Show XP toast
      toast({
        title: `+${20 + streakBonus} XP`,
        description: `Base: 20 XP + Streak Bonus: ${streakBonus} XP`,
      });
    }
    
    // Show word definition after a short delay
    setTimeout(() => {
      setShowDefinition(true);
      if (definitionRef.current) {
        definitionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1500);
  };
  
  // Calculate the time until the next day
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);
  
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`anime-card w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-all duration-300 ${showAnimation ? 'ring-2 ring-wizard-purple ring-offset-2 dark:ring-offset-gray-900' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-manga bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
              Daily Challenge
            </CardTitle>
            <div className="flex items-center bg-wizard-purple/10 px-3 py-1 rounded-full">
              <Flame className="w-4 h-4 text-wizard-purple mr-1" />
              <span className="text-sm font-bold text-wizard-purple">Streak: {stats.streak}</span>
            </div>
          </div>
          <CardDescription className="text-muted-foreground">
            Solve today's word puzzle!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completed ? (
            <div className="text-center py-6">
              <div className="mb-4">
                <AnimeCharacter mood={success ? 'excited' : 'confused'} />
              </div>
              <motion.h3 
                className="text-xl font-bold mb-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {success ? 'Challenge Complete! 🎉' : 'Better luck tomorrow! 💪'}
              </motion.h3>
              <motion.p 
                className="text-muted-foreground mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {success 
                  ? 'Excellent work, Word Wizard!' 
                  : `The word was: ${dailyWord.toUpperCase()}`}
              </motion.p>
              
              <motion.div 
                className="flex items-center justify-center gap-2 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Calendar className="w-5 h-5 text-wizard-green" />
                <span className="text-sm font-medium">Completed: {new Date(stats.lastCompletedDate || '').toLocaleDateString()}</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center gap-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Trophy className="w-5 h-5 text-wizard-yellow" />
                <span className="text-sm font-medium">Best Streak: {stats.bestStreak}</span>
              </motion.div>
              
              {showAchievement && (
                <motion.div
                  className="mb-4 bg-wizard-yellow/20 p-3 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Award className="w-6 h-6 text-wizard-yellow mx-auto mb-2" />
                  <p className="font-bold text-wizard-yellow">New Achievement!</p>
                  <p className="text-sm">{newAchievement}</p>
                </motion.div>
              )}
              
              {showDefinition && (
                <motion.div 
                  ref={definitionRef}
                  className="mt-4 mb-4 bg-wizard-blue/10 p-4 rounded-lg text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="flex items-center mb-2">
                    <Book className="w-5 h-5 text-wizard-blue mr-2" />
                    <h4 className="font-bold text-wizard-blue">Word Detail</h4>
                  </div>
                  <p className="text-sm mb-1"><span className="font-bold">{dailyWord.toUpperCase()}</span></p>
                  <p className="text-xs text-foreground/70">
                    {wordDefinitions[dailyWord] || "A Japanese cultural term or concept."}
                  </p>
                </motion.div>
              )}
              
              <motion.div 
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <Clock className="w-5 h-5 text-wizard-purple mr-2" />
                <span className="text-sm font-medium">Next challenge in:</span>
              </motion.div>
              
              <motion.div 
                className="mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <CountdownTimer targetTime={nextDay} />
              </motion.div>
              
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <Button
                  variant="outline"
                  className="bg-wizard-purple/10 border-wizard-purple text-wizard-purple hover:bg-wizard-purple/20"
                  onClick={() => {
                    navigator.clipboard.writeText(`🔮 Word Wizard Daily Challenge 🔮\nI got ${success ? 'it!' : 'stumped.'}\nCurrent Streak: ${stats.streak}\nBest Streak: ${stats.bestStreak}\nPlay at: wordwizard.app`);
                    toast({
                      title: "Results Copied!",
                      description: "Share your results with friends!"
                    });
                  }}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Share Result
                </Button>
              </motion.div>
            </div>
          ) : (
            <WordPuzzle word={dailyWord} onComplete={handleComplete} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyChallenge;

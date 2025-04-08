
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WordPuzzle from './WordPuzzle';
import CountdownTimer from './CountdownTimer';
import AnimeCharacter from './AnimeCharacter';
import { Trophy, Clock, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import audioManager from '@/lib/audioManager';

// Sample word list - in a real app, this would come from an API
const wordList = [
  'anime', 'manga', 'ninja', 'otaku', 'mecha', 
  'sushi', 'kanji', 'bento', 'sensei', 'cosplay',
  'kawaii', 'chibi', 'shonen', 'shoujo', 'sakura'
];

const DailyChallenge = () => {
  const [dailyWord, setDailyWord] = useState('');
  const [completed, setCompleted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastCompletionDate, setLastCompletionDate] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  
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
    
    // Check if today's challenge was already completed
    const storedData = localStorage.getItem('dailyChallenge');
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data.date === dateString) {
        setCompleted(data.completed);
        setSuccess(data.success);
        setLastCompletionDate(data.date);
      } else {
        // New day, reset
        localStorage.removeItem('dailyChallenge');
        setLastCompletionDate(null);
      }
    }
    
    // Get streak
    const storedStreak = localStorage.getItem('streak');
    if (storedStreak) {
      setStreak(parseInt(storedStreak));
    }
    
    // Add entrance animation
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  }, []);
  
  const handleComplete = (success: boolean) => {
    setCompleted(true);
    setSuccess(success);
    
    // Store completion in localStorage
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    setLastCompletionDate(dateString);
    
    localStorage.setItem('dailyChallenge', JSON.stringify({
      date: dateString,
      completed: true,
      success
    }));
    
    // Update streak
    let newStreak = streak;
    if (success) {
      newStreak += 1;
      audioManager.playSound('win');
    } else {
      newStreak = 0;
      audioManager.playSound('wrong');
    }
    
    setStreak(newStreak);
    localStorage.setItem('streak', newStreak.toString());
    
    // Add experience for daily challenge (in a real app, this would sync with the user's profile)
    if (success) {
      // Update experience
      const savedExp = localStorage.getItem('experience');
      const currentExp = savedExp ? parseInt(savedExp) : 0;
      const newExp = currentExp + 20; // Daily challenges give more XP
      localStorage.setItem('experience', newExp.toString());
      
      // Update level if needed
      const savedLevel = localStorage.getItem('level');
      const currentLevel = savedLevel ? parseInt(savedLevel) : 1;
      const newLevel = Math.floor(newExp / 100) + 1;
      if (newLevel > currentLevel) {
        localStorage.setItem('level', newLevel.toString());
      }
    }
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
              <Trophy className="w-4 h-4 text-wizard-purple mr-1" />
              <span className="text-sm font-bold text-wizard-purple">Streak: {streak}</span>
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
                <span className="text-sm font-medium">Completed: {new Date(lastCompletionDate || '').toLocaleDateString()}</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Clock className="w-5 h-5 text-wizard-purple mr-2" />
                <span className="text-sm font-medium">Next challenge in:</span>
              </motion.div>
              
              <motion.div 
                className="mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <CountdownTimer targetTime={nextDay} />
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

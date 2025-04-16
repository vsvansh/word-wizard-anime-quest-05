
import React from 'react';
import NavBar from '@/components/NavBar';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy } from 'lucide-react';
import PageFooter from '@/components/PageFooter';
import ParticleBackground from '@/components/ParticleBackground';
import { useState, useEffect } from 'react';
import MinigamesSection from '@/components/unlimited/MinigamesSection';

const MinigamesPage = () => {
  const [animatedBackground, setAnimatedBackground] = useState(() => {
    const saved = localStorage.getItem('animatedBackground');
    return saved ? JSON.parse(saved) : true;
  });
  
  const [experience, setExperience] = useState(() => {
    const saved = localStorage.getItem('experience');
    return saved ? parseInt(saved) : 0;
  });
  
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('level');
    return saved ? parseInt(saved) : 1;
  });

  useEffect(() => {
    const savedAnimatedBackground = localStorage.getItem('animatedBackground');
    if (savedAnimatedBackground) {
      setAnimatedBackground(JSON.parse(savedAnimatedBackground));
    }
  }, []);

  const handleXpEarned = (amount: number) => {
    // Update experience and check for level up
    const newExp = experience + amount;
    setExperience(newExp);
    localStorage.setItem('experience', newExp.toString());
    
    if (newExp >= level * 100) {
      const newLevel = level + 1;
      setLevel(newLevel);
      localStorage.setItem('level', newLevel.toString());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {animatedBackground && <ParticleBackground />}
      
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-wizard-pink/10 via-transparent to-wizard-blue/10"></div>
      
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        <motion.section 
          className="py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-manga font-bold text-center mb-4 bg-gradient-to-r from-wizard-pink to-wizard-purple text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Gamepad2 className="inline-block h-8 w-8 mr-2 text-wizard-pink" />
            Word Wizard Minigames
          </motion.h1>
          
          <motion.p 
            className="text-center text-foreground/70 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Challenge yourself with our collection of anime-themed word games and earn XP to level up!
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-wizard-purple/10 dark:bg-wizard-purple/20 px-4 py-2 rounded-full flex items-center gap-2">
              <Trophy className="text-wizard-purple w-5 h-5" />
              <span className="text-sm font-medium text-wizard-purple">Earn XP With Every Game!</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <MinigamesSection onXpEarned={handleXpEarned} fullPage={true} />
          </motion.div>
        </motion.section>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default MinigamesPage;

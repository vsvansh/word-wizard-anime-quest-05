
import React from 'react';
import NavBar from '@/components/NavBar';
import { Card } from '@/components/ui/card';
import PageFooter from '@/components/PageFooter';
import ParticleBackground from '@/components/ParticleBackground';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import MinigamesSection from '@/components/unlimited/MinigamesSection';

const MinigamesPage = () => {
  const [animatedBackground] = React.useState(() => {
    const saved = localStorage.getItem('animatedBackground');
    return saved ? JSON.parse(saved) : true;
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {animatedBackground && <ParticleBackground />}
      
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-wizard-purple/10 via-transparent to-wizard-blue/10"></div>
      
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 border-wizard-purple/30 mb-8 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="h-6 w-6 text-wizard-purple" />
              <h1 className="text-2xl font-manga bg-gradient-to-r from-wizard-pink via-wizard-purple to-wizard-blue text-transparent bg-clip-text">
                Word Wizard Minigames
              </h1>
            </div>
            
            <p className="text-foreground/80 mb-6">
              Challenge yourself with these anime-themed word games to earn extra XP and boost your wizard skills!
            </p>
          </Card>
        </motion.div>
        
        {/* The MinigamesSection component already has all the games */}
        <MinigamesSection 
          onXpEarned={(amount) => {
            // Update local storage with earned XP
            const currentXp = localStorage.getItem('experience');
            const newXp = (currentXp ? parseInt(currentXp) : 0) + amount;
            localStorage.setItem('experience', newXp.toString());
          }} 
          fullPage={true}
        />
      </main>
      
      <PageFooter />
      
      {/* Decorative elements */}
      <div className="fixed top-1/2 -left-20 w-40 h-40 bg-wizard-purple/5 rounded-full blur-3xl"></div>
      <div className="fixed top-1/3 -right-20 w-40 h-40 bg-wizard-blue/5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default MinigamesPage;

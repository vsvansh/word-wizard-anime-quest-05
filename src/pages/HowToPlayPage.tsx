
import NavBar from '@/components/NavBar';
import HowToPlay from '@/components/HowToPlay';
import { motion } from 'framer-motion';
import PageFooter from '@/components/PageFooter';
import ParticleBackground from '@/components/ParticleBackground';
import { BookOpen, HelpCircle, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const HowToPlayPage = () => {
  const [animatedBackground, setAnimatedBackground] = useState(() => {
    const saved = localStorage.getItem('animatedBackground');
    return saved ? JSON.parse(saved) : true;
  });
  
  useEffect(() => {
    const savedAnimatedBackground = localStorage.getItem('animatedBackground');
    if (savedAnimatedBackground) {
      setAnimatedBackground(JSON.parse(savedAnimatedBackground));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {animatedBackground && <ParticleBackground />}
      
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        <motion.section 
          className="py-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-manga font-bold text-center mb-4 bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BookOpen className="inline-block h-8 w-8 mr-2 text-wizard-purple" />
            How To Play
          </motion.h1>
          
          <motion.p 
            className="text-center text-foreground/70 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Learn the rules, strategies, and tips to become the ultimate Word Wizard!
          </motion.p>
          
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="bg-wizard-green/10 dark:bg-wizard-green/20 px-4 py-2 rounded-full flex items-center gap-2">
              <HelpCircle className="text-wizard-green w-5 h-5" />
              <span className="text-sm font-medium text-wizard-green">Easy to Learn</span>
            </div>
            
            <div className="bg-wizard-purple/10 dark:bg-wizard-purple/20 px-4 py-2 rounded-full flex items-center gap-2">
              <Sparkles className="text-wizard-purple w-5 h-5" />
              <span className="text-sm font-medium text-wizard-purple">Magical Game Mechanics</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <HowToPlay />
          </motion.div>
        </motion.section>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default HowToPlayPage;

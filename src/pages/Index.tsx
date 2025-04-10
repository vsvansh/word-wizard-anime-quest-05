
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Star, Flame, Zap, Gamepad, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import NavBar from '@/components/NavBar';
import ParticleBackground from '@/components/ParticleBackground';
import PageFooter from '@/components/PageFooter';
import AnimeCharacter from '@/components/AnimeCharacter';
import audioManager from '@/lib/audioManager';
import ConfettiExplosion from '@/components/ConfettiExplosion';

const Index = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [characterMood, setCharacterMood] = useState<'neutral' | 'excited' | 'happy'>('excited');
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  
  // Load user stats from localStorage
  useEffect(() => {
    const savedLevel = localStorage.getItem('level');
    const savedExperience = localStorage.getItem('experience');
    
    if (savedLevel) {
      setLevel(parseInt(savedLevel));
    }
    
    if (savedExperience) {
      setXp(parseInt(savedExperience));
    }
    
    // Show initial animation
    setTimeout(() => {
      setShowConfetti(true);
      audioManager.playSound('win');
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }, 500);
    
    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  }, []);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  // Features list
  const features = [
    {
      icon: <Award className="h-6 w-6 text-wizard-purple" />,
      title: "Daily Challenge",
      description: "New word puzzles every day to keep your streak going!"
    },
    {
      icon: <Flame className="h-6 w-6 text-wizard-pink" />,
      title: "Unlimited Play",
      description: "Play as many rounds as you want, whenever you want."
    },
    {
      icon: <Star className="h-6 w-6 text-wizard-yellow" />,
      title: "Track Progress",
      description: "Build your stats and earn achievements."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-wizard-blue" />,
      title: "Multiple Games",
      description: "Word puzzles, memory matches, speed typing and more!"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <ParticleBackground />
      
      <ConfettiExplosion show={showConfetti} pieces={100} />
      
      <main className="flex-grow pt-20 pb-12">
        {/* Hero Section */}
        <section className="container px-4 pt-12 pb-12 md:pt-20 md:pb-16">
          <motion.div 
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-game text-3xl md:text-4xl lg:text-5xl mb-4 bg-gradient-to-r from-wizard-pink via-wizard-purple to-wizard-blue bg-clip-text text-transparent drop-shadow-md neon-text">
              Word Wizard Anime Quest
            </h1>
            
            <p className="text-foreground/80 max-w-3xl mb-8 text-lg">
              A magical adventure where words are your power. Solve puzzles, challenge your memory,
              and become the ultimate Word Wizard in this anime-styled game!
            </p>
            
            <div className="mt-4 mb-8">
              <AnimeCharacter mood={characterMood} className="scale-125" />
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to="/daily">
                  <Button 
                    className="btn-anime py-6 px-8 text-lg"
                    onClick={() => audioManager.playSound('click')}
                  >
                    <Award className="mr-2 h-5 w-5" />
                    Daily Challenge
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to="/unlimited">
                  <Button 
                    className="btn-anime py-6 px-8 text-lg from-wizard-yellow to-wizard-green"
                    onClick={() => audioManager.playSound('click')}
                  >
                    <Gamepad className="mr-2 h-5 w-5" />
                    Play Now
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to="/how-to-play">
                  <Button 
                    variant="outline"
                    className="py-6 px-8 text-lg bg-gradient-to-r from-background to-background/80 border-2 border-wizard-purple/30 hover:border-wizard-purple/50 hover:bg-background/90"
                    onClick={() => audioManager.playSound('click')}
                  >
                    <Zap className="mr-2 h-5 w-5 text-wizard-blue" />
                    How to Play
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section className="container px-4 py-12">
          <motion.h2 
            className="text-2xl md:text-3xl text-center font-manga bg-gradient-to-r from-wizard-yellow to-wizard-green bg-clip-text text-transparent mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Game Features
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={item}>
                <Card className="anime-card p-6 h-full flex flex-col items-center text-center space-y-3 hover-glow">
                  <div className="p-3 bg-gradient-to-br from-wizard-purple/10 to-transparent rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-manga bg-clip-text text-transparent bg-gradient-to-r from-wizard-purple to-wizard-blue">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Game modes preview section */}
        <section className="container px-4 py-12">
          <motion.h2 
            className="text-2xl md:text-3xl text-center font-manga bg-gradient-to-r from-wizard-blue to-wizard-purple bg-clip-text text-transparent mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Game Modes
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link to="/daily" className="block h-full">
                <Card className="anime-card h-full flex flex-col from-wizard-purple/10 to-background hover:from-wizard-purple/20">
                  <div className="p-6 flex-grow">
                    <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-wizard-purple/20">
                      <Award className="h-6 w-6 text-wizard-purple" />
                    </div>
                    <h3 className="text-xl font-manga text-wizard-purple mb-2">Daily Challenge</h3>
                    <p className="text-foreground/70 text-sm">
                      A new word puzzle every day. Complete daily challenges to build your streak and earn achievements!
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-wizard-purple/10 to-transparent p-4 border-t border-wizard-purple/10">
                    <p className="text-sm font-medium text-wizard-purple flex items-center">
                      Play Daily Challenge <Zap className="ml-2 h-4 w-4" />
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link to="/unlimited" className="block h-full">
                <Card className="anime-card h-full flex flex-col from-wizard-blue/10 to-background hover:from-wizard-blue/20">
                  <div className="p-6 flex-grow">
                    <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-wizard-blue/20">
                      <Gamepad className="h-6 w-6 text-wizard-blue" />
                    </div>
                    <h3 className="text-xl font-manga text-wizard-blue mb-2">Word Games</h3>
                    <p className="text-foreground/70 text-sm">
                      Test your skills with unlimited word puzzles. Play memory match, word scramble, and speed typing challenges!
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-wizard-blue/10 to-transparent p-4 border-t border-wizard-blue/10">
                    <p className="text-sm font-medium text-wizard-blue flex items-center">
                      Play Unlimited <Zap className="ml-2 h-4 w-4" />
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link to="/how-to-play" className="block h-full">
                <Card className="anime-card h-full flex flex-col from-wizard-pink/10 to-background hover:from-wizard-pink/20">
                  <div className="p-6 flex-grow">
                    <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-wizard-pink/20">
                      <Sparkles className="h-6 w-6 text-wizard-pink" />
                    </div>
                    <h3 className="text-xl font-manga text-wizard-pink mb-2">How To Play</h3>
                    <p className="text-foreground/70 text-sm">
                      Learn the rules and strategies to master all the Word Wizard games and become a legendary player!
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-wizard-pink/10 to-transparent p-4 border-t border-wizard-pink/10">
                    <p className="text-sm font-medium text-wizard-pink flex items-center">
                      Learn More <Zap className="ml-2 h-4 w-4" />
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default Index;

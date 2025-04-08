
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import DailyChallenge from '@/components/DailyChallenge';
import AnimeCharacter from '@/components/AnimeCharacter';
import { Award, Book, Crown, Heart, Star, Sparkles, Rocket, Music, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const { theme } = useTheme();
  
  // Play background music when user interacts with the page
  useEffect(() => {
    const bgMusic = new Audio("https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-668.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.1;
    
    const playMusic = () => {
      bgMusic.play().catch(err => console.log('Audio autoplay was prevented', err));
      document.removeEventListener('click', playMusic);
    };
    
    document.addEventListener('click', playMusic);
    
    return () => {
      document.removeEventListener('click', playMusic);
      bgMusic.pause();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-wizard-purple/10 to-wizard-blue/10 dark:from-wizard-purple/20 dark:to-wizard-blue/20"></div>
        <div className="absolute w-full h-full">
          {theme === 'dark' ? (
            // Dark mode particles
            <div className="absolute inset-0">
              {Array.from({ length: 50 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-white/10"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    opacity: Math.random() * 0.5 + 0.2,
                    animation: `floatParticle ${Math.random() * 10 + 10}s linear infinite`
                  }}
                />
              ))}
            </div>
          ) : (
            // Light mode particles
            <div className="absolute inset-0">
              {Array.from({ length: 50 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-wizard-purple/10"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    opacity: Math.random() * 0.5 + 0.2,
                    animation: `floatParticle ${Math.random() * 10 + 10}s linear infinite`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        {/* Hero Section */}
        <motion.section 
          className="py-10 md:py-16 flex flex-col md:flex-row items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-manga font-bold mb-4 bg-gradient-to-r from-wizard-purple via-wizard-blue to-wizard-pink text-transparent bg-clip-text leading-tight relative"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Word Wizard Anime Quest
              <span className="absolute -top-6 -right-6 animate-pulse">
                <Sparkles className="h-8 w-8 text-wizard-yellow" />
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-foreground/80 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Embark on a <span className="text-wizard-purple font-bold">magical word adventure</span> with daily anime-themed puzzle challenges! 
              Test your vocabulary skills and become the ultimate Word Wizard.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/daily">
                <Button className="game-button bg-wizard-purple hover:bg-wizard-purple/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                  <Award className="mr-2 h-5 w-5" />
                  Daily Challenge
                </Button>
              </Link>
              <Link to="/unlimited">
                <Button className="game-button bg-wizard-blue hover:bg-wizard-blue/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                  <Zap className="mr-2 h-5 w-5" />
                  Unlimited Play
                </Button>
              </Link>
              <Link to="/how-to-play">
                <Button variant="outline" className="game-button border-wizard-purple text-wizard-purple hover:bg-wizard-purple/10 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                  <Book className="mr-2 h-5 w-5" />
                  How to Play
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div 
            className="md:w-1/2 flex justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-wizard-purple to-wizard-blue rounded-full opacity-20 animate-pulse-glow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <AnimeCharacter mood="excited" className="scale-150" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.section>
        
        {/* Features Section */}
        <motion.section 
          className="py-12 md:py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-manga font-bold mb-12 text-center">Game Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="anime-card text-center p-6 border border-wizard-blue/20 dark:border-wizard-blue/10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-wizard-blue/10 dark:bg-wizard-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Trophy className="h-8 w-8 text-wizard-blue" />
              </div>
              <h3 className="text-xl font-manga font-bold mb-2 text-wizard-blue">Daily Challenges</h3>
              <p className="text-foreground/70 dark:text-foreground/60">
                A new word puzzle every day to keep your skills sharp and build your streak.
              </p>
            </motion.div>
            
            <motion.div 
              className="anime-card text-center p-6 border border-wizard-pink/20 dark:border-wizard-pink/10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-wizard-pink/10 dark:bg-wizard-pink/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Rocket className="h-8 w-8 text-wizard-pink" />
              </div>
              <h3 className="text-xl font-manga font-bold mb-2 text-wizard-pink">Unlimited Mode</h3>
              <p className="text-foreground/70 dark:text-foreground/60">
                Play as many puzzles as you want, level up, and track your stats in unlimited mode.
              </p>
            </motion.div>
            
            <motion.div 
              className="anime-card text-center p-6 border border-wizard-yellow/20 dark:border-wizard-yellow/10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-wizard-yellow/10 dark:bg-wizard-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Sparkles className="h-8 w-8 text-wizard-yellow" />
              </div>
              <h3 className="text-xl font-manga font-bold mb-2 text-wizard-yellow">Magical Experience</h3>
              <p className="text-foreground/70 dark:text-foreground/60">
                Delightful animations, sound effects, and anime character reactions make learning fun.
              </p>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Daily Challenge Section */}
        <motion.section 
          className="py-12 md:py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-manga font-bold mb-6 text-center">Today's Challenge</h2>
          <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-10">
            Can you solve today's word puzzle? Test your skills and continue your streak!
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <DailyChallenge />
          </motion.div>
        </motion.section>
      </main>
      
      <motion.footer 
        className="border-t py-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container max-w-6xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-manga font-bold text-xl bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
                WordWizard
              </span>
              <p className="text-sm text-foreground/60 mt-1">© 2025 Word Wizard Anime Quest</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-foreground/60 hover:text-wizard-purple transition-colors">Terms</a>
              <a href="#" className="text-foreground/60 hover:text-wizard-purple transition-colors">Privacy</a>
              <a href="#" className="text-foreground/60 hover:text-wizard-purple transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Add keyframes for floating particles */}
      <style jsx global>{`
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        
        .puzzle-letter {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.25rem;
          border: 2px solid #ddd;
          border-radius: 0.5rem;
          background: white;
          color: #333;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .dark .puzzle-letter {
          background: #1f2937;
          color: #e5e7eb;
          border-color: #374151;
        }
        
        .puzzle-letter-correct {
          background: #10b981;
          border-color: #10b981;
          color: white;
          transform: scale(1.05);
        }
        
        .puzzle-letter-wrong-position {
          background: #f59e0b;
          border-color: #f59e0b;
          color: white;
        }
        
        .puzzle-letter-incorrect {
          background: #6b7280;
          border-color: #6b7280;
          color: white;
        }
        
        .font-manga {
          font-family: 'Bangers', system-ui, sans-serif;
        }
        
        .anime-card {
          transition: all 0.3s ease;
        }
        
        .anime-card:hover {
          transform: translateY(-5px);
        }
        
        .game-button {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default Index;

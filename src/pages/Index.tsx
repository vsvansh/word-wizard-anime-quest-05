
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import DailyChallenge from '@/components/DailyChallenge';
import AnimeCharacter from '@/components/AnimeCharacter';
import { Award, Book, Crown, Heart, Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        {/* Hero Section */}
        <section className="py-10 md:py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-manga font-bold mb-4 bg-gradient-to-r from-wizard-purple via-wizard-blue to-wizard-pink text-transparent bg-clip-text leading-tight">
              Word Wizard Anime Quest
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-6">
              Embark on a magical word adventure with daily anime-themed puzzle challenges! 
              Test your vocabulary skills and become the ultimate Word Wizard.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/daily">
                <Button className="game-button bg-wizard-purple hover:bg-wizard-purple/90 text-white">
                  <Award className="mr-2 h-5 w-5" />
                  Daily Challenge
                </Button>
              </Link>
              <Link to="/how-to-play">
                <Button variant="outline" className="game-button border-wizard-purple text-wizard-purple hover:bg-wizard-purple/10">
                  <Book className="mr-2 h-5 w-5" />
                  How to Play
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-wizard-purple to-wizard-blue rounded-full opacity-20 animate-pulse-glow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimeCharacter mood="excited" className="scale-150" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 md:py-16">
          <h2 className="text-3xl font-manga font-bold mb-12 text-center">Game Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="anime-card text-center p-6">
              <div className="w-16 h-16 bg-wizard-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-wizard-blue" />
              </div>
              <h3 className="text-xl font-manga font-bold mb-2 text-wizard-blue">Daily Challenges</h3>
              <p className="text-foreground/70">
                A new word puzzle every day to keep your skills sharp and build your streak.
              </p>
            </div>
            
            <div className="anime-card text-center p-6">
              <div className="w-16 h-16 bg-wizard-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-wizard-pink" />
              </div>
              <h3 className="text-xl font-manga font-bold mb-2 text-wizard-pink">Anime Theme</h3>
              <p className="text-foreground/70">
                Colorful anime-inspired design with cute character reactions to your progress.
              </p>
            </div>
            
            <div className="anime-card text-center p-6">
              <div className="w-16 h-16 bg-wizard-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-wizard-yellow" />
              </div>
              <h3 className="text-xl font-manga font-bold mb-2 text-wizard-yellow">Helpful Hints</h3>
              <p className="text-foreground/70">
                Get unstuck with strategic hints that help you solve the puzzle without giving it away.
              </p>
            </div>
          </div>
        </section>
        
        {/* Daily Challenge Section */}
        <section className="py-12 md:py-16">
          <h2 className="text-3xl font-manga font-bold mb-6 text-center">Today's Challenge</h2>
          <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-10">
            Can you solve today's word puzzle? Test your skills and continue your streak!
          </p>
          <DailyChallenge />
        </section>
      </main>
      
      <footer className="bg-gray-50 border-t py-8">
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
      </footer>
    </div>
  );
};

export default Index;

import { Link } from 'react-router-dom';
import { Github, Twitter, Heart, MessageSquare, Star } from 'lucide-react';
import { motion } from 'framer-motion';
const PageFooter = () => {
  const currentYear = new Date().getFullYear();
  return <motion.footer className="border-t py-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm" initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.8,
    delay: 0.2
  }}>
      <div className="container max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-wizard-purple rounded-full animate-pulse-glow"></div>
                <span className="absolute inset-0 flex items-center justify-center text-white font-manga font-bold text-sm">W</span>
              </div>
              <span className="font-manga font-bold text-xl bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
                WordWizard
              </span>
            </Link>
            <p className="text-sm text-foreground/60 mt-2">
              An enchanting word puzzle game with anime-style visuals and daily challenges.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-foreground/60 hover:text-wizard-purple transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-wizard-blue transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-wizard-pink transition-colors">
                <MessageSquare size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-manga font-bold text-lg mb-3">Play</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-foreground/60 hover:text-wizard-purple transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/daily" className="text-sm text-foreground/60 hover:text-wizard-purple transition-colors">
                  Daily Challenge
                </Link>
              </li>
              <li>
                <Link to="/unlimited" className="text-sm text-foreground/60 hover:text-wizard-purple transition-colors">
                  Unlimited Mode
                </Link>
              </li>
              <li>
                <Link to="/how-to-play" className="text-sm text-foreground/60 hover:text-wizard-purple transition-colors">
                  How to Play
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-manga font-bold text-lg mb-3">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-sm text-foreground/60 hover:text-wizard-purple transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/stats" className="text-sm text-foreground/60 hover:text-wizard-purple transition-colors">
                  Statistics
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-sm text-foreground/60 hover:text-wizard-purple transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-manga font-bold text-lg mb-3">Info</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-foreground/60 hover:text-wizard-purple transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/60 hover:text-wizard-purple transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/60 hover:text-wizard-purple transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/60 hover:text-wizard-purple transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/60 mb-4 md:mb-0">
            © {currentYear} Word Wizard Anime Quest. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-foreground/60">
            <span>Made with</span>
            <Heart size={14} className="text-wizard-pink mx-1" />
            <span>by Vijay</span>
            <Star size={14} className="text-wizard-yellow ml-1" />
          </div>
        </div>
      </div>
    </motion.footer>;
};
export default PageFooter;
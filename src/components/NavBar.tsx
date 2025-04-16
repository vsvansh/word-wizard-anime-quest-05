
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, HelpCircle, Award, Menu, X, User, Settings, 
  BarChart2, Sun, Moon, Infinity, Gamepad2, Volume2, VolumeX 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import audioManager from "@/lib/audioManager";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => audioManager.areSoundEffectsEnabled());
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleSound = () => {
    const newState = audioManager.toggleSoundEffects();
    setSoundEnabled(newState);
    if (newState) {
      audioManager.playSound('click');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-wizard-purple rounded-full animate-pulse-glow"></div>
            <span className="absolute inset-0 flex items-center justify-center text-white font-manga font-bold text-xl">W</span>
          </div>
          <span className="font-manga font-bold text-2xl bg-gradient-to-r from-wizard-purple via-wizard-blue to-wizard-pink text-transparent bg-clip-text">
            WordWizard
          </span>
        </Link>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSound}
            className="rounded-full"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          <button 
            className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-1 font-medium transition-colors ${
              isActive('/') ? 'text-wizard-purple' : 'text-foreground hover:text-wizard-purple'
            }`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/daily" 
            className={`flex items-center space-x-1 font-medium transition-colors ${
              isActive('/daily') ? 'text-wizard-purple' : 'text-foreground hover:text-wizard-purple'
            }`}
          >
            <Award size={18} />
            <span>Daily</span>
          </Link>
          
          <Link 
            to="/unlimited" 
            className={`flex items-center space-x-1 font-medium transition-colors ${
              isActive('/unlimited') ? 'text-wizard-purple' : 'text-foreground hover:text-wizard-purple'
            }`}
          >
            <Infinity size={18} />
            <span>Unlimited</span>
          </Link>
          
          <Link 
            to="/minigames" 
            className={`flex items-center space-x-1 font-medium transition-colors ${
              isActive('/minigames') ? 'text-wizard-purple' : 'text-foreground hover:text-wizard-purple'
            }`}
          >
            <Gamepad2 size={18} />
            <span>Minigames</span>
          </Link>
          
          <Link 
            to="/how-to-play" 
            className={`flex items-center space-x-1 font-medium transition-colors ${
              isActive('/how-to-play') ? 'text-wizard-purple' : 'text-foreground hover:text-wizard-purple'
            }`}
          >
            <HelpCircle size={18} />
            <span>How to Play</span>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSound}
            className="rounded-full"
            title={soundEnabled ? "Mute Sound" : "Unmute Sound"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/stats" className="flex items-center cursor-pointer">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  <span>Statistics</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <nav className="flex flex-col p-4 space-y-3">
            <Link 
              to="/" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground" 
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/daily" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground" 
              onClick={() => setIsMenuOpen(false)}
            >
              <Award size={18} />
              <span>Daily Challenge</span>
            </Link>
            
            <Link 
              to="/unlimited" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground" 
              onClick={() => setIsMenuOpen(false)}
            >
              <Infinity size={18} />
              <span>Unlimited Play</span>
            </Link>
            
            <Link 
              to="/minigames" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground" 
              onClick={() => setIsMenuOpen(false)}
            >
              <Gamepad2 size={18} />
              <span>Minigames</span>
            </Link>
            
            <Link 
              to="/how-to-play" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground" 
              onClick={() => setIsMenuOpen(false)}
            >
              <HelpCircle size={18} />
              <span>How to Play</span>
            </Link>
            
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground" 
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
            
            <Link 
              to="/stats" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground" 
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart2 size={18} />
              <span>Statistics</span>
            </Link>
            
            <Link 
              to="/settings" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground" 
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;

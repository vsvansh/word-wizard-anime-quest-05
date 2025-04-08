
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, HelpCircle, Award, Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
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
        <button 
          className="md:hidden p-2 rounded-full hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-1 text-foreground hover:text-wizard-purple font-medium transition-colors">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/daily" className="flex items-center space-x-1 text-foreground hover:text-wizard-purple font-medium transition-colors">
            <Award size={18} />
            <span>Daily Challenge</span>
          </Link>
          <Link to="/how-to-play" className="flex items-center space-x-1 text-foreground hover:text-wizard-purple font-medium transition-colors">
            <HelpCircle size={18} />
            <span>How to Play</span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Statistics</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <nav className="flex flex-col p-4 space-y-3">
            <Link to="/" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/daily" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              <Award size={18} />
              <span>Daily Challenge</span>
            </Link>
            <Link to="/how-to-play" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              <HelpCircle size={18} />
              <span>How to Play</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              <User size={18} />
              <span>Profile</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;

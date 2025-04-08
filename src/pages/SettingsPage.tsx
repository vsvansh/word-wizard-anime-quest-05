
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "@/hooks/useTheme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Settings, Moon, Sun, Volume2, Volume1, VolumeX, AlertTriangle, Trash2, 
  Sparkles, Palette, Brush, Wand2, Bell, BellRing, Eye, Type, Music,
  Music2, Music3, Music4, RefreshCw, Gamepad2, Star, BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import audioManager from "@/lib/audioManager";
import { motion } from "framer-motion";
import PageFooter from "@/components/PageFooter";
import ParticleBackground from "@/components/ParticleBackground";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [soundEffects, setSoundEffects] = useState(audioManager.areSoundEffectsEnabled());
  const [backgroundMusic, setBackgroundMusic] = useState(audioManager.isMusicPlaying());
  const [musicVolume, setMusicVolume] = useState(audioManager.getMusicVolume() * 100);
  const [sfxVolume, setSfxVolume] = useState(audioManager.getSFXVolume() * 100);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [animatedBackground, setAnimatedBackground] = useState(() => {
    const saved = localStorage.getItem('animatedBackground');
    return saved ? JSON.parse(saved) : true;
  });
  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('highContrast');
    return saved ? JSON.parse(saved) : false;
  });
  const [largeText, setLargeText] = useState(() => {
    const saved = localStorage.getItem('largeText');
    return saved ? JSON.parse(saved) : false;
  });
  const [difficultyLevel, setDifficultyLevel] = useState(() => {
    const saved = localStorage.getItem('difficultyLevel');
    return saved ? JSON.parse(saved) : 'medium';
  });
  const [showHints, setShowHints] = useState(() => {
    const saved = localStorage.getItem('showHints');
    return saved ? JSON.parse(saved) : true;
  });
  const { toast } = useToast();

  useEffect(() => {
    // Apply large text setting to the document
    if (largeText) {
      document.documentElement.classList.add('text-large');
    } else {
      document.documentElement.classList.remove('text-large');
    }
    
    // Apply high contrast setting
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Save settings to localStorage
    localStorage.setItem('notificationsEnabled', JSON.stringify(notifications));
    localStorage.setItem('animatedBackground', JSON.stringify(animatedBackground));
    localStorage.setItem('highContrast', JSON.stringify(highContrast));
    localStorage.setItem('largeText', JSON.stringify(largeText));
    localStorage.setItem('difficultyLevel', JSON.stringify(difficultyLevel));
    localStorage.setItem('showHints', JSON.stringify(showHints));
  }, [notifications, animatedBackground, highContrast, largeText, difficultyLevel, showHints]);

  const handleToggleBackgroundMusic = () => {
    const isPlaying = audioManager.toggleBackgroundMusic();
    setBackgroundMusic(isPlaying);
    
    toast({
      title: isPlaying ? "Background Music Enabled" : "Background Music Disabled",
      description: isPlaying ? "The magical tunes have started playing!" : "The music has been silenced.",
    });
  };

  const handleToggleSoundEffects = () => {
    const isEnabled = audioManager.toggleSoundEffects();
    setSoundEffects(isEnabled);
    
    if (isEnabled) {
      audioManager.playSound('click');
    }
    
    toast({
      title: isEnabled ? "Sound Effects Enabled" : "Sound Effects Disabled",
      description: isEnabled ? "You'll now hear magical sound effects!" : "Sound effects have been muted.",
    });
  };

  const handleMusicVolumeChange = (value: number[]) => {
    const volume = value[0] / 100;
    setMusicVolume(value[0]);
    audioManager.setMusicVolume(volume);
    
    // Play a sample sound when adjusting volume if music is enabled
    if (backgroundMusic && value[0] % 10 === 0) {
      audioManager.playSound('hint');
    }
  };

  const handleSFXVolumeChange = (value: number[]) => {
    const volume = value[0] / 100;
    setSfxVolume(value[0]);
    audioManager.setSFXVolume(volume);
    
    // Play a sample sound when adjusting volume if SFX is enabled
    if (soundEffects && value[0] % 10 === 0) {
      audioManager.playSound('click');
    }
  };

  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    
    toast({
      title: !notifications ? "Notifications Enabled" : "Notifications Disabled",
      description: !notifications ? "You'll now receive game notifications!" : "Notifications have been turned off.",
    });
  };

  const handleToggleAnimatedBackground = () => {
    setAnimatedBackground(!animatedBackground);
    
    toast({
      title: !animatedBackground ? "Animated Background Enabled" : "Animated Background Disabled",
      description: !animatedBackground ? "The magical particles have been awakened!" : "Background animations are now disabled.",
    });
  };

  const handleResetProgress = () => {
    // Clear game progress
    localStorage.removeItem('dailyChallenge');
    localStorage.removeItem('streak');
    localStorage.removeItem('puzzlesSolved');
    localStorage.removeItem('puzzlesSkipped');
    localStorage.removeItem('bestStreak');
    localStorage.removeItem('currentStreak');
    localStorage.removeItem('experience');
    localStorage.removeItem('level');
    
    toast({
      title: "Progress Reset",
      description: "All your game progress has been reset.",
      variant: "destructive"
    });
    
    audioManager.playSound('spell');
  };

  const handleResetAccount = () => {
    // Clear all settings and progress
    localStorage.clear();
    
    // Reset state to defaults
    setSoundEffects(true);
    setBackgroundMusic(false);
    setNotifications(true);
    setAnimatedBackground(true);
    setHighContrast(false);
    setLargeText(false);
    setDifficultyLevel('medium');
    setShowHints(true);
    
    toast({
      title: "Account Reset",
      description: "Your account has been reset to default settings.",
      variant: "destructive"
    });
    
    audioManager.playSound('spell');
  };

  const handleDifficultyChange = (difficulty: string) => {
    setDifficultyLevel(difficulty);
    
    toast({
      title: `Difficulty Set to ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
      description: `Game difficulty has been updated.`,
    });
    
    audioManager.playSound('click');
  };

  const handleToggleHints = () => {
    setShowHints(!showHints);
    
    toast({
      title: !showHints ? "Hints Enabled" : "Hints Disabled",
      description: !showHints ? "Helpful hints will now be shown during gameplay." : "Hints have been hidden for an extra challenge!",
    });
    
    audioManager.playSound('click');
  };

  return (
    <div className="min-h-screen bg-background anime-bg-pattern relative">
      {animatedBackground && <ParticleBackground />}
      
      <NavBar />
      
      <main className="container max-w-4xl pt-24 pb-12 px-4 md:px-6">
        <motion.section 
          className="py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-8">
            <Settings className="h-6 w-6 text-wizard-purple" />
            <h1 className="text-3xl md:text-4xl font-manga font-bold bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
              Settings
            </h1>
          </div>
          
          <Card className="anime-card mb-8 overflow-hidden shadow-xl">
            <div className="p-6 bg-gradient-to-r from-wizard-purple/10 to-wizard-blue/10 dark:from-wizard-purple/20 dark:to-wizard-blue/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-wizard-purple to-wizard-blue flex items-center justify-center text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-manga font-bold">Word Wizard Settings</h2>
                  <p className="text-xs text-foreground/70">Customize your magical experience</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="appearance" className="font-manga">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="sound" className="font-manga">
                <Volume2 className="h-4 w-4 mr-2" />
                Sound
              </TabsTrigger>
              <TabsTrigger value="gameplay" className="font-manga">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Gameplay
              </TabsTrigger>
              <TabsTrigger value="notifications" className="font-manga">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="danger" className="font-manga">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Data Reset
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold flex items-center gap-2 text-wizard-purple">
                  <Wand2 className="h-5 w-5" />
                  Theme Settings
                </h2>
                
                <div className="grid gap-4">
                  <motion.div 
                    className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? (
                        <Moon className="h-5 w-5 text-wizard-blue" />
                      ) : (
                        <Sun className="h-5 w-5 text-wizard-yellow" />
                      )}
                      <div>
                        <span className="font-medium">Dark Mode</span>
                        <p className="text-sm text-foreground/60">Enable for a magical night experience</p>
                      </div>
                    </div>
                    <Switch 
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                      onClick={() => audioManager.playSound('click')}
                    />
                  </motion.div>

                  <motion.div 
                    className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-wizard-pink" />
                      <div>
                        <span className="font-medium">Animated Background</span>
                        <p className="text-sm text-foreground/60">Show magical particles in the background</p>
                      </div>
                    </div>
                    <Switch 
                      checked={animatedBackground}
                      onCheckedChange={handleToggleAnimatedBackground}
                      onClick={() => audioManager.playSound('click')}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-wizard-green" />
                      <div>
                        <span className="font-medium">High Contrast</span>
                        <p className="text-sm text-foreground/60">Increase contrast for better visibility</p>
                      </div>
                    </div>
                    <Switch 
                      checked={highContrast}
                      onCheckedChange={() => setHighContrast(!highContrast)}
                      onClick={() => audioManager.playSound('click')}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2">
                      <Type className="h-5 w-5 text-wizard-blue" />
                      <div>
                        <span className="font-medium">Large Text</span>
                        <p className="text-sm text-foreground/60">Increase text size for better readability</p>
                      </div>
                    </div>
                    <Switch 
                      checked={largeText}
                      onCheckedChange={() => setLargeText(!largeText)}
                      onClick={() => audioManager.playSound('click')}
                    />
                  </motion.div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sound" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold flex items-center gap-2 text-wizard-purple">
                  <Music className="h-5 w-5" />
                  Audio Settings
                </h2>
                
                <div className="grid gap-4">
                  <motion.div 
                    className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2">
                      <Music2 className="h-5 w-5 text-wizard-purple" />
                      <div>
                        <span className="font-medium">Background Music</span>
                        <p className="text-sm text-foreground/60">Play magical background music</p>
                      </div>
                    </div>
                    <Switch 
                      checked={backgroundMusic}
                      onCheckedChange={handleToggleBackgroundMusic}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2">
                      <Volume1 className="h-5 w-5 text-wizard-blue" />
                      <div>
                        <span className="font-medium">Sound Effects</span>
                        <p className="text-sm text-foreground/60">Play sound effects during gameplay</p>
                      </div>
                    </div>
                    <Switch 
                      checked={soundEffects}
                      onCheckedChange={handleToggleSoundEffects}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="bg-card p-4 rounded-lg shadow-sm border border-border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Music3 className="h-5 w-5 text-wizard-pink" />
                      <div>
                        <span className="font-medium">Music Volume</span>
                        <p className="text-sm text-foreground/60">Adjust background music volume</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <VolumeX className="h-4 w-4 text-foreground/60" />
                      <Slider
                        value={[musicVolume]}
                        max={100}
                        step={5}
                        onValueChange={handleMusicVolumeChange}
                        className="flex-1"
                      />
                      <Volume2 className="h-4 w-4 text-foreground/60" />
                      <span className="w-8 text-sm font-medium">{musicVolume}%</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-card p-4 rounded-lg shadow-sm border border-border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Music4 className="h-5 w-5 text-wizard-yellow" />
                      <div>
                        <span className="font-medium">Effects Volume</span>
                        <p className="text-sm text-foreground/60">Adjust sound effects volume</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <VolumeX className="h-4 w-4 text-foreground/60" />
                      <Slider
                        value={[sfxVolume]}
                        max={100}
                        step={5}
                        onValueChange={handleSFXVolumeChange}
                        className="flex-1"
                      />
                      <Volume2 className="h-4 w-4 text-foreground/60" />
                      <span className="w-8 text-sm font-medium">{sfxVolume}%</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gameplay" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold flex items-center gap-2 text-wizard-purple">
                  <Gamepad2 className="h-5 w-5" />
                  Gameplay Settings
                </h2>
                
                <div className="grid gap-4">
                  <motion.div 
                    className="bg-card p-4 rounded-lg shadow-sm border border-border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="h-5 w-5 text-wizard-yellow" />
                      <div>
                        <span className="font-medium">Difficulty Level</span>
                        <p className="text-sm text-foreground/60">Adjust the game difficulty</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant={difficultyLevel === 'easy' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDifficultyChange('easy')}
                        className={difficultyLevel === 'easy' ? "bg-wizard-green" : ""}
                      >
                        Easy
                      </Button>
                      <Button 
                        variant={difficultyLevel === 'medium' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDifficultyChange('medium')}
                        className={difficultyLevel === 'medium' ? "bg-wizard-blue" : ""}
                      >
                        Medium
                      </Button>
                      <Button 
                        variant={difficultyLevel === 'hard' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDifficultyChange('hard')}
                        className={difficultyLevel === 'hard' ? "bg-wizard-purple" : ""}
                      >
                        Hard
                      </Button>
                      <Button 
                        variant={difficultyLevel === 'expert' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDifficultyChange('expert')}
                        className={difficultyLevel === 'expert' ? "bg-wizard-pink" : ""}
                      >
                        Expert
                      </Button>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-wizard-green" />
                      <div>
                        <span className="font-medium">Show Hints</span>
                        <p className="text-sm text-foreground/60">Display helpful hints during gameplay</p>
                      </div>
                    </div>
                    <Switch 
                      checked={showHints}
                      onCheckedChange={handleToggleHints}
                    />
                  </motion.div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold flex items-center gap-2 text-wizard-purple">
                  <BellRing className="h-5 w-5" />
                  Notification Settings
                </h2>
                
                <div className="grid gap-4">
                  <motion.div 
                    className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-wizard-yellow" />
                      <div>
                        <span className="font-medium">Game Notifications</span>
                        <p className="text-sm text-foreground/60">Show in-game notifications</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications}
                      onCheckedChange={handleToggleNotifications}
                      onClick={() => audioManager.playSound('click')}
                    />
                  </motion.div>
                  
                  <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Bell className="h-5 w-5 text-wizard-blue" />
                      <div>
                        <span className="font-medium">Notification Types</span>
                        <p className="text-sm text-foreground/60">Choose which notifications to receive</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="daily-reminder" 
                          checked={notifications} 
                          disabled={!notifications}
                          onClick={() => audioManager.playSound('click')}
                        />
                        <Label htmlFor="daily-reminder" className="text-sm">Daily challenge reminders</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="achievement" 
                          checked={notifications} 
                          disabled={!notifications}
                          onClick={() => audioManager.playSound('click')}
                        />
                        <Label htmlFor="achievement" className="text-sm">Achievement notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="game-updates" 
                          checked={notifications} 
                          disabled={!notifications}
                          onClick={() => audioManager.playSound('click')}
                        />
                        <Label htmlFor="game-updates" className="text-sm">Game updates and news</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="danger" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </h2>
                
                <Card className="border-destructive/30">
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      Reset Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This will reset all your game progress, including streaks, achievements, and stats.
                      Your settings will remain unchanged.
                    </p>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleResetProgress}
                    >
                      Reset Game Progress
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-destructive/30">
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                      <Trash2 className="h-5 w-5" />
                      Reset Everything
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This will reset all your game data, including progress, achievements, and settings.
                      This action cannot be undone.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleResetAccount}
                    >
                      Reset Everything
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.section>
      </main>

      <PageFooter />
    </div>
  );
};

export default SettingsPage;


import NavBar from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "@/hooks/useTheme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Settings, Moon, Sun, Volume2, Volume1, VolumeX, AlertTriangle, Trash2, 
  Sparkles, Palette, Brush, Wand2, Bell, BellRing, Eye, Type, Music,
  Music2, Music3, Music4, RefreshCw
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [soundEffects, setSoundEffects] = useState(true);
  const [backgroundMusic, setBackgroundMusic] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [animatedBackground, setAnimatedBackground] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const { toast } = useToast();

  const handleResetProgress = () => {
    toast({
      title: "Progress Reset",
      description: "All your game progress has been reset.",
      variant: "destructive"
    });
  };

  const handleResetAccount = () => {
    toast({
      title: "Account Reset",
      description: "Your account has been reset to default settings.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background anime-bg-pattern">
      <NavBar />
      
      <main className="container max-w-4xl pt-24 pb-12 px-4 md:px-6">
        <section className="py-6">
          <div className="flex items-center gap-2 mb-8">
            <Settings className="h-6 w-6 text-wizard-purple" />
            <h1 className="text-3xl md:text-4xl font-manga font-bold bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
              Settings
            </h1>
          </div>
          
          <Card className="anime-card mb-8 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-wizard-purple/10 to-wizard-blue/10 dark:from-wizard-purple/20 dark:to-wizard-blue/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-wizard-purple to-wizard-blue flex items-center justify-center text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-manga font-bold">Anime Word Wizard</h2>
                  <p className="text-xs text-foreground/70">Customize your experience</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="appearance" className="font-manga">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="sound" className="font-manga">
                <Volume2 className="h-4 w-4 mr-2" />
                Sound
              </TabsTrigger>
              <TabsTrigger value="notifications" className="font-manga">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="danger" className="font-manga">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Danger Zone
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold flex items-center gap-2 text-wizard-purple">
                  <Wand2 className="h-5 w-5" />
                  Theme Settings
                </h2>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border">
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
                    />
                  </div>

                  <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-wizard-purple" />
                      <div>
                        <span className="font-medium">Animated Background</span>
                        <p className="text-sm text-foreground/60">Add magical particles to backgrounds</p>
                      </div>
                    </div>
                    <Switch 
                      checked={animatedBackground}
                      onCheckedChange={setAnimatedBackground}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-wizard-purple" />
                      <div>
                        <span className="font-medium">High Contrast Mode</span>
                        <p className="text-sm text-foreground/60">Increase visibility and readability</p>
                      </div>
                    </div>
                    <Switch 
                      checked={highContrast}
                      onCheckedChange={setHighContrast}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center gap-2">
                      <Type className="h-5 w-5 text-wizard-purple" />
                      <div>
                        <span className="font-medium">Large Text</span>
                        <p className="text-sm text-foreground/60">Increase text size throughout the app</p>
                      </div>
                    </div>
                    <Switch 
                      checked={largeText}
                      onCheckedChange={setLargeText}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-sm border border-border">
                    <div className="p-3 rounded-full bg-wizard-purple/10 text-wizard-purple">
                      <Brush className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-manga font-bold mb-1">Theme Preview</h3>
                      <p className="text-sm text-foreground/60 mb-4">See how your theme settings will look</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg bg-background border border-border flex flex-col items-center ${theme === 'light' ? 'ring-2 ring-wizard-purple' : ''}`}>
                          <Sun className="h-8 w-8 text-wizard-yellow mb-2" />
                          <span className="text-xs font-medium">Light Mode</span>
                        </div>
                        <div className={`p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center ${theme === 'dark' ? 'ring-2 ring-wizard-purple' : ''}`}>
                          <Moon className="h-8 w-8 text-wizard-blue mb-2" />
                          <span className="text-xs font-medium text-white">Dark Mode</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sound" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold flex items-center gap-2 text-wizard-purple">
                  <Volume2 className="h-5 w-5" />
                  Sound Settings
                </h2>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-wizard-purple" />
                      <div>
                        <span className="font-medium">Sound Effects</span>
                        <p className="text-sm text-foreground/60">Enable for magical game sounds</p>
                      </div>
                    </div>
                    <Switch 
                      checked={soundEffects}
                      onCheckedChange={setSoundEffects}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center gap-2">
                      <Volume1 className="h-5 w-5 text-wizard-purple" />
                      <div>
                        <span className="font-medium">Background Music</span>
                        <p className="text-sm text-foreground/60">Enable for immersive game music</p>
                      </div>
                    </div>
                    <Switch 
                      checked={backgroundMusic}
                      onCheckedChange={setBackgroundMusic}
                    />
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-sm border border-border">
                    <div className="p-3 rounded-full bg-wizard-purple/10 text-wizard-purple">
                      <Music className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-manga font-bold mb-1">Music Selection</h3>
                      <p className="text-sm text-foreground/60 mb-4">Choose your favorite background music</p>
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-auto py-3 justify-start">
                          <Music4 className="h-4 w-4 mr-2" />
                          Anime Vibes
                        </Button>
                        <Button variant="outline" className="h-auto py-3 justify-start">
                          <Music2 className="h-4 w-4 mr-2" />
                          Chill Beats
                        </Button>
                        <Button variant="outline" className="h-auto py-3 justify-start">
                          <Music className="h-4 w-4 mr-2" />
                          Epic Adventure
                        </Button>
                        <Button variant="outline" className="h-auto py-3 justify-start">
                          <Music3 className="h-4 w-4 mr-2" />
                          Magical Tunes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold flex items-center gap-2 text-wizard-purple">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </h2>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-wizard-purple" />
                      <div>
                        <span className="font-medium">Game Notifications</span>
                        <p className="text-sm text-foreground/60">Get in-game alerts and messages</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-sm border border-border">
                    <div className="p-3 rounded-full bg-wizard-purple/10 text-wizard-purple">
                      <BellRing className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-manga font-bold mb-1">Notification Types</h3>
                      <p className="text-sm text-foreground/60 mb-4">Select which notifications you'd like to receive</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox id="daily-puzzle" />
                          <Label htmlFor="daily-puzzle">Daily puzzle reminders</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="achievements" />
                          <Label htmlFor="achievements">Achievement unlocks</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="friend-activity" />
                          <Label htmlFor="friend-activity">Friend activity</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="events" />
                          <Label htmlFor="events">Special events</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="danger" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </h2>
                
                <div className="bg-card/50 border border-destructive/20 p-6 rounded-lg space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-destructive/10 text-destructive mt-1">
                        <RefreshCw className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold">Reset Game Progress</h3>
                        <p className="text-sm text-muted-foreground">This will reset all your game statistics, streaks and achievements.</p>
                        <Button variant="destructive" size="sm" className="mt-3" onClick={handleResetProgress}>
                          Reset Progress
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4 border-destructive/20" />
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-destructive/10 text-destructive mt-1">
                        <Trash2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold">Reset Account</h3>
                        <p className="text-sm text-muted-foreground">This will reset your account to default settings including all preferences.</p>
                        <Button variant="destructive" size="sm" className="mt-3" onClick={handleResetAccount}>
                          Reset Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;

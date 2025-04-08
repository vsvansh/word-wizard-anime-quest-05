
import NavBar from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Settings, Moon, Sun, Volume2, Volume1, VolumeX, AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [soundEffects, setSoundEffects] = useState(true);
  const [backgroundMusic, setBackgroundMusic] = useState(true);
  const [notifications, setNotifications] = useState(true);
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
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container max-w-4xl pt-24 pb-12 px-4 md:px-6">
        <section className="py-6">
          <div className="flex items-center gap-2 mb-8">
            <Settings className="h-6 w-6 text-wizard-purple" />
            <h1 className="text-3xl md:text-4xl font-manga font-bold bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
              Settings
            </h1>
          </div>
          
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="sound">Sound</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold">Theme</h2>
                <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? (
                      <Moon className="h-5 w-5 text-wizard-blue" />
                    ) : (
                      <Sun className="h-5 w-5 text-wizard-yellow" />
                    )}
                    <span>Dark Mode</span>
                  </div>
                  <Switch 
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sound" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold">Sound Settings</h2>
                <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-wizard-purple" />
                    <span>Sound Effects</span>
                  </div>
                  <Switch 
                    checked={soundEffects}
                    onCheckedChange={setSoundEffects}
                  />
                </div>
                
                <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <Volume1 className="h-5 w-5 text-wizard-purple" />
                    <span>Background Music</span>
                  </div>
                  <Switch 
                    checked={backgroundMusic}
                    onCheckedChange={setBackgroundMusic}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold">Notification Settings</h2>
                <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <VolumeX className="h-5 w-5 text-wizard-purple" />
                    <span>Game Notifications</span>
                  </div>
                  <Switch 
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="danger" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-manga font-bold text-destructive">Danger Zone</h2>
                <div className="bg-card/50 border border-destructive/20 p-6 rounded-lg space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <h3 className="font-bold">Reset Game Progress</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">This will reset all your game statistics, streaks and achievements.</p>
                    <Button variant="destructive" size="sm" onClick={handleResetProgress}>
                      Reset Progress
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-5 w-5 text-destructive" />
                      <h3 className="font-bold">Reset Account</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">This will reset your account to default settings including all preferences.</p>
                    <Button variant="destructive" size="sm" onClick={handleResetAccount}>
                      Reset Account
                    </Button>
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

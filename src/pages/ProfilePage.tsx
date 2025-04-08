
import NavBar from '@/components/NavBar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Award, Bookmark, Calendar } from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container max-w-4xl pt-24 pb-12 px-4 md:px-6">
        <section className="py-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
            <Avatar className="h-24 w-24 border-4 border-wizard-purple">
              <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=WordWizard" alt="User Avatar" />
              <AvatarFallback>WW</AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-manga font-bold bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
                Word Wizard
              </h1>
              <p className="text-muted-foreground">Joined April 2023</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <Badge variant="outline" className="bg-wizard-purple/10 text-wizard-purple border-wizard-purple/20">
                  <Trophy className="h-3 w-3 mr-1" /> Master Wizard
                </Badge>
                <Badge variant="outline" className="bg-wizard-blue/10 text-wizard-blue border-wizard-blue/20">
                  <Star className="h-3 w-3 mr-1" /> 30 Day Streak
                </Badge>
                <Badge variant="outline" className="bg-wizard-green/10 text-wizard-green border-wizard-green/20">
                  <Award className="h-3 w-3 mr-1" /> 100% Daily Challenges
                </Badge>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-manga">Games Played</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-wizard-purple">157</p>
                    <p className="text-sm text-muted-foreground">+23 this week</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-manga">Win Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-wizard-blue">78%</p>
                    <p className="text-sm text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-manga">Current Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-wizard-green">30</p>
                    <p className="text-sm text-muted-foreground">Best: 45 days</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Guess Distribution</CardTitle>
                  <CardDescription>Number of guesses needed to solve puzzles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6].map(guess => (
                      <div key={guess} className="flex items-center">
                        <span className="w-4 text-sm font-medium">{guess}</span>
                        <div className="ml-2 flex-1 h-6 bg-card overflow-hidden rounded">
                          <div 
                            className={`h-full ${guess === 3 ? 'bg-wizard-green' : 'bg-wizard-purple'}`}
                            style={{ width: `${[10, 25, 40, 15, 7, 3][guess-1]}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm">{[10, 25, 40, 15, 7, 3][guess-1]}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: "First Victory", description: "Complete your first puzzle", icon: Trophy, completed: true },
                  { title: "Word Master", description: "Solve 10 puzzles in a row", icon: Award, completed: true },
                  { title: "Speed Demon", description: "Solve a puzzle in under 60 seconds", icon: Star, completed: true },
                  { title: "Perfect Week", description: "Complete all daily challenges for a week", icon: Calendar, completed: true },
                  { title: "Vocabulary King", description: "Learn 100 new words", icon: Bookmark, completed: false },
                  { title: "Wizard Supreme", description: "Reach a 50-day streak", icon: Trophy, completed: false },
                ].map((achievement, index) => (
                  <Card key={index} className={`${!achievement.completed ? 'opacity-60' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-manga">{achievement.title}</CardTitle>
                        <achievement.icon className={`h-5 w-5 ${achievement.completed ? 'text-wizard-yellow' : 'text-muted-foreground'}`} />
                      </div>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge 
                        variant={achievement.completed ? "default" : "outline"}
                        className={achievement.completed ? "bg-wizard-green" : ""}
                      >
                        {achievement.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Games</CardTitle>
                  <CardDescription>Your last 5 games played</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { date: "Today", word: "WIZARD", solved: true, attempts: 4 },
                      { date: "Yesterday", word: "SPELL", solved: true, attempts: 3 },
                      { date: "Apr 6", word: "MAGIC", solved: true, attempts: 2 },
                      { date: "Apr 5", word: "POTION", solved: false, attempts: 6 },
                      { date: "Apr 4", word: "WAND", solved: true, attempts: 3 }
                    ].map((game, index) => (
                      <div key={index} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{game.date}</p>
                          <p className="text-sm text-muted-foreground">Word: {game.word}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={game.solved ? "default" : "destructive"}
                            className={game.solved ? "bg-wizard-green" : ""}
                          >
                            {game.solved ? `Solved in ${game.attempts}` : "Failed"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;

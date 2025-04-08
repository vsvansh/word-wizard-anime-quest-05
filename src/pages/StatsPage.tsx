
import NavBar from '@/components/NavBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Trophy, Award, Timer, Calendar } from "lucide-react";

const StatsPage = () => {
  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', games: 5, wins: 4 },
    { day: 'Tue', games: 3, wins: 2 },
    { day: 'Wed', games: 7, wins: 5 },
    { day: 'Thu', games: 2, wins: 2 },
    { day: 'Fri', games: 6, wins: 4 },
    { day: 'Sat', games: 8, wins: 6 },
    { day: 'Sun', games: 4, wins: 3 },
  ];
  
  const pieData = [
    { name: '1st Try', value: 5 },
    { name: '2nd Try', value: 12 },
    { name: '3rd Try', value: 20 },
    { name: '4th Try', value: 8 },
    { name: '5th Try', value: 3 },
    { name: '6th Try', value: 2 },
  ];
  
  const COLORS = ['#4ADE80', '#38BDF8', '#8B5CF6', '#F472B6', '#FACC15', '#FB7185'];
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        <section className="py-6">
          <h1 className="text-3xl md:text-4xl font-manga font-bold text-center mb-8 bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
            Your Word Wizard Statistics
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-wizard-yellow" />
                  <CardTitle className="text-lg font-manga">Games Won</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-wizard-purple">124</p>
                <p className="text-sm text-muted-foreground">Out of 157 played</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-wizard-yellow" />
                  <CardTitle className="text-lg font-manga">Win Rate</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-wizard-blue">78%</p>
                <p className="text-sm text-muted-foreground">Average success rate</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-wizard-yellow" />
                  <CardTitle className="text-lg font-manga">Avg. Time</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-wizard-pink">2:45</p>
                <p className="text-sm text-muted-foreground">Best: 0:58</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-wizard-yellow" />
                  <CardTitle className="text-lg font-manga">Streak</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-wizard-green">30</p>
                <p className="text-sm text-muted-foreground">Best: 45 days</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Games played and won this week</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'games' ? 'Games Played' : 'Games Won']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Bar dataKey="games" name="Games Played" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="wins" name="Games Won" fill="#4ADE80" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Guess Distribution</CardTitle>
                <CardDescription>Number of guesses needed to solve puzzles</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} games`, 'Solved in']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Your game performance over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { month: 'Jan', winRate: 65, avgGuesses: 4.2 },
                    { month: 'Feb', winRate: 70, avgGuesses: 3.9 },
                    { month: 'Mar', winRate: 74, avgGuesses: 3.5 },
                    { month: 'Apr', winRate: 78, avgGuesses: 3.2 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8B5CF6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#FACC15" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="winRate" name="Win Rate (%)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="avgGuesses" name="Avg. Guesses" fill="#FACC15" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default StatsPage;

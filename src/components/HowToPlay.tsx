
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HowToPlay = () => {
  return (
    <Card className="anime-card w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-manga bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
          How to Play Word Wizard
        </CardTitle>
        <CardDescription>
          Learn the rules and strategies to become a Word Wizard master!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-wizard-purple">Game Rules</h3>
          <p className="text-muted-foreground">
            Word Wizard is a word-guessing puzzle game where you have 6 attempts to guess the secret word.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
            <li>Each guess must be a valid word</li>
            <li>The color of the tiles changes after each guess to show how close you are</li>
            <li>Complete the daily challenge to build your streak!</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-wizard-purple">Tile Colors</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="puzzle-letter puzzle-letter-correct">A</div>
              <p className="text-muted-foreground">
                <span className="font-bold">Green</span>: The letter is in the word and in the correct position.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="puzzle-letter puzzle-letter-wrong-position">B</div>
              <p className="text-muted-foreground">
                <span className="font-bold">Yellow</span>: The letter is in the word but in the wrong position.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="puzzle-letter puzzle-letter-incorrect">C</div>
              <p className="text-muted-foreground">
                <span className="font-bold">Gray</span>: The letter is not in the word.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-wizard-purple">Hints</h3>
          <p className="text-muted-foreground">
            If you're stuck, you can use up to 2 hints per puzzle:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
            <li>The hint reveals a correct letter in your current guess</li>
            <li>Use hints wisely - they're limited!</li>
            <li>Hint buttons appear above the puzzle board</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-wizard-purple">Strategy Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
            <li>Start with words that have common letters (E, A, R, I, O, T)</li>
            <li>Pay attention to eliminated letters</li>
            <li>Look for patterns in the revealed positions</li>
            <li>Save your hints for when you're really stuck</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default HowToPlay;

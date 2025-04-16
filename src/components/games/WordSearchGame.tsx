
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CheckCircle, Clock3, RefreshCw } from 'lucide-react';
import audioManager from '@/lib/audioManager';

interface WordSearchProps {
  difficulty?: 'easy' | 'normal' | 'hard';
  onComplete?: (score: number) => void;
  timeLimit?: number;
}

interface Position {
  row: number;
  col: number;
}

interface Cell {
  letter: string;
  selected: boolean;
  isPartOfWord: boolean;
  discovered: boolean;
}

interface Word {
  word: string;
  found: boolean;
  positions: Position[];
}

interface Selection {
  start: Position | null;
  current: Position | null;
  path: Position[];
}

const animeWords = [
  'NARUTO', 'GOKU', 'LUFFY', 'EREN', 'SASUKE', 'MIKASA', 'SAITAMA',
  'DEKU', 'ICHIGO', 'TANJIRO', 'LIGHT', 'LEVI', 'SPIKE', 'LELOUCH',
  'NATSU', 'EDWARD', 'GOJO', 'REM', 'ASUNA', 'KILLUA'
];

const WordSearchGame: React.FC<WordSearchProps> = ({ 
  difficulty = 'normal', 
  onComplete, 
  timeLimit = 180 
}) => {
  const gridSize = difficulty === 'easy' ? 8 : difficulty === 'normal' ? 10 : 12;
  const wordCount = difficulty === 'easy' ? 5 : difficulty === 'normal' ? 8 : 10;
  
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [selection, setSelection] = useState<Selection>({
    start: null,
    current: null,
    path: []
  });
  const [timer, setTimer] = useState(timeLimit);
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed' | 'timeup'>('playing');
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const [isSelecting, setIsSelecting] = useState(false);
  
  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [difficulty]);
  
  // Game timer
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameStatus('timeup');
          audioManager.playSound('wrong');
          
          if (onComplete) {
            onComplete(score);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameStatus]);
  
  // Check if all words are found
  useEffect(() => {
    if (words.length === 0 || gameStatus !== 'playing') return;
    
    if (words.every(word => word.found)) {
      setGameStatus('completed');
      audioManager.playSound('win');
      
      // Calculate final score - base score + time bonus
      const finalScore = score + Math.floor(timer / 2);
      setScore(finalScore);
      
      if (onComplete) {
        onComplete(finalScore);
      }
    }
  }, [words, gameStatus]);
  
  const initializeGame = useCallback(() => {
    // Select random words for the game
    const shuffledWords = [...animeWords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, wordCount);
    
    // Create empty grid
    const emptyGrid: Cell[][] = Array(gridSize).fill(0).map(() => 
      Array(gridSize).fill(0).map(() => ({
        letter: '',
        selected: false,
        isPartOfWord: false,
        discovered: false
      }))
    );
    
    const placedWords: Word[] = [];
    
    // Place words in the grid in random directions
    for (const word of selectedWords) {
      const directions = [
        { dr: 0, dc: 1 },  // right
        { dr: 1, dc: 0 },  // down
        { dr: 1, dc: 1 },  // diagonal down-right
        { dr: -1, dc: 0 }, // up
        { dr: 0, dc: -1 }, // left
        { dr: -1, dc: 1 }, // diagonal up-right
        { dr: 1, dc: -1 }, // diagonal down-left
        { dr: -1, dc: -1 } // diagonal up-left
      ];
      
      // Try placing the word
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        // Pick a random direction
        const direction = directions[Math.floor(Math.random() * directions.length)];
        
        // Pick a random starting position
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);
        
        // Check if the word fits in this direction
        let fits = true;
        let positions: Position[] = [];
        
        for (let i = 0; i < word.length; i++) {
          const row = startRow + i * direction.dr;
          const col = startCol + i * direction.dc;
          
          // Check if position is valid and empty or has the same letter
          if (
            row < 0 || row >= gridSize || col < 0 || col >= gridSize ||
            (emptyGrid[row][col].letter !== '' && emptyGrid[row][col].letter !== word[i])
          ) {
            fits = false;
            break;
          }
          
          positions.push({ row, col });
        }
        
        // Place the word if it fits
        if (fits) {
          positions.forEach((pos, i) => {
            emptyGrid[pos.row][pos.col] = {
              letter: word[i],
              selected: false,
              isPartOfWord: true,
              discovered: false
            };
          });
          
          placedWords.push({
            word,
            found: false,
            positions
          });
          
          placed = true;
        }
        
        attempts++;
      }
    }
    
    // Fill empty cells with random letters
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (emptyGrid[row][col].letter === '') {
          const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
          emptyGrid[row][col] = {
            letter: randomLetter,
            selected: false,
            isPartOfWord: false,
            discovered: false
          };
        }
      }
    }
    
    setGrid(emptyGrid);
    setWords(placedWords);
    setTimer(timeLimit);
    setGameStatus('playing');
    setScore(0);
    setSelection({ start: null, current: null, path: [] });
  }, [difficulty, gridSize, wordCount, timeLimit]);
  
  const handleCellMouseDown = (row: number, col: number) => {
    if (gameStatus !== 'playing') return;
    
    setIsSelecting(true);
    
    const newSelection: Selection = {
      start: { row, col },
      current: { row, col },
      path: [{ row, col }]
    };
    
    setSelection(newSelection);
    
    // Update grid to show selection
    const newGrid = [...grid];
    newGrid[row][col] = {
      ...newGrid[row][col],
      selected: true
    };
    
    setGrid(newGrid);
    
    audioManager.playSound('click');
  };
  
  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isSelecting || gameStatus !== 'playing') return;
    
    // Only update if this creates a valid line
    if (selection.start && selection.current) {
      // Check if the movement is in a straight line (horizontal, vertical, diagonal)
      const startRow = selection.start.row;
      const startCol = selection.start.col;
      
      // Get direction vector
      const deltaRow = row - startRow;
      const deltaCol = col - startCol;
      
      // If zero, this is the start cell
      if (deltaRow === 0 && deltaCol === 0) return;
      
      // Calculate greatest common divisor to check if this is a straight line
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const divisor = Math.abs(gcd(deltaRow, deltaCol));
      
      // Unit direction vector
      const dirRow = deltaRow / divisor;
      const dirCol = deltaCol / divisor;
      
      // Now check all cells in the path to see if they make a straight line
      const path: Position[] = [];
      let validPath = true;
      
      for (let i = 0; i <= divisor; i++) {
        const pathRow = startRow + dirRow * i;
        const pathCol = startCol + dirCol * i;
        
        // Check if this is a valid grid position
        if (
          pathRow < 0 || pathRow >= gridSize || 
          pathCol < 0 || pathCol >= gridSize ||
          !Number.isInteger(pathRow) || 
          !Number.isInteger(pathCol)
        ) {
          validPath = false;
          break;
        }
        
        path.push({ row: pathRow, col: pathCol });
      }
      
      if (validPath) {
        // Update grid to show selection
        const newGrid = grid.map((rowArr, r) =>
          rowArr.map((cell, c) => ({
            ...cell,
            selected: path.some(pos => pos.row === r && pos.col === c)
          }))
        );
        
        setGrid(newGrid);
        setSelection({
          start: selection.start,
          current: { row, col },
          path
        });
      }
    }
  };
  
  const handleCellMouseUp = () => {
    if (!isSelecting || gameStatus !== 'playing') return;
    
    setIsSelecting(false);
    
    // Check if the selected path forms a word
    if (selection.path.length > 1) {
      const selectedText = selection.path
        .map(pos => grid[pos.row][pos.col].letter)
        .join('');
      
      // Also check reversed text
      const reversedText = selectedText.split('').reverse().join('');
      
      // Check if the selected text is one of the words
      const wordIndex = words.findIndex(
        w => w.word === selectedText || w.word === reversedText
      );
      
      if (wordIndex >= 0 && !words[wordIndex].found) {
        // Word found!
        const newWords = [...words];
        newWords[wordIndex].found = true;
        setWords(newWords);
        
        // Update grid to show discovered word
        const newGrid = [...grid];
        selection.path.forEach(pos => {
          newGrid[pos.row][pos.col] = {
            ...newGrid[pos.row][pos.col],
            discovered: true
          };
        });
        
        // Add points
        const pointsGained = words[wordIndex].word.length * 10;
        setScore(prev => prev + pointsGained);
        
        toast({
          title: "Word Found!",
          description: `You found ${words[wordIndex].word} for ${pointsGained} points!`,
        });
        
        audioManager.playSound('correct');
        
        setGrid(newGrid);
      } else {
        // Not a valid word, reset selection
        audioManager.playSound('typing');
      }
    }
    
    // Reset selection
    const newGrid = grid.map(rowArr =>
      rowArr.map(cell => ({
        ...cell,
        selected: false
      }))
    );
    
    setGrid(newGrid);
    setSelection({ start: null, current: null, path: [] });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="word-search-game p-2 sm:p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Clock3 className="h-4 w-4 text-wizard-blue" />
          <span className={`font-mono font-bold ${timer <= 30 ? 'text-wizard-pink animate-pulse' : 'text-wizard-blue'}`}>
            {formatTime(timer)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-wizard-purple">Score: {score}</span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => initializeGame()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {words.map((word, i) => (
          <div 
            key={i}
            className={`text-sm px-2 py-1 rounded-full flex items-center
              ${word.found 
                ? 'bg-wizard-green/20 text-wizard-green' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            {word.found && <CheckCircle className="h-3 w-3 mr-1" />}
            {word.word}
          </div>
        ))}
      </div>
      
      <motion.div 
        className="grid gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={`
                flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md font-bold text-sm
                ${cell.discovered ? 'bg-wizard-green-dark/90 text-white' : ''}
                ${cell.selected && !cell.discovered ? 'bg-wizard-purple-dark/90 text-white' : ''}
                ${!cell.selected && !cell.discovered ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}
                transition-colors duration-200
                cursor-pointer select-none
              `}
              onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
              onMouseUp={handleCellMouseUp}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {cell.letter}
            </motion.div>
          ))
        )}
      </motion.div>
      
      {gameStatus === 'completed' && (
        <motion.div
          className="mt-4 p-3 bg-wizard-green/20 border border-wizard-green/30 rounded-lg text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-manga text-lg text-wizard-green">Complete!</h3>
          <p className="text-sm">Final Score: <span className="font-bold">{score}</span></p>
          <p className="text-xs text-gray-500">Time Bonus: +{Math.floor(timer / 2)} points</p>
        </motion.div>
      )}
      
      {gameStatus === 'timeup' && (
        <motion.div
          className="mt-4 p-3 bg-wizard-pink/20 border border-wizard-pink/30 rounded-lg text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-manga text-lg text-wizard-pink">Time's Up!</h3>
          <p className="text-sm">Final Score: <span className="font-bold">{score}</span></p>
          <p className="text-xs text-gray-500">Found {words.filter(w => w.found).length} of {words.length} words</p>
        </motion.div>
      )}
    </div>
  );
};

export default WordSearchGame;


import React from 'react';
import { SendHorizontal, Delete } from 'lucide-react';
import { motion } from 'framer-motion';

interface KeyboardProps {
  onLetterInput: (letter: string) => void;
  onBackspace: () => void;
  onSubmitGuess: () => void;
  getKeyColorClass: (key: string) => string;
}

const Keyboard: React.FC<KeyboardProps> = ({
  onLetterInput,
  onBackspace,
  onSubmitGuess,
  getKeyColorClass
}) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleKeyClick = (key: string) => {
    onLetterInput(key);
  };

  // Add keyboard event listener for physical keyboard support
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      
      // Handle letter keys
      if (/^[A-Z]$/.test(key)) {
        onLetterInput(key);
      }
      // Handle Enter key
      else if (event.key === 'Enter') {
        onSubmitGuess();
      }
      // Handle Backspace key
      else if (event.key === 'Backspace') {
        onBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onLetterInput, onBackspace, onSubmitGuess]);

  return (
    <div className="w-full max-w-lg mx-auto mt-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2">
          {rowIndex === 2 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="h-12 px-3 rounded-lg mr-1 bg-wizard-blue text-white font-bold flex items-center justify-center"
              onClick={onSubmitGuess}
            >
              <SendHorizontal className="h-5 w-5" />
            </motion.button>
          )}
          {row.map((key) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.95 }}
              className={`key-button w-8 h-12 mx-1 rounded-lg font-bold text-lg flex items-center justify-center transition-colors ${getKeyColorClass(key) || 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
              onClick={() => handleKeyClick(key)}
            >
              {key}
            </motion.button>
          ))}
          {rowIndex === 2 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="h-12 px-3 rounded-lg ml-1 bg-wizard-pink text-white font-bold flex items-center justify-center"
              onClick={onBackspace}
            >
              <Delete className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      ))}
      
      <style>
        {`
          .key-button {
            min-width: 36px;
            transition: all 0.2s;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .key-button:active {
            transform: translateY(1px);
          }
          @media (max-width: 480px) {
            .key-button {
              min-width: 28px;
              height: 42px;
              font-size: 14px;
              margin: 0 2px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Keyboard;

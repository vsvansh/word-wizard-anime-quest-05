
export interface EvaluationCell {
  letter: string;
  status: 'correct' | 'wrong-position' | 'incorrect';
}

/**
 * Evaluates a guess against the target word
 * @param guess - The player's guess
 * @param targetWord - The word to guess
 * @returns An array of evaluation cells
 */
export const evaluateGuess = (guess: string, targetWord: string): EvaluationCell[] => {
  const result: EvaluationCell[] = Array(targetWord.length).fill({
    letter: '',
    status: 'incorrect'
  });

  const guessArray = guess.toUpperCase().split('');
  const targetArray = targetWord.toUpperCase().split('');
  const targetCopy = [...targetArray];
  
  // First pass - find correct letters
  for (let i = 0; i < guessArray.length; i++) {
    const guessLetter = guessArray[i];
    
    if (guessLetter === targetArray[i]) {
      // Letter is in the correct position
      result[i] = {
        letter: guessLetter,
        status: 'correct'
      };
      // Mark as used in target copy
      targetCopy[i] = '#';
    }
  }
  
  // Second pass - find misplaced letters
  for (let i = 0; i < guessArray.length; i++) {
    const guessLetter = guessArray[i];
    
    // Skip letters that were already marked as correct
    if (result[i].status === 'correct') continue;
    
    const indexInTarget = targetCopy.indexOf(guessLetter);
    if (indexInTarget !== -1) {
      // Letter exists in the word but in wrong position
      result[i] = {
        letter: guessLetter,
        status: 'wrong-position'
      };
      // Mark as used
      targetCopy[indexInTarget] = '#';
    } else {
      // Letter doesn't exist in the word
      result[i] = {
        letter: guessLetter,
        status: 'incorrect'
      };
    }
  }
  
  return result;
};

/**
 * Calculates a score based on the number of guesses made
 * @param wordLength - Length of the word
 * @param guessCount - Number of guesses used
 * @param maxGuesses - Maximum allowed guesses
 * @returns Score as a number
 */
export const calculateScore = (wordLength: number, guessCount: number, maxGuesses: number): number => {
  const baseScore = wordLength * 10;
  const guessBonus = Math.max(0, maxGuesses - guessCount) * 5;
  return baseScore + guessBonus;
};

/**
 * Checks if the given word follows puzzle game rules
 * @param word - Word to validate
 * @returns True if valid, false otherwise
 */
export const isValidWord = (word: string): boolean => {
  // Should contain only letters
  return /^[A-Za-z]+$/.test(word);
};

/**
 * Gets a hint for the given word
 * @param word - Target word
 * @param revealedIndices - Indices already revealed
 * @returns Index of a letter to reveal as a hint
 */
export const getLetterHint = (word: string, revealedIndices: number[]): number => {
  // Find indices not yet revealed
  const availableIndices = Array.from({ length: word.length }, (_, i) => i)
    .filter(i => !revealedIndices.includes(i));
  
  if (availableIndices.length === 0) return -1;
  
  // Return a random available index
  return availableIndices[Math.floor(Math.random() * availableIndices.length)];
};

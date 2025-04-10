
// Game logic utilities for Word Wizard game

interface EvaluationCell {
  letter: string;
  status: 'correct' | 'wrong-position' | 'incorrect';
}

/**
 * Evaluates a guess against the target word
 * 
 * @param guess - The player's guess
 * @param targetWord - The word to guess
 * @returns Array of evaluation cells with letter and status
 */
export function evaluateGuess(guess: string, targetWord: string): EvaluationCell[] {
  // Convert both strings to uppercase for case-insensitive comparison
  const guessUpper = guess.toUpperCase();
  const targetUpper = targetWord.toUpperCase();
  
  if (guessUpper.length !== targetUpper.length) {
    throw new Error('Guess length must match target word length');
  }
  
  // Initialize evaluation with all incorrect statuses
  const evaluation: EvaluationCell[] = guessUpper.split('').map(letter => ({
    letter,
    status: 'incorrect'
  }));
  
  // Track which letters in the target word have been matched
  const targetLettersRemaining = targetUpper.split('');
  
  // First pass: Find correct positions
  for (let i = 0; i < guessUpper.length; i++) {
    if (guessUpper[i] === targetUpper[i]) {
      evaluation[i].status = 'correct';
      
      // Remove this letter from remaining target letters to prevent double matching
      const index = targetLettersRemaining.indexOf(guessUpper[i]);
      if (index !== -1) {
        targetLettersRemaining.splice(index, 1);
      }
    }
  }
  
  // Second pass: Find wrong positions
  for (let i = 0; i < guessUpper.length; i++) {
    // Skip already marked as correct
    if (evaluation[i].status === 'correct') continue;
    
    const index = targetLettersRemaining.indexOf(guessUpper[i]);
    if (index !== -1) {
      evaluation[i].status = 'wrong-position';
      
      // Remove this letter from remaining target letters
      targetLettersRemaining.splice(index, 1);
    }
  }
  
  return evaluation;
}

/**
 * Check if a word is valid according to the game's dictionary
 * 
 * @param word - The word to validate
 * @param dictionary - Array of valid words
 * @returns Boolean indicating if the word is valid
 */
export function isValidWord(word: string, dictionary: string[]): boolean {
  return dictionary.includes(word.toLowerCase());
}

/**
 * Generate a random word from a dictionary
 * 
 * @param dictionary - Array of words to choose from
 * @param minLength - Minimum word length (default: 4)
 * @param maxLength - Maximum word length (default: 7)
 * @returns A random word
 */
export function getRandomWord(
  dictionary: string[],
  minLength = 4,
  maxLength = 7
): string {
  const filteredWords = dictionary.filter(
    word => word.length >= minLength && word.length <= maxLength
  );
  
  if (filteredWords.length === 0) {
    throw new Error('No words matching the length criteria in the dictionary');
  }
  
  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex].toUpperCase();
}

/**
 * Gets a word based on the current date (for daily challenges)
 * 
 * @param dictionary - Array of words to choose from 
 * @returns Word for today's challenge
 */
export function getDailyWord(dictionary: string[]): string {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  // Use a simple hash function to get a consistent index for the day
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Get positive index within the dictionary length
  const index = Math.abs(hash) % dictionary.length;
  return dictionary[index].toUpperCase();
}

/**
 * Calculate score based on word length and guesses used
 * 
 * @param wordLength - Length of the target word
 * @param guessesUsed - Number of guesses used
 * @param maxGuesses - Maximum allowed guesses
 * @param difficulty - Game difficulty multiplier
 * @returns Calculated score
 */
export function calculateScore(
  wordLength: number,
  guessesUsed: number,
  maxGuesses: number,
  difficulty: number = 1
): number {
  // Base score depends on word length
  const baseScore = wordLength * 10;
  
  // Bonus for using fewer guesses
  const guessBonus = Math.max(0, maxGuesses - guessesUsed) * 5;
  
  // Apply difficulty multiplier
  return Math.floor((baseScore + guessBonus) * difficulty);
}

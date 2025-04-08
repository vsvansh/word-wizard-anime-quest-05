
// Anime-themed word bank for puzzles
const wordBank = [
  "anime", "manga", "otaku", "kawaii", "mecha", "sensei", "chibi", "cosplay", "waifu", 
  "senpai", "shonen", "shoujo", "ninja", "kaiju", "sakura", "bento", "kimono", "katana",
  "geisha", "kabuki", "origami", "samurai", "dragon", "yokai", "onigiri", "ramen", "sushin",
  "futon", "karate", "bonsai", "miyazaki", "ghibli", "gundam", "pokemon", "naruto", "bleach",
  "titan", "demon", "hero", "piece", "death", "note", "sword", "ghost", "fairy", "magic"
];

export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * wordBank.length);
  return wordBank[randomIndex];
};

export default wordBank;


// Anime-themed word bank for puzzles
const wordBank = [
  // Original words
  "anime", "manga", "otaku", "kawaii", "mecha", "sensei", "chibi", "cosplay", "waifu", 
  "senpai", "shonen", "shoujo", "ninja", "kaiju", "sakura", "bento", "kimono", "katana",
  "geisha", "kabuki", "origami", "samurai", "dragon", "yokai", "onigiri", "ramen", "sushi",
  "futon", "karate", "bonsai", "miyazaki", "ghibli", "gundam", "pokemon", "naruto", "bleach",
  "titan", "demon", "hero", "piece", "death", "note", "sword", "ghost", "fairy", "magic",
  
  // Added more anime-related words
  "jutsu", "chakra", "byakugan", "sharingan", "quirk", "plus", "ultra", "bankai", "hokage",
  "titan", "alchemy", "saiyan", "yasha", "sailor", "joestar", "stand", "nezuko", "tanjiro",
  "pikachu", "snorlax", "luffy", "zoro", "sanji", "goku", "vegeta", "spike", "bebop", "akira",
  "totoro", "haku", "chihiro", "ponyo", "howl", "mononoke", "ashitaka", "kiki", "jiji", "calcifer",
  "edward", "alphonse", "mustang", "hawkeye", "kirito", "asuna", "mikasa", "eren", "armin", "levi",
  "sailor", "moon", "madoka", "homura", "ryuko", "satsuki", "mako", "kamina", "simon", "yoko",
  "reigen", "mob", "teru", "dimple", "ritsu", "deku", "bakugo", "todoroki", "allmight", "endeavor",
  "makima", "denji", "power", "aki", "kobeni", "violet", "gilbert", "hodgins", "dietfried", "claudia",
  "marin", "gojo", "jujutsu", "kaisen", "itadori", "megumi", "nobara", "gojo", "sukuna", "mahito",
  
  // Adding even more anime terms
  "kamehameha", "rasengan", "chidori", "susanoo", "kyuubi", "avatar", "bender", "airbender",
  "firebender", "waterbender", "earthbender", "asta", "yuno", "clover", "grimoire", "wizard",
  "hunter", "nen", "hisoka", "killua", "gon", "kurapika", "leorio", "phantom", "troupe", "eva",
  "shinji", "rei", "asuka", "angel", "neon", "genesis", "instrumentality", "aincrad", "alfheim",
  "underworld", "nerve", "gear", "beater", "clearer", "floor", "boss", "trigger", "kill", "matoi",
  "scissor", "blade", "nudist", "beach", "fiber", "life", "ragyo", "junketsu", "senketsu", "club",
  "honnouji", "academy", "alchemist", "brotherhood", "philosopher", "stone", "homunculus", "truth",
  "equivalent", "exchange", "gate", "automail", "metal", "fullmetal", "state", "domain", "expansion",
  "limitless", "cursed", "technique", "fushiguro", "kugisaki", "yuta", "maki", "panda", "inumaki",
  "cursed", "energy", "vessel", "boogie", "woogie", "straw", "hat", "pirate", "king", "monkey"
];

export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * wordBank.length);
  return wordBank[randomIndex];
};

export default wordBank;

export const ranks = [
  { level: 1, title: "Beginner Scholar" },
  { level: 5, title: "Knowledge Seeker" },
  { level: 10, title: "Academic Adept" },
  { level: 15, title: "Wisdom Weaver" },
  { level: 20, title: "Learning Legend" },
  { level: 25, title: "Genius" },
];

export const getLevelTitle = (level: number): string => {
  const rank = ranks.find(r => level >= r.level);
  return rank ? rank.title : "Beginner Scholar";
};

export const calculateXPForNextLevel = (currentLevel: number): number => {
  // Simple XP calculation: each level requires more XP
  return currentLevel * 1000;
};

export const calculateProgressPercentage = (currentXP: number, xpForNextLevel: number): number => {
  return Math.min(100, (currentXP / xpForNextLevel) * 100);
}; 
export const getAverage = (nums: number[]) => {
  const sum = nums.reduce((a, b) => a + b, 0);
  const avg = sum / nums.length || 0;
  return avg;
};

export function getRandomNumberBetween(start: number, end: number) {
  return Math.floor(Math.random() * end) + start;
}

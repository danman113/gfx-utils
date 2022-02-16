export const rand = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min)) + min
export const randFloat = (min: number, max: number): number => Math.random() * (max - min) + min
/**
 * Clamps value N from min to max
 * @param n 
 * @param min 
 * @param max 
 * @returns 
 */
export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n))
/**
 * Rounds n to the nearest multiple
 * @param n 
 * @param multiple 
 * @returns 
 */
export const roundTo = (n: number, multiple: number) => Math.round(n / multiple) * multiple
export const multiRand = (n: number, min: number, max: number) => {
  let sum = 0
  for (let i = 0; i < n; i++) {
    sum += rand(min, max)
  }
  return Math.round(sum / n)
}
export const multiRandFloat = (n: number, min: number, max: number) => {
  let sum = 0
  for (let i = 0; i < n; i++) {
    sum += randFloat(min, max)
  }
  return sum / n
}

export const mean = (arr: number[]) => arr.reduce((acc, val) => acc + val, 0) / arr.length
export const variance = (arr: number[]) => {
  const m = mean(arr)
  return arr.reduce((acc, val) => acc + (val - m) * (val - m)) / arr.length
}
export const standardDeviation = (arr: number[]) => Math.sqrt(variance(arr))

/**
 * Linearly interpolates value n [0.0 -> 1.0) from start to stop
 * @param n 
 * @param start 
 * @param stop 
 * @returns 
 */
export const lerp = (n: number, start: number, stop: number) => n * (stop - start) + start

/**
 * Maps value n from range [a1, a2] to [b1, b2]
 * @param n 
 * @param a1 
 * @param a2 
 * @param b1 
 * @param b2 
 * @returns 
 */
export const mapValue = (n: number, a1: number, a2: number, b1: number, b2: number) => lerp((n - a1) / (a2 - a1), b1, b2)
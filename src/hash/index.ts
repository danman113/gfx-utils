/**
 * Simple 32 bit hash on a string
 * @param str String to hash
 * @returns 32bit unsigned number
 */
export const hashStr = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; ++i)
    hash = Math.imul(31, hash) + str.charCodeAt(i)
  return hash | 0
}

/**
 * Simple 32 bit hash on number array
 * @param arr Array of numbers to hash
 * @returns 32bit unsigned number
 */
export const hashArray = (arr: number[]): number => {
  let hash = 0
  for (let i = 0; i < arr.length; i++)
    hash = Math.imul(31, hash) + arr[i]
  return hash | 0
}

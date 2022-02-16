import { rand } from './math/util'

export const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let n = rand(0, i + 1)
    const x = array[i]
    array[i] = array[n]
    array[n] = x
  }
  return array
}

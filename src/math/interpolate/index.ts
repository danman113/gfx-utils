import { InterpolationFunction, linear } from './functions'

export const interpolate = (
  t: number,
  a: number,
  b: number,
  func: InterpolationFunction = linear
) => {
  const v = func(t)
  return b * v + a * (1 - v)
}

export type { InterpolationFunction } from './functions'
export * as InterpolationFunctions from './functions'

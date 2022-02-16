import { cubicBezier } from './cubicBezier'

export type InterpolationFunction = (t: number) => number
export const linear = (t: number) => t
export const smoothstep: InterpolationFunction = (t) => t * t * (3 - 2 * t)
export const smootherstep: InterpolationFunction = (x) => x * x * x * (x * (x * 6 - 15) + 10)
export const catmullrom = (p0: number, p1: number, p2: number, p3: number) => (t: number) =>
  0.5 *
  (2 * p1 +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t)
export const easeOutBounce = (x: number): number => {
  const n1 = 7.5625
  const d1 = 2.75

  if (x < 1 / d1) {
    return n1 * x * x
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375
  }
}

export const cb = cubicBezier(0.58, -0.32, 0.74, 0.05)
// For more https://easings.net/

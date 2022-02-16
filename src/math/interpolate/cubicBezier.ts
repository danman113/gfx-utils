// Shamelessly ported from http://www.flong.com/texts/code/shapers_bez/
import { clamp } from '../util'

export const cubicBezier = (a: number, b: number, c: number, d: number) => (t: number) => {
  let y0a = 0.0 // initial y
  let x0a = 0.0 // initial x
  let y1a = b // 1st influence y
  let x1a = a // 1st influence x
  let y2a = d // 2nd influence y
  let x2a = c // 2nd influence x
  let y3a = 1.0 // final y
  let x3a = 1.0 // final x

  let A = x3a - 3 * x2a + 3 * x1a - x0a
  let B = 3 * x2a - 6 * x1a + 3 * x0a
  let C = 3 * x1a - 3 * x0a
  let D = x0a

  let E = y3a - 3 * y2a + 3 * y1a - y0a
  let F = 3 * y2a - 6 * y1a + 3 * y0a
  let G = 3 * y1a - 3 * y0a
  let H = y0a

  // Solve for t given x (using Newton-Raphelson), then solve for y given t.
  // Assume for the first guess that t = x.
  let currentt = t
  let nRefinementIterations = 5
  for (let i = 0; i < nRefinementIterations; i++) {
    let currentx = xFromT(currentt, A, B, C, D)
    let currentslope = slopeFromT(currentt, A, B, C)
    currentt -= (currentx - t) * currentslope
    currentt = clamp(currentt, 0, 1)
  }

  let y = yFromT(currentt, E, F, G, H)
  return y
}

// Helper functions:
const slopeFromT = (t: number, A: number, B: number, C: number) => {
  let dtdx = 1.0 / (3.0 * A * t * t + 2.0 * B * t + C)
  return dtdx
}

const xFromT = (t: number, A: number, B: number, C: number, D: number) => {
  let x = A * (t * t * t) + B * (t * t) + C * t + D
  return x
}

const yFromT = (t: number, E: number, F: number, G: number, H: number) => {
  let y = E * (t * t * t) + F * (t * t) + G * t + H
  return y
}

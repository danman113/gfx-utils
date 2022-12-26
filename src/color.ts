import { clamp, mapValue } from './math/util'

const hue2rgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t)
  return p
}

/**
 * Converts HSL values (0.0 -> 1.0 x 3) | (0 -> 360, 0 -> 100, 0->100) to rgb (0.0 -> 1.0 x 3)
 * @param h 
 * @param s 
 * @param l 
 * @returns 
 */
export const hslToRgb = (h: number, s: number, l: number) => {
  if (h > 1) h = mapValue(h, 0, 360, 0, 1)
  if (s > 1) s = mapValue(s, 0, 100, 0, 1)
  if (l > 1) l = mapValue(l, 0, 100, 0, 1)
  // h,s,l ranges are in 0.0 - 1.0
  h = clamp(h, 0, 1)
  s = clamp(s, 0, 1)
  l = clamp(l, 0, 1)

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const p = l <= 0.5 ? l * (1 + s) : l + s - l * s
    const q = 2 * l - p

    r = hue2rgb(q, p, h + 1 / 3)
    g = hue2rgb(q, p, h)
    b = hue2rgb(q, p, h - 1 / 3)
  }

  return [r, g, b, 1]
}

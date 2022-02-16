import { vec2 } from 'gl-matrix'

export interface Circle {
  position: vec2
  radius: number
}

export const intersectsCircle = (self: Circle, that: Circle): boolean => {
  const tr = that.radius
  const sr = self.radius
  return vec2.sqrDist(self.position, that.position) < tr * tr * sr * sr
}

export const intersectsPt = (self: Circle, point: vec2): boolean => {
  const sr = self.radius
  return vec2.sqrDist(self.position, point) < sr * sr
}

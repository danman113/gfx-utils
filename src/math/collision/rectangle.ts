import { vec2 } from 'gl-matrix'

export class Rectangle {
  constructor(public x: number, public y: number, public width: number, public height: number) {}
}

export const copy = (self: Rectangle, that: Rectangle): void => {
  self.x = that.x
  self.y = that.y
  self.width = that.width
  self.height = that.height
}

export const intersectsRectangle = (self: Rectangle, that: Rectangle): boolean => {
  const rect1x = self.x
  const rect1y = self.y
  const rect1w = self.width
  const rect1h = self.height
  const rect2x = that.x
  const rect2y = that.y
  const rect2w = that.width
  const rect2h = that.height
  return (
    rect1x + rect1w > rect2x &&
    rect1x < rect2x + rect2w &&
    rect1y + rect1h > rect2y &&
    rect1y < rect2y + rect2h
  )
}

export const intersectsPt = (self: Rectangle, pt: vec2): boolean => {
  const rect1x = self.x
  const rect1y = self.y
  const rect1w = self.width
  const rect1h = self.height
  const rect2x = pt[0]
  const rect2y = pt[1]
  const rect2w = 1
  const rect2h = 1
  return (
    rect1x + rect1w > rect2x &&
    rect1x < rect2x + rect2w &&
    rect1y + rect1h > rect2y &&
    rect1y < rect2y + rect2h
  )
}

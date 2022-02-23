import { vec2 } from 'gl-matrix'

export class Rectangle {
  min = vec2.create()
  max = vec2.create()
  get x() {
    return this.min[0]
  }

  set x(newX: number) {
    this.min[0] = newX
  }
  get y() {
    return this.min[1]
  }
  set y(newY: number) {
    this.min[1] = newY
  }

  get width() {
    return this.max[0] - this.min[0]
  }

  set width(newWidth: number) {
    this.max[0] = this.min[0] + newWidth
  }
  get height() {
    return this.max[1] - this.min[1]
  }
  set height(newHeight: number) {
    this.max[1] = this.min[1] + newHeight
  }
  constructor(x: number, y: number, width: number, height: number) {
    this.min[0] = x
    this.min[1] = y
    this.width = width
    this.height = height
  }
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

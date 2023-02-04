import { Rectangle } from './math/collision/rectangle'
import { vec2 } from 'gl-matrix'
const temp = vec2.fromValues(0, 0)
export type UDim2 = [number, number, number, number]
/**
 * UDim class, similar to roblox
 */
export default class UDim {
  static fromOffset(x: number, y: number): UDim2 {
    return [0, x, 0, y]
  }

  static fromScale(scalex: number, scaley: number): UDim2 {
    return [scalex, 0, scaley, 0]
  }

  static new(scalex: number, offsetx: number, scaley: number, offsety: number): UDim2 {
    return [scalex, offsetx, scaley, offsety]
  }

  static clone(udim: UDim2) {
    return Array.from(udim)
  }

  static copy(copiedTo: UDim2, copyFrom: UDim2) {
    copiedTo[0] = copyFrom[0]
    copiedTo[1] = copyFrom[1]
    copiedTo[2] = copyFrom[2]
    copiedTo[3] = copyFrom[3]
  }

  static toSize (dim: UDim2, parent: Rectangle): vec2 {
    const [scalex, offsetx, scaley, offsety] = dim
    let x = (scalex * parent.width) + offsetx
    let y = (scaley * parent.height) + offsety
    temp[0] = x
    temp[1] = y
    return temp
  }

  static toPosition (dim: UDim2, parent: Rectangle): vec2 {
    const [scalex, offsetx, scaley, offsety] = dim
    let x = parent.x + (scalex * parent.width) + offsetx
    let y = parent.y + (scaley * parent.height) + offsety
    temp[0] = x
    temp[1] = y
    return temp
  }

  static getOffset (dim: UDim2): vec2 {
    temp[0] = dim[1]
    temp[1] = dim[3]
    return temp
  }
  static setOffset(dim: UDim2, x: number, y: number): UDim2 {
    dim[1] = x || dim[1]
    dim[3] = y || dim[3]
    return dim
  }
  static getScale (dim: UDim2): vec2 {
    temp[0] = dim[0]
    temp[1] = dim[2]
    return temp
  }
  static setScale(dim: UDim2, x: number, y: number): UDim2 {
    dim[0] = x || dim[0]
    dim[2] = y || dim[2]
    return dim
  }
}
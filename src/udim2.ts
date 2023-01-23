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
import { vec3 } from 'gl-matrix'
export default class AABB3 {
  constructor(public min = vec3.create(), public max = vec3.create()) {}
  empty() {
    this.max[0] = this.max[1] = this.max[2] = -Infinity
    this.min[0] = this.min[1] = this.min[2] = Infinity
  }

  add(p: vec3) {
    if (p[0] < this.min[0]) this.min[0] = p[0]
    if (p[0] > this.max[0]) this.max[0] = p[0]
    if (p[1] < this.min[0]) this.min[1] = p[1]
    if (p[1] > this.max[0]) this.max[1] = p[1]
    if (p[2] < this.min[0]) this.min[2] = p[2]
    if (p[2] > this.max[0]) this.max[2] = p[2]
  }

  intersects(b: AABB3) {
    const a = this
    return (
      a.min[0] <= b.max[0] &&
      a.max[0] >= b.min[0] &&
      a.min[1] <= b.max[1] &&
      a.max[1] >= b.min[1] &&
      a.min[2] <= b.max[2] &&
      a.max[2] >= b.min[2]
    )
  }
}


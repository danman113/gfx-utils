import { rand } from './math/util'

export const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let n = rand(0, i + 1)
    const x = array[i]
    array[i] = array[n]
    array[n] = x
  }
  return array
}

type Nullable<T> = T | null

export class RingBuffer<T> {
  data: Nullable<T>[]
  start: number = 0
  end: number = 0
  length: number = 0
  constructor(public size: number, public fill: Nullable<T> = null) {
    this.data = Array(size).fill(null)
  }

  push(elem: T): boolean {
    const overwrite = (this.length + 1) > this.size
    this.length = Math.min(this.length + 1, this.size)
    let oldEnd = this.end 
    this.data[this.end++] = elem
    this.end = this.end % this.size
    // Move the front pointer so we only overwrite the oldest entry
    if (oldEnd == this.start && this.length > 1) this.start = ((this.start + 1) % this.size)
    return overwrite
  }

  popFront(): Nullable<T> {
    this.length = Math.max(0, this.length - 1)
    const data = this.data[this.start]
    this.data[this.start++] = this.fill
    this.start = this.start % this.size
    return data
  }

  peekFront(): Nullable<T> {
    return this.data[this.start]
  }

  forEach(cb: (val: Nullable<T>, index?: number, arr?: Nullable<T>[]) => void) {
    for (let i = 0, start = this.start; i < this.length; start = ((start + 1) % this.size), i++) {
      const val = this.data[start]
      cb(val, i, this.data)
    }
  }
}
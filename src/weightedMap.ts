export default class WeightedMap<T> {
  public weightSet: Map<T, number>
  public size: number
  constructor(map?: Map<T, number>, private rand: () => number = Math.random) {
    // map = {foo: 32, bar: 21}
    this.weightSet = map || new Map()
    this.size = map ? this.calculateSize() : 0
  }

  sum(key: T, amount: number) {
    this.size += amount
    if (this.weightSet.has(key)) this.weightSet.set(key, this.weightSet.get(key) as number + amount)
    else this.weightSet.set(key, amount)
  }

  set(key: T, amount: number) {
    let prevWeight = 0
    if (this.weightSet.has(key)) {
      prevWeight = this.weightSet.get(key) as number
      this.weightSet.set(key, amount)
    } else {
      this.weightSet.set(key, amount)
    }
    this.size += amount - prevWeight
  }

  pick(): T | undefined {
    let pick = this.size * this.rand()
    // @TODO: This does not assert that the set is in smallest->largest order. Although this is technically correct, it may be harder to debug
    // @perf: This is VERY slow. By storing the cumulative weights, we can do a binary search through that set and get much better performance.
    // Updating those weights will be expensive, but we rarely update weights in these sets
    let lastKey
    for (let [key, value] of this.weightSet) {
      pick -= value
      lastKey = key
      if (pick < 0) return key
    }
    return lastKey
  }

  /**
   * Picks an element ignoring the weight
   */
  pickRandom() {
    let pick = this.weightSet.size * this.rand()
    for (let [key] of this.weightSet) {
      pick--
      if (pick < 0) return key
    }
  }

  calculateSize() {
    let count = 0
    for (let [, value] of this.weightSet) {
      count += value
    }
    return count
  }
}

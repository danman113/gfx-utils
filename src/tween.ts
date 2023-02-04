import { interpolate, InterpolationFunction, InterpolationFunctions } from './math/interpolate'
import { linear } from './math/interpolate/functions'

const noop = () => {}
export class TweenError extends Error {}
export default class Tween<T, K extends keyof T, E extends T[K]> {
  public _from: number | (() => number) = 0
  public _to: number | (() => number) = 0
  public duration: number = 0
  public key: K | undefined
  public interpolation: InterpolationFunction = linear
  public fiddleFunction: ((n: number) => E) | undefined // Need this to do (..., 'color', (n: number) => `rgb(${n}, 0, 0)`)
  public donefn: CallableFunction = noop
  public updatefn: (current: E) => void = noop
  constructor(public target: T) {}

  for(duration: number) {
    this.duration = duration
    return this
  }

  interpolateAs(i: InterpolationFunction) {
    this.interpolation = i
    return this
  }

  change(key: K, fiddleFunction?: (n: number) => E) {
    this.key = key
    const tvalue = this.target[this.key] as E
    // This stops us from having to specify a function if K is a number
    if (typeof tvalue === 'number') {
      this._from = tvalue
    }

    this.fiddleFunction = fiddleFunction || ((linear as unknown) as (n: number) => E)
    return this
  }

  from(from: typeof this._from) {
    this._from = from
    return this
  }

  to(to: typeof this._from) {
    this._to = to
    return this
  }

  done(donefn: CallableFunction) {
    this.donefn = donefn
    return this
  }

  update(updatefn: typeof this.updatefn) {
    this.updatefn = updatefn
    return this
  }
}

export class PlayableTween<T, K extends keyof T, E extends T[K]> extends Tween<T, K, E> {
  private counter: number = -1
  start() {
    this.counter = 0
  }

  run(dt: number) {
    if (this.counter >= 0 && this.counter < this.duration && this.fiddleFunction) {
      this.counter += dt
      if (typeof this._from !== 'number') this._from = this._from()
      if (typeof this._to !== 'number') this._to = this._to()
      const value = this.fiddleFunction(
        interpolate(this.counter / this.duration, this._from, this._to, this.interpolation)
      )
      this.target[this.key as K] = value
      this.updatefn(value)
    } else if (this.counter >= this.duration) {
      this.donefn()
    }
  }
}

// Like a regular tween but with a `start` param
export class SyncedTween<T, K extends keyof T, E extends T[K]> extends Tween<T, K, E> {
  constructor(target: T, public start: number = 0) {
    super(target)
  }
}

/**
 * A series of tweens that will be run at the same time, and/or in series.
 * Call in the order `.for(x).change('prop').from(a).to(b).and()...`
 */
export class TweenSeries<T, K extends keyof T, E extends T[K]> {
  public tweens: SyncedTween<T, K, E>[] = []
  public currentTween: SyncedTween<T, K, E> | undefined
  private counter: number = -1
  private startOffset: number = 0
  private easingFn: InterpolationFunction = linear
  constructor(public component: T) {}
  /**
   * Starts and restarts a tween series
   * @returns `TweenSeries<T>`
   */
  start() {
    this.counter = 0
    return this
  }

  private ensureDurationValid() {
    if (!this.currentTween) throw new TweenError('Duration not specified')
    return this.currentTween
  }

  /**
   * Specifies a *new* tween that will last `duration` units.
   * @param duration Duration
   * @returns this tweenseries
   */
  for(duration: number) {
    this.currentTween = new SyncedTween(this.component, this.startOffset)
    this.tweens.push(this.currentTween)
    this.currentTween.for(duration)
    this.currentTween.interpolateAs(this.easingFn)
    return this
  }

  /**
   * Starts another tween that runs simultaneously with the previous tween
   * @returns this tweenseries
   */
  and() {
    const oldTween = this.ensureDurationValid()
    const oldDuration = oldTween.duration
    this.for(oldDuration)
    return this
  }

  /**
   * Defines which key of the component to change for the duration of a tween
   * @param key Key of object to change. Note that you can't access nested keys. To do that, make a separate tween
   * @param fiddleFunction Function that maps the number returned by the interpolation function to the value `key` will be set to.
   * @returns this tweenseries
   */
  change(key: K, fiddleFunction?: (n: number) => E) {
    const currentTween = this.ensureDurationValid()
    currentTween.change(key, fiddleFunction)
    return this
  }

  /**
   * Sets the value the selected key will be changed by
   * @param n 
   * @returns 
   */
  to(n: number | (() => number)) {
    const currentTween = this.ensureDurationValid()
    currentTween.to(n)
    return this
  }

  /**
   * Sets the initial value of selected key to change
   * @param n 
   * @returns 
   */
  from(n: number | (() => number)) {
    const currentTween = this.ensureDurationValid()
    currentTween.from(n)
    return this
  }

  animateTo(props: { [P in K]?: number }, fiddleFunction?: (n: number) => E) {
    const keys = Object.keys(props)
    const currentTween = this.ensureDurationValid()
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as K
      const val = props[key]
      const currentValue = currentTween.target[key]
      if (typeof currentValue === 'number' && currentValue !== val) {
        this.change(key, fiddleFunction).from(currentValue).to(val as number).and()
      }
    }
    return this
  }

  animate(
    props: { [P in K]?: number },
    duration: number,
    easingFn: InterpolationFunction = linear
  ) {
    this.interpolateAllAs(easingFn).for(duration).animateTo(props).start()
    return this
  }

  /**
   * Sets all subsequent tweens to occur after current tween.
   * @returns 
   */
  then() {
    const currentTween = this.ensureDurationValid()
    this.startOffset += currentTween.duration
    return this
  }

  /**
   * Sets the interpolation function for current tween
   * @param i Interpolation function. Linear by default
   * @returns 
   */
  interpolateAs(i: InterpolationFunction) {
    const currentTween = this.ensureDurationValid()
    currentTween.interpolateAs(i)
    return this
  }

  /**
   * Callback that fires when current tween is finished
   * @param doneFn 
   * @returns 
   */
  onDone(doneFn: CallableFunction) {
    const currentTween = this.ensureDurationValid()
    currentTween.done(doneFn)
    return this
  }

  /**
   * Callback that fires when current tween is animating
   * @param updateFn 
   * @returns 
   */
  onUpdate(updateFn: (arg: E) => void) {
    const currentTween = this.ensureDurationValid()
    currentTween.update(updateFn)
    return this
  }

  /**
   * Sets the default interpolation function
   * @param i 
   * @returns 
   */
  interpolateAllAs(i: InterpolationFunction) {
    this.easingFn = i
    return this
  }

  run(dt: number) {
    if (this.counter >= 0) {
      for (let tween of this.tweens) {
        if (
          this.counter >= tween.start &&
          this.counter - tween.start < tween.duration &&
          tween.fiddleFunction
        ) {
          if (typeof tween._from !== 'number') tween._from = tween._from()
          if (typeof tween._to !== 'number') tween._to = tween._to()
          const value = tween.fiddleFunction(
            interpolate(
              (this.counter - tween.start) / tween.duration,
              tween._from,
              tween._to,
              tween.interpolation
            )
          )
          this.component[tween.key as K] = value
          tween.updatefn(value)
          if (this.counter + dt - tween.start >= tween.duration) {
            const value = tween.fiddleFunction(
              interpolate(
                1, // This way it stops EXACTLY at the end every time
                tween._from,
                tween._to,
                tween.interpolation
              )
            )
            this.component[tween.key as K] = value
            tween.updatefn(value)
            tween.donefn()
          }
        }
      }
      this.counter += dt
    }
  }
}

export type GeneralTween<T> = TweenSeries<T, any, any>
// PERF: Maybe add some delete methods here?
/**
 * Simple manager that can run multiple tweens/tweenseries simultaneously
 */
export class TweenManager<T> {
  private tweenMap: Map<T, [number, GeneralTween<T>]> = new Map()
  private tweenList: GeneralTween<T>[] = []

  set(...tweens: GeneralTween<T>[]) {
    for (let tween of tweens) {
      const mapValue = this.tweenMap.get(tween.component)
      if (mapValue) {
        const [i] = mapValue
        this.tweenMap.set(tween.component, [i, tween])
        this.tweenList[i] = tween
      } else {
        const i = this.tweenList.length
        this.tweenMap.set(tween.component, [i, tween])
        this.tweenList[i] = tween
      }
    }
  }

  clear() {
    this.tweenMap.clear()
    this.tweenList.length = 0
  }

  get(component: T) {
    return this.tweenMap.get(component)?.[1]
  }

  run(dt: number) {
    for (let tween of this.tweenList) {
      tween.run(dt)
    }
  }
}

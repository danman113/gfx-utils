import { interpolate, InterpolationFunction, InterpolationFunctions } from './math/interpolate'
import { linear } from './math/interpolate/functions'

const noop = () => {}
export class TweenError extends Error {}
export default class Tween<T, K extends keyof T, E extends T[K]> {
  public _from: number
  public _to: number
  public duration: number = 0
  public key: K
  public interpolation: InterpolationFunction = linear
  public fiddleFunction: (n: number) => E // Need this to do (..., 'color', (n: number) => `rgb(${n}, 0, 0)`)
  public donefn: CallableFunction = noop
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

    this.fiddleFunction = fiddleFunction || ((linear as unknown) as (n: Number) => E)
    return this
  }

  from(from: number) {
    this._from = from
    return this
  }

  to(to: number) {
    this._to = to
    return this
  }

  done(donefn: CallableFunction) {
    this.donefn = donefn
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
      this.target[this.key] = this.fiddleFunction(
        interpolate(this.counter / this.duration, this._from, this._to, this.interpolation)
      )
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

export class TweenSeries<T, K extends keyof T, E extends T[K]> {
  public tweens: SyncedTween<T, K, E>[] = []
  public currentTween: SyncedTween<T, K, E>
  private counter: number = -1
  private startOffset: number = 0
  private easingFn: InterpolationFunction = linear
  constructor(public component: T) {}
  start() {
    this.counter = 0
    return this
  }

  private ensureDurationValid() {
    if (!this.currentTween) throw new TweenError('Duration not specified')
  }

  for(duration: number) {
    this.currentTween = new SyncedTween(this.component, this.startOffset)
    this.tweens.push(this.currentTween)
    this.currentTween.for(duration)
    this.currentTween.interpolateAs(this.easingFn)
    return this
  }

  and() {
    this.ensureDurationValid()
    const oldDuration = this.currentTween.duration
    this.for(oldDuration)
    return this
  }

  change(key: K, fiddleFunction?: (n: number) => E) {
    this.ensureDurationValid()
    this.currentTween.change(key, fiddleFunction)
    return this
  }

  to(n: number) {
    this.ensureDurationValid()
    this.currentTween.to(n)
    return this
  }

  from(n: number) {
    this.ensureDurationValid()
    this.currentTween.from(n)
    return this
  }

  animateTo(props: { [P in K]?: number }, fiddleFunction?: (n: number) => E) {
    const keys = Object.keys(props)
    this.ensureDurationValid()
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as K
      const val = props[key]
      const currentValue = this.currentTween.target[key]
      if (typeof currentValue === 'number' && currentValue !== val) {
        this.change(key, fiddleFunction).from(currentValue).to(val).and()
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

  then() {
    this.ensureDurationValid()
    this.startOffset += this.currentTween.duration
    return this
  }

  interpolateAs(i: InterpolationFunction) {
    this.ensureDurationValid()
    this.currentTween.interpolateAs(i)
    return this
  }

  onDone(doneFn: CallableFunction) {
    this.ensureDurationValid()
    this.currentTween.done(doneFn)
    return this
  }

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
          this.component[tween.key] = tween.fiddleFunction(
            interpolate(
              (this.counter - tween.start) / tween.duration,
              tween._from,
              tween._to,
              tween.interpolation
            )
          )
          if (this.counter + dt - tween.start >= tween.duration) {
            this.component[tween.key] = tween.fiddleFunction(
              interpolate(
                1, // This way it stops EXACTLY at the end every time
                tween._from,
                tween._to,
                tween.interpolation
              )
            )
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

  get(component: T) {
    return this.tweenMap.get(component)[1]
  }

  run(dt: number) {
    for (let tween of this.tweenList) {
      tween.run(dt)
    }
  }
}

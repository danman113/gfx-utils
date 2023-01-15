import { Loadable } from './index'

type HowlerLikeCallback = () => void | ((id: any, err: any) => void)
export interface PlayableSound {
  new(options: {src: string | string[]}): PlayableSound
  on(eventName: 'load' | 'loaderror', cb: HowlerLikeCallback): PlayableSound
  play(): void
  playing(): boolean
  volume(n: number): number
}

/**
 * Creates a howler-like sound instance that can be loaded with `await sound.load`
 */
export default class Sound<SoundClass extends PlayableSound> implements Loadable {
  public sound: SoundClass
  public load: Promise<Sound<SoundClass>>
  public loaded = false
  constructor(path: string | string[], SoundKlass: SoundClass) {
    if (typeof path === 'string') path = [path]
    const sound = new SoundKlass({
      src: path,
    })
    this.load = new Promise((resolve, reject) => {
      sound.on('load', () => {
        this.loaded = true
        resolve(this)
      })
      sound.on('loaderror', <HowlerLikeCallback>((id: any, err: any) => {
        this.loaded = false
        reject(err)
      }))
    })
    this.sound = sound as SoundClass
  }
  public play() {
    this.sound.play()
  }
  public loop() {
    if (!this.sound.playing()) this.play()
  }
  set volume(vol: number) {
    this.sound.volume(vol)
  }
}

import { Loadable } from './index'

type HowlerLikeCallback = () => void | ((id: any, err: any) => void)
interface PlayableSound {
  new({src: string}): PlayableSound
  on(eventName: string, cb: HowlerLikeCallback)
  play(): void
  playing(): boolean
  volume(n: number): number
}

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

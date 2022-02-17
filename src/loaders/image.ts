import { Loadable } from './index'

/**
 * Creates a new texture for use in canvas
 * Usage: let tex = new Texture('url'); await tex.load; console.log(tex.image)
 */
export default class Texture implements Loadable {
  public width = 0
  public height = 0
  public image: HTMLImageElement
  public loaded: boolean = false
  public texture: TexImageSource
  public load: Promise<Texture>
  /**
   * Sets up a texture. Use `await image.load` to load texture
   * @param source Source for image
   */
  constructor(public source: string) {
    const image = new Image()
    image.src = source
    this.image = image
    this.width = image.width
    this.height = image.height
    this.load = new Promise((resolve, reject) => {
      image.onload = () => {
        this.loaded = true
        this.width = image.width
        this.height = image.height
        resolve(this)
      }
      image.onerror = (e: string | Event) => {
        this.loaded = false
        this.width = image.width
        this.height = image.height
        reject(e)
      }
    })
  }
}

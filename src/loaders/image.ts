import { Loadable } from './index'

/**
 * Creates a new texture for use in canvas
 * Usage: let tex = new Texture('url'); await tex.load; console.log(tex.image)
 */
export default class Texture implements Loadable {
  public width = 0
  public height = 0
  public image: HTMLImageElement
  public loaded: boolean | null = null
  public texture: TexImageSource | undefined
  public error: string | Event | null = null
  /**
   * Sets up a texture. Use `await image.load` to load texture
   * @param source Source for image
   */
  constructor(public source: string) {
    const image = new Image()
    image.addEventListener('load', () => {
      this.loaded = true
      this.width = image.width
      this.height = image.height
    }) 

    image.addEventListener('error', (e: string | Event) => {
      this.loaded = false
      this.error = e
      this.width = image.width
      this.height = image.height
    })

    image.src = source
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  get load(): Promise<Texture> {
    const image = this.image
    return new Promise((resolve, reject) => {
      if (this.loaded === null) {
        image.addEventListener('load', () => {
          resolve(this)
        }) 
    
        image.addEventListener('error', (e: string | Event) => {
          reject(`Error Loading Image ${this.image.src}`)
        })
      } else {
        if (this.loaded) resolve(this)
        else reject(this.error)
      }
    })
  }
}
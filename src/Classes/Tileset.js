import { game } from './../game.js'
import { loadImage, loadJson } from './../loaders.js'

export default class Tileset {
  constructor(config) {
    this.src = `data/tilesets/${config.src}`
    this.firstgid = config.firstgid

    this.init()
  }

  image = null

  async loadData() {
    this.data = await loadJson(this.src)
    this.name = this.data.name
  }

  async loadImage() {
    this.image = await loadImage(this.data.image)
  }

  init() {
    (async () => {
      this.promise = new Promise(async resolve => {
        await this.loadData()
        await this.loadImage()

        resolve()
      })
    })()
  }
}
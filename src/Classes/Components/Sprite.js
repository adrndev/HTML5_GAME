import { loadImage } from './../../loaders.js'
import { game } from './../../game.js'
import Component from '../Component.js'

export default class Sprite extends Component {
  constructor(config) {
    super()
    this.src = config.src

    this.sx = config.sx
    this.sy = config.sy

    this.parent = config.parent

    this.width = config.width
    this.height = config.height

    this.init()
  }

  image = null

  get ready() { return this.image instanceof Image }

  async load() {
    this.image = await loadImage(this.src)
  }

  changeFrame(config) {
    this.sx = config.sx
    this.sy = config.sy
  }

  init() {
    super.init()

    game.gameComponents.push(this)
    this.parent.components.push(this)
    this.load()
  }

  draw() {
    if (this.ready) {
      const ctx = game.mainCanvas.getContext('2d'),
            screenPosition = {
              x: this.parent.transform.position.x - game.camera.transform.position.x,
              y: this.parent.transform.position.y - game.camera.transform.position.y
            }
            
      ctx.drawImage(
        this.image,
        this.sx,
        this.sy,
        this.width,
        this.height,
        screenPosition.x - this.width,
        screenPosition.y - (this.height * 2) + this.parent.size.height,
        this.width * 2,
        this.height * 2
      )

      // ctx.strokeStyle = "black"
      // ctx.strokeRect(screenPosition.x - this.width / 2, screenPosition.y, this.parent.size.width, this.parent.size.height)
    }
  }
}
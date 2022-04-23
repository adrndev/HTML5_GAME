import { loadImage } from './../../loaders.js'
import { game } from './../../game.js'
import Component from '../Component.js'

export default class Sprite extends Component {
  constructor(config) {
    super(config)
    this.src = config.src

    this.sx = config.sx
    this.sy = config.sy

    this.width = config.width
    this.height = config.height
    this.size = config.size
    this.opacity = 1

    this.init()
  }

  get overlaysPlayer() {
    return game.player.transform.position.x < this.parent.transform.position.x + this.width &&
    game.player.transform.position.x > this.parent.transform.position.x - this.width &&
    game.player.transform.position.y < this.parent.transform.position.y &&
    game.player.transform.position.y > this.parent.transform.position.y - this.height * 2 + this.size.height
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

  get isVisible() {
    return this.parent.screenPosition.x + this.width > 0
        && this.parent.screenPosition.y + this.size.height > 0
        && this.parent.screenPosition.x - this.width < game.mainCanvas.width
        && this.parent.screenPosition.y + this.size.height - this.height * 2 < game.mainCanvas.height
  }

  draw() {
    if (this.ready && this.isVisible) {
      const ctx = game.mainCanvas.getContext('2d')

      ctx.globalAlpha = this.opacity
            
      ctx.drawImage(
        this.image,
        this.sx,
        this.sy,
        this.width,
        this.height,
        this.parent.screenPosition.x - this.width,
        this.parent.screenPosition.y - (this.height * 2) + this.size.height,
        this.width * 2,
        this.height * 2
      )

      // ctx.strokeStyle = "black"
      // ctx.strokeRect(screenPosition.x - this.width / 2, screenPosition.y, this.parent.size.width, this.parent.size.height)
    }
  }
}
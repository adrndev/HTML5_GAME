import Component from "../Component.js"
import { game } from "../../game.js"

export default class Light extends Component {
  constructor(config) {
    super(config)
    this.radius = config.radius

    this.init()
  }

  get isVisible() {
    return this.parent.screenPosition.x + this.radius > 0
        && this.parent.screenPosition.x - this.radius < game.mainCanvas.width
        && this.parent.screenPosition.y + this.radius > 0
        && this.parent.screenPosition.y - this.radius < game.mainCanvas.height
  }

  draw(ctx) {
    if(this.isVisible) {
      let gradient = ctx.createRadialGradient(
        this.parent.screenPosition.x,
        this.parent.screenPosition.y,
        0,
        this.parent.screenPosition.x,
        this.parent.screenPosition.y,
        this.radius
      )
  
      gradient.addColorStop(.0, "rgba(0, 0, 0, 1)")
      gradient.addColorStop(.5, "rgba(0, 0, 0, .3)")
      gradient.addColorStop(.9, "rgba(0, 0, 0, 0)")
  
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
  }

  init() {
    super.init()

    game.gameComponents.push(this)
    this.parent.components.push(this)
  }
}
import { game } from "../../game.js"
import GameObject from "../GameObject.js"

export default class Light extends GameObject {
  constructor(config) {
    super(config)
    this.radius = config.radius
    this.parent = config.parent

    this.init()
  }

  get isVisible() {
    return this.screenPosition.x + this.radius > 0
        && this.screenPosition.x - this.radius < game.mainCanvas.width
        && this.screenPosition.y + this.radius > 0
        && this.screenPosition.y - this.radius < game.mainCanvas.height
  }

  draw(ctx) {
    if(this.isVisible) {
      let gradient = ctx.createRadialGradient(
        this.screenPosition.x,
        this.screenPosition.y,
        0,
        this.screenPosition.x,
        this.screenPosition.y,
        this.radius
      )
  
      gradient.addColorStop(0, "rgba(0, 0, 0, 1)")
      gradient.addColorStop(.5, "rgba(0, 0, 0, .3)")
      gradient.addColorStop(.9, "rgba(0, 0, 0, 0)")
  
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      // #DEVELOPMENT
      gradient.addColorStop(0, "rgba(11, 217, 25, .3)")
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
  }

  update() {
    super.update()

    this.transform.position.x = this.parent.transform.position.x
    this.transform.position.y = this.parent.transform.position.y
  }

  init() {
    super.init()
  }
}
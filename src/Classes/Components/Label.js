import Component from "../Component.js"
import { game } from "./../../game.js"

export default class Label extends Component {
  constructor(config) {
    super(config)
    this.text = config.label

    this.init()
  }

  init() {
    super.init()

    game.gameComponents.push(this)
    this.parent.components.push(this)
  }

  draw() {
    const ctx = game.mainCanvas.getContext('2d')

    ctx.font = "13px Arial"
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 3

    let measure = ctx.measureText(this.text)
    ctx.strokeText(this.text, this.parent.screenPosition.x - measure.width / 2, this.parent.screenPosition.y - game.tileSize * 3)
    ctx.fillText(this.text, this.parent.screenPosition.x - measure.width / 2, this.parent.screenPosition.y - game.tileSize * 3)
  }
}
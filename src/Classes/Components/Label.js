import Component from "../Component.js";
import { game } from "./../../game.js"

export default class Label extends Component {
  constructor(config) {
    super()
    this.text = config.label
    this.parent = config.parent

    this.init()
  }

  init() {
    super.init()

    game.gameComponents.push(this)
    this.parent.components.push(this)
  }

  draw() {
    const ctx = game.mainCanvas.getContext('2d'),
          screenPosition = {
            x: this.parent.transform.position.x - game.camera.transform.position.x,
            y: this.parent.transform.position.y - game.camera.transform.position.y
          }

    ctx.font = "13px Arial"
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 3

    let measure = ctx.measureText(this.text)
    ctx.strokeText(this.text, screenPosition.x - measure.width / 2, screenPosition.y - game.tileSize * 3)
    ctx.fillText(this.text, screenPosition.x - measure.width / 2, screenPosition.y - game.tileSize * 3)
  }
}
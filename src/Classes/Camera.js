import { game } from './../game.js'
import GameObject from './GameObject.js'

export default class Camera extends GameObject {
  constructor(config) {
    super(config)
    this.boundary = config.boundary || true
    this.target = config.target

    this.toTarget()
  }

  followingTarget = false
  focusingTarget = false

  toTarget() {
    this.focusingTarget = true
    this.transform.position = { ...this.target.transform.position }

    let position = {
      x: this.target.transform.position.x - game.mainCanvas.width / 2,
      y: this.target.transform.position.y - game.mainCanvas.height / 2
    }

    if(this.boundary === true) {
      if(position.x < 0) {
        position.x = 0
      } else if(position.x + game.mainCanvas.width > game.map.data.width * (game.tileSize * 2)) {
        position.x = game.map.data.width * (game.tileSize * 2) - game.mainCanvas.width
      }
  
      if(position.y < 0) {
        position.y = 0
      } else if(position.y + game.mainCanvas.height > game.map.data.height * (game.tileSize * 2)) {
        position.y = game.map.data.height * (game.tileSize * 2) - game.mainCanvas.height
      }
    }

    this.transform.position.x = position.x
    this.transform.position.y = position.y
  }

  move(point) {
    if((this.transform.position.x + point.x + game.mainCanvas.width <= game.map.data.width * (game.tileSize * 2)
    && this.transform.position.x + point.x >= 0)
    || this.boundary === false) {
      this.transform.position.x += point.x
    }

    if((this.transform.position.y + point.y >= 0
    && this.transform.position.y + point.y + game.mainCanvas.height <= game.map.data.height * (game.tileSize * 2))
    || this.boundary === false) {
      this.transform.position.y += point.y
    }
  }

  update() {
    super.update()

    if(this.followingTarget === true) {
      this.toTarget()
    }
  }
}
import { game } from './../game.js'
import GameObject from './GameObject.js'

export default class Camera extends GameObject {
  constructor(config) {
    super()
    this.boundary = config.boundary || true
    this.target = config.target
  }

  toTarget() {
    this.transform.position = { ...this.target.transform.position }
    this.transform.position.x -= game.mainCanvas.width / 2
    this.transform.position.y -= game.mainCanvas.height / 2
  }

  move(point, speed) {
    let moveSpeed = speed * game.deltaTime
    if((this.transform.position.x + (moveSpeed * point.x) + game.mainCanvas.width < game.map.data.width * (game.tileSize * 2)
    && this.transform.position.x + moveSpeed * point.x >= 0
    && this.transform.position.y + moveSpeed * point.y >= 0
    && this.transform.position.y + (moveSpeed * point.y) + game.mainCanvas.height < game.map.data.height * (game.tileSize * 2))
    || this.boundary === false) {
      this.transform.position.x += point.x * moveSpeed
      this.transform.position.y += point.y * moveSpeed
    }
  }

  update() {
    super.update()
    // this.transform.position = this.target.transform.position
  }
}
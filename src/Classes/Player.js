import Entity from './Entity.js'
import { game } from './../game.js'

export default class Player extends Entity {
  constructor(config) {
    super(config)
    this.name = config.name
    this.speed = config.speed
    this.fov = 200
    this.character = game.gamedata.characters[config.characterId]

    this.init()
  }

  onStartMoving(dir) {
    this.moveDirections[dir].state = true
    this.facing = dir
  }

  onStopMoving(dir) {
    this.moveDirections[dir].state = false

    let lastDirection = Object.entries(this.moveDirections).find(key => key[1].state === true)?.[0]
    if(lastDirection) {
      this.facing = lastDirection
    }
  }

  move(point) {
    if(game.camera && game.camera.target === this) {
      if(((this.transform.position.x - Math.abs(game.camera.transform.position.x) + this.fov >= game.mainCanvas.width && point.x === 1)
      || (this.transform.position.x - Math.abs(game.camera.transform.position.x) - this.fov <= 0 && point.x === -1)
      || (this.transform.position.y - Math.abs(game.camera.transform.position.y) + this.fov >= game.mainCanvas.height && point.y === 1)
      || (this.transform.position.y - Math.abs(game.camera.transform.position.y) - this.fov <= 0 && point.y === -1))
      && game.camera.focusingTarget === true) {
        let [x, y] = Object.values(point)

        game.camera.move({
          x: x * this.speed * game.deltaTime,
          y: y * this.speed * game.deltaTime,
        })
      }

      if(game.camera.focusingTarget === false && !game.mouse.clicked) {
        game.camera.toTarget()
      }
    }
    super.move(point)
  }

  init() {
    super.init()

    console.log(this)
  }

  update() {
    super.update()
  }
}
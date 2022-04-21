import GameObject from './GameObject.js'
import { game } from './../game.js'
import Sprite from './Components/Sprite.js'
import Label from './Components/Label.js'

export default class Entity extends GameObject {
  constructor(config) {
    super()

    this.transform.position.x = config.x || 0
    this.transform.position.y = config.y || 0
  }
  
  stepPhase = 0
  step = 0

  move(point) {
    this.transform.position.x += point.x * this.speed * game.deltaTime
    this.transform.position.y += point.y * this.speed * game.deltaTime

    let now = Date.now(),
    stepTime = 320
    if (now - this.stepPhase > stepTime - (this.speed / 2)) {
      this.stepPhase = now
      this.step = this.step == 0 ? 1 : 0
    }
  }

  get isMoving() {
    return Object.values(this.moveDirections).some(key => key.state === true)
  }

  facing = "down"

  setFrame() {
    if (this.isMoving) {
      this.sprite.changeFrame({
        sx: this.character.animations[this.facing][this.step].sx,
        sy: this.character.animations[this.facing][this.step].sy
      })
    } else {
      this.sprite.changeFrame({
        sx: this.character.animations["idle"][0].sx,
        sy: this.character.animations["idle"][0].sy
      })
    }
  }

  handleMovement() {
    for (let prop in this.moveDirections) {
      let direction = this.moveDirections[prop]
      if (direction.state === true) {
        let point = { x: 0, y: 0 }
        point[direction.axis] = direction.value
        this.move(point)

        if(this.constructor.name !== 'Player') {
          this.facing = prop
        }
      }
    }
  }

  moveDirections = {
    left: { state: false, value: -1, axis: "x" },
    right: { state: false, value: 1, axis: "x" },
    up: { state: false, value: -1, axis: "y" },
    down: { state: false, value: 1, axis: "y" }
  }

  //tymczasowe. przeniesc do data.json
  size = { width: 20, height: 12 }

  init() {
    super.init()

    this.sprite = new Sprite(
      {
        src: this.character.src,
        sx: this.character.sx,
        sy: this.character.sy,
        width: this.character.width,
        height: this.character.height,
        parent: this
      }
    )

    if(this.name) {
      this.label = new Label({ parent: this, label: this.name })
    }
  }

  update() {
    super.update()
    this.handleMovement()
    this.setFrame()
  }
}
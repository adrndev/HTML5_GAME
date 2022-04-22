import GameObject from './GameObject.js'
import { game } from './../game.js'
import Sprite from './Components/Sprite.js'
import Label from './Components/Label.js'
import Collider from './Components/Collider.js'

export default class Entity extends GameObject {
  constructor(config) {
    super(config)
  }
  
  stepPhase = 0
  step = 0

  get isPlayer() {
    return this.constructor.name === 'Player'
  }

  stop() {
    for (let prop in this.moveDirections) {
      this.moveDirections[prop].state = false
    }
  }

  move(point) {
    let xVal = point.x * this.speed * game.deltaTime,
        yVal = point.y * this.speed * game.deltaTime,
        tempCollider = new Collider({
          x: this.transform.position.x + xVal,
          y: this.transform.position.y + yVal,
          width: this.size.width,
          height: this.size.height,
          temporary: true,
          parent: this
        }),
        isColliding = Collider.isColliding(tempCollider)

    if(this.hasCollider && !isColliding) {
      this.transform.position.x += xVal
      this.transform.position.y += yVal

      // #DEVELOPMENT
      if(this.isPlayer) {
        sessionStorage.setItem('x', this.transform.position.x)
        sessionStorage.setItem('y', this.transform.position.y)
      }
    } else if(!this.isPlayer) {
      this.stop()
    }

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

        if(!this.isPlayer) {
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

  // #DEVELOPMENT
  size = { width: 20, height: 12 }

  init() {
    super.init()

    this.collider = new Collider({
      parent: this
    })

    this.sprite = new Sprite({
      src: this.character.src,
      sx: this.character.sx,
      sy: this.character.sy,
      width: this.character.width,
      height: this.character.height,
      size: this.character.size,
      parent: this
    })

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
import GameObject from '../GameObject.js'
import { game } from '../../game.js'
import Sprite from '../Components/Sprite.js'
import Label from '../Components/Label.js'
import Collider from '../Components/Collider.js'

export default class Entity extends GameObject {
  constructor(config) {
    super(config)

    this.facing = config.facing ?? "down"
    // #DEVELOPMENT
    this.size = { width: 20, height: 12 }
  }
  
  stepPhase = 0
  step = 0

  stop() {
    for (let prop in this.moveDirections) {
      this.moveDirections[prop].state = false
    }
  }

  move(point) {
    let xVal = point.x * this.speed * game.deltaTime,
        yVal = point.y * this.speed * game.deltaTime

    if(this.hasColliders) {
      let collider = { ...this.colliders[0] }
      collider.x += xVal
      collider.y += yVal
      
      let isColliding = Collider.isColliding(collider)
  
      if(isColliding) {
        if(!this.isPlayer) {
          this.stop()
        }
        return false
      }
    }

    this.transform.position.x += xVal
    this.transform.position.y += yVal

    // #DEVELOPMENT
    if(this.isPlayer) {
      sessionStorage.setItem('x', this.transform.position.x)
      sessionStorage.setItem('y', this.transform.position.y)
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

  setFrame() {
    this.sprite.setFrame({
      frame: this.character.animations[this.facing][this.step],
      offsetY: this.size.height,
      offsetX: this.size.width
    })
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

  init() {
    super.init()

    if(this.character.collider) {
      this.colliders = [new Collider({
        width: this.character.collider.width,
        height: this.character.collider.height,
        offsetX: this.character.collider.offsetX - this.size.width / 2,
        offsetY: this.character.collider.offsetY,
        parent: this
      })]
    }

    this.sprite = new Sprite({
      src: this.character.src,
      frame: this.character.animations[this.facing][this.step],
      offsetY: this.size.height,
      offsetX: this.size.width,
      parent: this
    })

    if(this.name) {
      this.label = new Label({ parent: this, label: this.name })
    }
  }

  update() {
    super.update()
    this.handleMovement()

    if(!this.isMoving) {
      this.step = 2
    }
    this.setFrame()
  }
}
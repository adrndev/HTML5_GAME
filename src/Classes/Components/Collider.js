import Component from "../Component.js"
import { game } from "../../game.js"

export default class Collider extends Component {
  constructor(config) {
    super(config)

    this.type = config.type || 'rect'

    this.x = config.x || this.parent.transform.position.x
    this.y = config.y || this.parent.transform.position.y
    this.width = config.width || this.parent.size.width
    this.height = config.height || this.parent.size.height
    this.temporary = config.temporary || false

    this.init()
  }

  static isColliding(collider) {
    let colliders = game.gameComponents.filter(key => key.constructor.name === 'Collider' && key.parent !== collider.parent)
    return colliders.some(key => {
      return collider.x < key.x + key.width &&
      collider.x + collider.width > key.x &&
      collider.y < key.y + key.height &&
      collider.height + collider.y > key.y
    })
  }

  getCollider() {
    if(this.type === 'rect') {
      return {
        x: this.parent.transform.position.x,
        y: this.parent.transform.position.y,
        width: this.parent.size.width,
        height: this.parent.size.height
      }
    }
  }

  update() {
    super.update()

    this.x = this.parent.transform.position.x
    this.y = this.parent.transform.position.y
  }

  init() {
    super.init()

    if(!this.temporary) {
      game.gameComponents.push(this)
      this.parent.components.push(this) 
    }
  }
}
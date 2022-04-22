import { game } from './../game.js'

export default class GameObject {
  constructor(config) {
    game.gameObjects.push(this)

    this.transform.position.x = config.x || 0
    this.transform.position.y = config.y || 0
  }
  transform = {
    position: {
      x: 0, y: 0
    },
    scale: {
      x: 0, y: 0
    },
    rotation: {
      x: 0, y: 0
    }
  }

  init() {
    console.log(`${this.constructor.name} created`);
  }

  update() {
    for (let component of this.components) {
      component.update()
    }
  }

  get hasSprite() { return this.components.some(component => component.constructor.name === 'Sprite') }
  get hasLabel() { return this.components.some(component => component.constructor.name === 'Label') }
  get hasCollider() { return this.components.some(component => component.constructor.name === 'Collider') }

  components = []
}
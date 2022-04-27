import Entity from '../GameObjects/Entity.js'
import { game } from '../../game.js'
import { calcDistance } from '../../functions.js'

export default class NPC extends Entity {
  constructor(config) {
    super(config)
    this.speed = config.speed || 160
    this.character = game.gamedata.entities[config.type]

    if(config.name) {
      this.name = config.name
    }

    this.wandering = config.wandering ?? false

    if(this.wandering === true) {
      this.pathId = config.pathId
      this.currentPoint = null
    }

    this.init()
  }

  init() {
    super.init()
  }

  wander() {
    let path = game.gameObjects.find(key => key.constructor.name === 'Path' && key.id === this.pathId)

    if(path) {
      let dx = path.points[1].x - this.transform.position.x,
          dy = path.points[1].y - this.transform.position.y,
          vel = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  
      if (vel > 1) {
        dx /= vel;
        dy /= vel;
      }
  
      this.move({
        x: dx,
        y: dy
      })
    }
  }

  update() {
    super.update()

    if(this.wandering && this.pathId) {
      this.wander()
    }
  }
}
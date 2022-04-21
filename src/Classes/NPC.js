import Entity from './Entity.js'
import { game } from './../game.js'

export default class NPC extends Entity {
  constructor(config) {
    super(config)
    this.speed = config.speed || 160
    this.character = game.gamedata.entities[config.type]

    if(config.name) {
      this.name = config.name
    }

    this.init()
  }

  init() {
    super.init()
  }
}
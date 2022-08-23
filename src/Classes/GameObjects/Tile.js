import { game } from "../../game.js"
import Collider from "../Components/Collider.js"
import GameObject from "../GameObject.js"

export default class Tile extends GameObject {
  constructor(config) {
    super(config)

    this.transform.position.x = this.x = config.x
    this.transform.position.y = this.y = config.y
    this.id = config.id
    this.tileId = config.tileId
    this.tileset = config.tileset
    this.layer = config.layer
    this.texture = config.texture

    this.init()
  }

  init() {
    super.init()
    
    if(this.texture.objectgroup) {
      this.colliders = []
      for(let object of this.texture.objectgroup.objects) {
        switch(object.name) {
          case 'collision':
            let config = {
              offsetX: object.x,
              offsetY: object.y,
              parent: this
            }

            if(object.type === 'rect') {
              config = {
                ...config,
                width: object.width * 2,
                height: object.height * 2
              }
            } else if(object.type === 'polygon') {
              config = {
                ...config,
                points: object.polygon.map(key => {
                  return {
                    ...key,
                    x: key.x * 2,
                    y: key.y * 2
                  }
                }),
                type: 'polygon'
              }
            }

            let collider = new Collider(config)

            this.colliders.push(collider)
            break
        }
      }
    }
  }
}
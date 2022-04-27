import GameObject from "../GameObject.js"
import Sprite from "../Components/Sprite.js"
import Collider from "../Components/Collider.js"

export default class Thing extends GameObject {
  constructor(config) {
    super(config)

    this.object = game.gamedata.objects[config.type]

    this.init()
  }

  update() {
    super.update()

    this.sprite.opacity = this.sprite?.overlaysPlayer ? .5 : 1
  }

  init() {
    super.init()

    if(this.object.collision === true && this.object.colliders) {
      this.colliders = []

      for(let collider of this.object.colliders) {
        this.colliders.push(
          new Collider({
            width: collider.width,
            height: collider.height,
            offsetX: collider.offsetX,
            offsetY: collider.offsetY,
            parent: this
          })
        )
      }
    }

    this.sprite = new Sprite({
      src: this.object.src,
      frame: {
        sx: this.object.sx,
        sy: this.object.sy,
        width: this.object.width,
        height: this.object.height,
      },
      offsetX: this.object.size.width,
      offsetY: this.object.size.height,
      parent: this
    })
  }
}
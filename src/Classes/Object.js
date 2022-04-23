import GameObject from "./GameObject.js"
import Sprite from "./Components/Sprite.js"
import Collider from "./Components/Collider.js"

export default class Object extends GameObject {
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

    if(this.object.collision === true) {
      this.collider = new Collider({
        x: this.transform.position.x,
        y: this.transform.position.y,
        width: this.object.size.width,
        height: this.object.size.height,
        parent: this
      })
    }

    this.sprite = new Sprite({
      src: this.object.src,
      sx: this.object.sx,
      sy: this.object.sy,
      width: this.object.width,
      height: this.object.height,
      size: this.object.size,
      parent: this
    })
  }
}
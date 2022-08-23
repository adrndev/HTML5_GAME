import Component from "../Component.js"
import { game } from "../../game.js"

export default class Collider extends Component {
  constructor(config) {
    super(config)

    this.type = config.type || 'rect'

    this.x = this.parent.transform.position.x + config.offsetX
    this.y = this.parent.transform.position.y + config.offsetY

    if(this.type === 'rect') {
      this.width = config.width
      this.height = config.height
    } else if(this.type === 'polygon') {
      this.points = config.points
    }

    this.offsetX = config.offsetX
    this.offsetY = config.offsetY

    this.temporary = config.temporary || false

    this.init()
  }

  static convertRectToLines(rect) {
    let lines = []

    lines[0] = {
      p1: {x:rect.x, y:rect.y},
      p2: {x:rect.x+rect.width, y:rect.y}
    }

    lines[1] = {
      p1: {x:rect.x+rect.width, y:rect.y},
      p2: {x:rect.x+rect.width, y:rect.y+rect.height}
    }

    lines[2] = {
      p1: {x:rect.x+rect.width, y:rect.y+rect.height},
      p2: {x:rect.x, y:rect.y+rect.height}
    }

    lines[3] = {
      p1: {x:rect.x, y:rect.y+rect.height},
      p2: {x:rect.x, y:rect.y}
    }

    return lines
  }

  static rectToRect(collider1, collider2) {
    return collider1.x < collider2.x + collider2.width &&
    collider1.x + collider1.width > collider2.x &&
    collider1.y < collider2.y + collider2.height &&
    collider1.height + collider1.y > collider2.y
  }

  static checkCollision(collider1, collider2) {
    let ctx = game.mainCanvas.getContext('2d')
    if(collider1.type === 'rect' && collider2.type === 'rect') {
      return this.rectToRect(collider1, collider2)
    } else if(collider1.type === 'rect' && collider2.type === 'polygon') {
      let rectLines = this.convertRectToLines(collider1)

      for(let [index, point] of collider2.points.entries()) {
        let nextIndex = index + 1 > collider2.points.length - 1 ? 0 : index + 1

        for(let [index2, point2] of rectLines.entries()) {
          let isIntersecting = this.isIntersecting(
            { X: rectLines[index2].p1.x, Y: rectLines[index2].p1.y },
            { X: rectLines[index2].p2.x, Y: rectLines[index2].p2.y },
            { X: collider2.x + point.x + collider2.offsetX, Y: collider2.y + point.y + collider2.offsetY },
            { X: collider2.x + collider2.points[nextIndex].x + collider2.offsetX, Y: collider2.y + collider2.points[nextIndex].y + collider2.offsetY }
          )
  
          if(isIntersecting.seg1 && isIntersecting.seg2) {
            return true
          }
        }
      }

    }
  }

  static isIntersecting(a, b, c, d) {
    var denominator = ((b.X - a.X) * (d.Y - c.Y)) - ((b.Y - a.Y) * (d.X - c.X))
    var numerator1 = ((a.Y - c.Y) * (d.X - c.X)) - ((a.X - c.X) * (d.Y - c.Y))
    var numerator2 = ((a.Y - c.Y) * (b.X - a.X)) - ((a.X - c.X) * (b.Y - a.Y))

    // Detect coincident lines (has a problem, read below)
    if (denominator == 0) return numerator1 == 0 && numerator2 == 0

    var r = numerator1 / denominator
    var s = numerator2 / denominator

    return {
        x: a.X + (r * (b.X - a.X)),
        y: a.Y + (r * (b.Y - a.Y)),
        seg1: r >= 0 && r <= 1,
        seg2: s >= 0 && s <= 1
    }
  }

  static rectToPolygon() {

  }

  static isColliding(collider) {
    let colliders = game.gameComponents.filter(key => key.constructor.name === 'Collider' && key.parent !== collider.parent)
    return colliders.some(key => {
      return this.checkCollision(collider, key)
    })
  }

  update() {
    super.update()

    this.x = this.parent.transform.position.x + this.offsetX
    this.y = this.parent.transform.position.y + this.offsetY
  }

  init() {
    super.init()

    if(!this.temporary) {
      game.gameComponents.push(this)
      this.parent.components.push(this) 
    }
  }
}
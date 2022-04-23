import { game } from './../game.js'
import GameObject from './GameObject.js'

export default class Camera extends GameObject {
  constructor(config) {
    super(config)
    this.boundary = config.boundary || true
    this.target = config.target

    this.init()
  }

  followingTarget = false
  focusingTarget = false

  toTarget() {
    this.focusingTarget = true
    this.transform.position = { ...this.target.transform.position }

    let position = {
      x: this.target.transform.position.x - game.mainCanvas.width / 2,
      y: this.target.transform.position.y - game.mainCanvas.height / 2
    }

    if(this.boundary === true) {
      if(position.x < 0) {
        position.x = 0
      } else if(position.x + game.mainCanvas.width > game.map.width) {
        position.x = game.map.width - game.mainCanvas.width
      }
  
      if(position.y < 0) {
        position.y = 0
      } else if(position.y + game.mainCanvas.height > game.map.height) {
        position.y = game.map.height - game.mainCanvas.height
      }
    }

    this.transform.position.x = position.x
    this.transform.position.y = position.y
  }

  renderScene() {
    function sortByYAxis(a, b) {
      return a.transform.position.y - b.transform.position.y
    }

    this.clearCanvas()

    game.map.draw()

    let sortedGameObjects = game.gameObjects.sort(sortByYAxis)

    for(let gameObject of sortedGameObjects) {
      if(gameObject.hasSprite) {
        gameObject.sprite.draw()
      }

      if(gameObject.hasLabel) {
        gameObject.label.draw()
      }
    }

    if(true) {
      let mainCtx = game.mainCanvas.getContext('2d'),
          ctx = this.shadowCanvas.getContext('2d')

      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, this.shadowCanvas.width, this.shadowCanvas.height)
      ctx.fillStyle = 'rgba(0, 0, 0, .9)'
      ctx.fillRect(0, 0, this.shadowCanvas.width, this.shadowCanvas.height)

      let lightComponents = game.gameComponents.filter(key => key.constructor.name === 'Light')

      ctx.globalCompositeOperation = 'destination-out'
      for(let light of lightComponents) {
        light.draw(ctx)
      }

      mainCtx.drawImage(this.shadowCanvas, 0, 0)

      // console.log(lightComponents);
    }
  }

  clearCanvas() {
    const ctx = game.mainCanvas.getContext('2d')
    ctx.clearRect(0, 0, game.mainCanvas.width, game.mainCanvas.height)
  }

  move(point) {
    if((this.transform.position.x + point.x + game.mainCanvas.width <= game.map.width
    && this.transform.position.x + point.x >= 0)
    || this.boundary === false) {
      this.transform.position.x += point.x
    }

    if((this.transform.position.y + point.y >= 0
    && this.transform.position.y + point.y + game.mainCanvas.height <= game.map.height)
    || this.boundary === false) {
      this.transform.position.y += point.y
    }
  }

  init() {
    super.init()

    this.toTarget()
    this.shadowCanvas = document.createElement('canvas')

    this.shadowCanvas.width = game.mainCanvas.width
    this.shadowCanvas.height = game.mainCanvas.height
  }

  update() {
    super.update()

    if(this.followingTarget === true) {
      this.toTarget()
    }
  }
}
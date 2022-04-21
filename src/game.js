import Player from './Classes/Player.js'
import Map from './Classes/Map.js'
import NPC from './Classes/NPC.js'
import { loadJson } from './loaders.js'
import inputManager from './input.js'
import Camera from './Classes/Camera.js'

export const game = {
  init: async function () {
    this.mainCanvas = document.querySelector('#main-canvas')
    this.mainCanvas.getContext('2d').imageSmoothingEnabled = false
    this.gamedata = await loadJson('data/data.json')
    this.player = new Player({ name: 'adrn', speed: 160, characterId: 0, x: 100, y: 100 })
    this.map = new Map({ mapId: 0 })
    this.camera = new Camera({ target: this.player })

    await Promise.all(this.loadingPromises)
    this.isLoading = false
    this.setupListeners()
    this.update()
    console.log(this);
  },

  loadingPromises: [],
  set isLoading(value) {
    document.querySelector('#loading-canvas').classList.toggle('hidden', !value)

    return value
  },

  gameObjects: [],
  gameComponents: [],

  tileSize: 16,

  lastUpdate: Date.now(),
  deltaTime: 0,

  update: function () {
    requestAnimationFrame(this.update.bind(this))

    let now = Date.now()
    this.deltaTime = (now - this.lastUpdate) / 1000
    this.lastUpdate = now

    for (let gameObject of this.gameObjects) {
      gameObject.update()
    }

    this.clearCanvas()
    this.drawScene()
  },

  drawScene() {
    function sortByYAxis(a, b) {
      return a.transform.position.y - b.transform.position.y
    }

    this.map.draw()

    let sortedGameObjects = this.gameObjects.sort(sortByYAxis)

    for(let gameObject of sortedGameObjects) {
      if(gameObject.hasSprite) {
        gameObject.sprite.draw()
      }

      if(gameObject.hasLabel) {
        gameObject.label.draw()
      }
    }
  },

  setupListeners: function () {
    const setPlayerMovement = (code, value) => {
      switch (code) {
        case 'KeyW':
          this.player.moveDirections.up.state = value
          break
        case 'KeyD':
          this.player.moveDirections.right.state = value
          break
        case 'KeyS':
          this.player.moveDirections.down.state = value
          break
        case 'KeyA':
          this.player.moveDirections.left.state = value
          break
      }
    }

    this.mainCanvas.addEventListener('keydown', (ev) => {
      if (inputManager[ev.code]?.keydown) {
        inputManager[ev.code].keydown.bind(this)()
      }
    })

    this.mainCanvas.addEventListener('keyup', (ev) => {
      if (inputManager[ev.code]?.keyup) {
        inputManager[ev.code].keyup.bind(this)()
      }
    })

    this.mainCanvas.addEventListener('blur', () => {
      this.player.stop()
    })
  },

  clearCanvas: function () {
    const ctx = this.mainCanvas.getContext('2d')
    ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
  }
}

game.init()
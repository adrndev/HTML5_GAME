import Player from './Classes/Entities/Player.js'
import Map from './Classes/GameObjects/Map.js'
import NPC from './Classes/Entities/NPC.js'
import { loadJson } from './loaders.js'
import inputManager from './input.js'
import Camera from './Classes/GameObjects/Camera.js'

export const game = {
  init: async function () {
    this.mainCanvas = document.querySelector('#main-canvas')
    this.mainCanvas.getContext('2d').imageSmoothingEnabled = false
    this.gamedata = await loadJson('data/data.json')

    // #DEVELOPMENT
    let playerPosition = {
      x: parseInt(sessionStorage.getItem('x')) || 640,
      y: parseInt(sessionStorage.getItem('y')) || 480
    }
    this.player = new Player({ name: 'adrn', speed: 160, characterId: 0, x: playerPosition.x, y: playerPosition.y })
    this.map = new Map({ mapId: 0 })

    await Promise.all(this.loadingPromises)
    this.camera = new Camera({ target: this.player })
    this.isLoading = false
    this.setupListeners()
    this.update()
    console.log(this)

    // #DEVELOPMENT
    window.game = this
  },

  loadingPromises: [],
  set isLoading(value) {
    document.querySelector('#loading-canvas').classList.toggle('hidden', !value)

    return value
  },

  gameObjects: [],
  gameComponents: [],
  mouse: {
    x: 0,
    y: 0,
    clicked: false,
    clickPosition: {
      x: 0, y: 0
    },
    lastClickPosition: {
      x: 0, y: 0
    }
  },

  paths: [],

  tileSize: 16,

  lastUpdate: Date.now(),
  deltaTime: 0,
  fps: 0,
  update: function () {
    requestAnimationFrame(this.update.bind(this))

    this.camera.clearCanvas()

    let now = Date.now()
    this.deltaTime = (now - this.lastUpdate) / 1000
    this.lastUpdate = now
    this.fps = 1 / this.deltaTime

    for (let gameObject of this.gameObjects) {
      gameObject.update()
    }

    this.camera.renderScene()
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

    document.addEventListener('mousemove', (ev) => {
      if(document.pointerLockElement === this.mainCanvas) {
        this.mouse.x += ev.movementX
        this.mouse.y += ev.movementY

        let diffX = this.mouse.clickPosition.x - this.mouse.x,
            diffY = this.mouse.clickPosition.y - this.mouse.y
        
        this.camera.focusingTarget = false
        this.camera.move({ x: Math.round(diffX), y: Math.round(diffY) })

        this.mouse.clickPosition.x = this.mouse.x
        this.mouse.clickPosition.y = this.mouse.y
      }
    })

    this.mainCanvas.addEventListener('mousedown', (ev) => {
      if(ev.which == 2) {
        ev.preventDefault()

        this.mainCanvas.requestPointerLock()
        this.mouse.clicked = true

        this.mouse.lastClickPosition.x = this.mouse.clickPosition
      }
    })

    document.addEventListener('mouseup', () => {
      this.mouse.clicked = false
      if(document.pointerLockElement === this.mainCanvas) {
        document.exitPointerLock()
      }
    })

    // #DEVELOPMENT
    // document.addEventListener("visibilitychange", function() {
    //   if (document.visibilityState === 'visible') {
    //       console.log('has focus');
    //       this.lastUpdate = Date.now()
    //   } else {
    //       console.log('lost focus');
    //   }
    // })
  },

  clearCanvas: function () {
    const ctx = this.mainCanvas.getContext('2d')
    ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
  }
}

game.init()
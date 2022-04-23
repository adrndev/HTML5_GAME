import GameObject from './GameObject.js'
import { game } from '../game.js'
import { loadJson } from '../loaders.js'
import Tileset from "./Tileset.js"
import NPC from '../Classes/NPC.js'
import Object from './Object.js'

export default class Map extends GameObject {
  constructor(config) {
    super(config)

    this.map = game.gamedata.maps[config.mapId]

    this.init()
  }

  tilesets = []
  layers = []
  #tiles = []
  textures = []

  async loadTilesets() {
    for (let tileset of this.data.tilesets) {
      let tilesetObject = new Tileset({ src: tileset.source, firstgid: tileset.firstgid })
      this.tilesets.push(tilesetObject)
    }
  }

  async loadData() {
    this.data = await loadJson(this.map.src)
    this.width = this.data.width * game.tileSize * 2
    this.height = this.data.height * game.tileSize * 2
  }

  loadObjects() {
    let objectLayers = this.data.layers.filter(key => key.type === 'objectgroup')
    for (let layer of objectLayers) {
      for (let object of layer.objects) {
        let objectProperties = {
          x: object.x * 2,
          y: object.y * 2
        }

        if(object.properties) {
          for (let prop of object.properties) {
            objectProperties[prop.name] = prop.value
          }
        }

        if(object.type === 'npc') {
          new NPC(objectProperties)
        } else if(object.type === 'object') {
          new Object(objectProperties)
        }
      }
    }
  }

  generateMap() {
    let posX = 0, posY = 0, xVal = 0, yVal = 0, loop = 0, tiles = []

    let tileLayers = this.data.layers.filter(key => key.type === 'tilelayer')
    for(let layer of tileLayers) {
      [ posX, posY, xVal, yVal, loop ] = Array(5).fill(0)
      for(let tileId of layer.data) {
        if(tileId !== 0) {
          let tileset = [...this.tilesets].reverse().find(key => tileId > key.firstgid)

          let tile = {
            x: posX,
            y: posY,
            id: loop,
            tileId: tileId,
            tileset: tileset.name,
            layer: layer.name
          }
  
          if (!tiles[xVal]) {
            tiles.push(new Array())
          }
          
          if (!tiles[xVal][yVal]) {
            tiles[xVal].push(new Array())
          }
  
          tiles[xVal][yVal].push(tile)
        }

        loop++
        posX += game.tileSize * 2
        xVal += 1
        if(loop % layer.width === 0) {
          posX = 0
          xVal = 0
          posY += game.tileSize * 2
          yVal += 1
        }
      }
    }
    this.#tiles = tiles
  }

  generateTextures() {
    let arr = []
    for(let tileset of this.tilesets) {
      for(let y = 0; y < tileset.data.imageheight / game.tileSize; y++) {
        for(let x = 0; x < tileset.data.imagewidth / game.tileSize; x++) {
          arr.push({sx: x * game.tileSize, sy: y * game.tileSize, tileset: tileset.data.name})
        }
      }
      this.textures = [...arr]
    }
  }

  predrawLayers() {
    this.layers = (() => {
      let tileLayers = this.data.layers.filter(key => key.type === 'tilelayer'),
          layers = []
      for(let layer of tileLayers) {
        let layerObject = {
          name: layer.name,
          canvas: document.createElement('canvas')
        }
        layerObject.canvas.width = this.data.width * (game.tileSize * 2)
        layerObject.canvas.height = this.data.height * (game.tileSize * 2)
        layers.push(layerObject)
      }
      return layers
    })()

    for(const [xIndex, xVal] of this.#tiles.entries()) {
      for(const [yIndex, yVal] of this.#tiles[xIndex].entries()) {
        let currentTiles = this.#tiles[xIndex][yIndex]
        for(const currentTile of currentTiles) {
          let texture = this.textures[currentTile.tileId - 1],
              tilesetImage = this.tilesets.find(key => key.name === currentTile.tileset).image,
              ctx = this.layers.find(key => key.name === currentTile.layer).canvas.getContext('2d')

          ctx.imageSmoothingEnabled = false
          ctx.globalAlpha = 1
          ctx.drawImage(
            tilesetImage,
            texture.sx,
            texture.sy,
            game.tileSize,
            game.tileSize,
            currentTile.x,
            currentTile.y,
            game.tileSize * 2,
            game.tileSize * 2
          )
        }
      }
    }
  }

  draw() {
    let ctx = game.mainCanvas.getContext('2d')

    ctx.globalAlpha = 1
    
    for(let layer of this.layers) {
      ctx.drawImage(
        layer.canvas,
        -game.camera.transform.position.x,
        -game.camera.transform.position.y
      )
    }
  }

  init() {
    (async () => {
      super.init()

      await this.loadData()
      await this.loadTilesets()

      await Promise.all(this.tilesets.map(key => key.promise))

      this.generateTextures()
      this.loadObjects()
      this.generateMap()
      this.predrawLayers()
    })()
  }
}
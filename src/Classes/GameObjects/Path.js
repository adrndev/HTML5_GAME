import GameObject from "../GameObject.js"

export default class Path extends GameObject {
  constructor(config) {
    super(config)

    this.points = config.points
    this.id = config.id
  }
}
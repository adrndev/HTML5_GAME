const inputManager = {
  'KeyW': {
    description: "Player move up",
    keydown: function () {
      this.player.onStartMoving('up')
    },
    keyup: function () {
      this.player.onStopMoving('up')
    }
  },
  'KeyD': {
    description: "Player move right",
    keydown: function () {
      this.player.onStartMoving('right')
    },
    keyup: function () {
      this.player.onStopMoving('right')
    }
  },
  'KeyS': {
    description: "Player move down",
    keydown: function () {
      this.player.onStartMoving('down')
    },
    keyup: function () {
      this.player.onStopMoving('down')
    }
  },
  'KeyA': {
    description: "Player move left",
    keydown: function () {
      this.player.onStartMoving('left')
    },
    keyup: function () {
      this.player.onStopMoving('left')
    }
  }
}

export default inputManager
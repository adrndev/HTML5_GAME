import { game } from './game.js'

export function loadImage(src) {
  const promise = new Promise(resolve => {
    const image = new Image()

    image.onload = () => {
      resolve(image)
    }

    image.src = src
  })
  game.loadingPromises.push(promise)
  return promise
}

export function loadJson(src) {
  const promise = new Promise(async resolve => {
    const result = await fetch(src)
      .then(r => r.json())

    resolve(result)
  })
  game.loadingPromises.push(promise)
  return promise
}